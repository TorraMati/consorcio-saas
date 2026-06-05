import { Op } from 'sequelize';
import { Reservation, Amenity } from '../../../../infrastructure/database/models/index.js';
import { NotFoundError, ValidationError } from '../../../../shared/errors/AppError.js';

// Convierte HH:MM:SS o HH:MM a minutos
const toMinutes = (time) => {
  const parts = time.split(':').map(Number);
  return parts[0] * 60 + parts[1];
};

export class CreateReservationUseCase {
  async execute(dto) {
    const amenity = await Amenity.findOne({
      where: { id: dto.amenity_id, tenant_id: dto.tenant_id, is_active: true },
    });
    if (!amenity) throw new NotFoundError('Amenity not found or inactive');

    // Validar según tipo de amenity
    if (amenity.slot_type === 'hourly') {
      const openMins  = toMinutes(amenity.open_time);
      const closeMins = toMinutes(amenity.close_time);
      const startMins = toMinutes(dto.start_time);
      const endMins   = toMinutes(dto.end_time);

      // Detectar si cruza medianoche
      const crossesMidnight = closeMins <= openMins;

      let available;
      if (crossesMidnight) {
        // Horario nocturno: válido si start >= open O start < close
        available =
          (startMins >= openMins || startMins < closeMins) &&
          (endMins > openMins || endMins <= closeMins);
      } else {
        available = startMins >= openMins && endMins <= closeMins;
      }

      if (!available) {
        const fmt = (t) => t.substring(0, 5);
        throw new ValidationError(
          `Amenity is only available from ${fmt(amenity.open_time)} to ${fmt(amenity.close_time)}`
        );
      }
    }

    if (amenity.slot_type === 'shift') {
      const validShift = amenity.shifts?.some(
        s => s.start === dto.start_time && s.end === dto.end_time
      );
      if (!validShift) throw new ValidationError('Invalid shift selected');
    }

    // Validar start < end (salvo cruce de medianoche)
    if (dto.start_time === dto.end_time) {
      throw new ValidationError('Start time must be before end time');
    }

    // Validar fecha no pasada
    const today = new Date().toISOString().split('T')[0];
    if (dto.date < today) {
      throw new ValidationError('Cannot reserve a past date');
    }

    // Verificar límite de reservas por usuario
    if (amenity.max_reservations_per_user > 0) {
      const activeCount = await Reservation.count({
        where: {
          amenity_id: dto.amenity_id,
          user_id: dto.user_id,
          status: 'active',
        },
      });
      if (activeCount >= amenity.max_reservations_per_user) {
        throw new ValidationError(
          `You can only have ${amenity.max_reservations_per_user} active reservation(s) for this amenity`
        );
      }
    }

    // Verificar conflicto de horarios
    const conflict = await Reservation.findOne({
      where: {
        amenity_id: dto.amenity_id,
        date: dto.date,
        status: 'active',
        [Op.or]: [
          {
            start_time: { [Op.lt]: dto.end_time },
            end_time: { [Op.gt]: dto.start_time },
          },
        ],
      },
    });

    if (conflict) throw new ValidationError('This time slot is already reserved');

    return await Reservation.create(dto);
  }
}