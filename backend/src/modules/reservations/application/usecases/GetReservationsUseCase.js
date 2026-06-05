import { Reservation, Amenity, User } from '../../../../infrastructure/database/models/index.js';
import { NotFoundError } from '../../../../shared/errors/AppError.js';

export class GetReservationsUseCase {
  async getByTenant(tenantId, filters = {}) {
    const where = { tenant_id: tenantId };
    if (filters.date) where.date = filters.date;
    if (filters.amenity_id) where.amenity_id = filters.amenity_id;
    if (filters.status) where.status = filters.status;

    return await Reservation.findAll({
      where,
      include: [
        { model: Amenity, attributes: ['id', 'name'] },
        { model: User, attributes: ['id', 'first_name', 'last_name', 'email'] },
      ],
      order: [['date', 'ASC'], ['start_time', 'ASC']],
    });
  }

  async getByUser(userId, tenantId) {
    return await Reservation.findAll({
      where: { user_id: userId, tenant_id: tenantId },
      include: [{ model: Amenity, attributes: ['id', 'name'] }],
      order: [['date', 'DESC']],
    });
  }

  async getAvailableSlots(amenityId, date, tenantId) {
    const normalizeTime = (time) => time ? time.substring(0, 5) : time;

    const amenity = await Amenity.findOne({
      where: { id: amenityId, tenant_id: tenantId },
    });
    if (!amenity) throw new NotFoundError('Amenity not found');

    // Traer reservas ANTES de usarlas
    const reservations = await Reservation.findAll({
      where: { amenity_id: amenityId, date, status: 'active' },
      attributes: ['start_time', 'end_time'],
    });

    // Tipo turno (shift)
    if (amenity.slot_type === 'shift') {
      const shiftsData = typeof amenity.shifts === 'string'
        ? JSON.parse(amenity.shifts)
        : amenity.shifts;

      if (!shiftsData || shiftsData.length === 0) {
        return { amenity, date, slots: [] };
      }

      const slots = shiftsData.map(shift => {
        const isOccupied = reservations.some(
          r => normalizeTime(r.start_time) === shift.start &&
              normalizeTime(r.end_time) === shift.end
        );
        return {
          start_time: shift.start,
          end_time: shift.end,
          name: shift.name,
          available: !isOccupied,
        };
      });
      return { amenity, date, slots };
    }

    // Tipo por hora (hourly)
    if (!amenity.open_time || !amenity.close_time) {
      return { amenity, date, slots: [] };
    }

    const slots = [];
    const toMinutes = (time) => {
      const [h, m] = time.split(':').map(Number);
      return h * 60 + m;
    };
    const toTime = (minutes) => {
      const totalMins = ((minutes % 1440) + 1440) % 1440;
      const h = Math.floor(totalMins / 60).toString().padStart(2, '0');
      const m = (totalMins % 60).toString().padStart(2, '0');
      return `${h}:${m}`;
    };

    let currentMinutes = toMinutes(normalizeTime(amenity.open_time));
    const closeMinutes = toMinutes(normalizeTime(amenity.close_time));
    const duration = amenity.slot_duration_minutes;

    const adjustedClose = closeMinutes <= currentMinutes
      ? closeMinutes + 1440
      : closeMinutes;

    while (currentMinutes + duration <= adjustedClose) {
      const startTime = toTime(currentMinutes);
      const endTime = toTime(currentMinutes + duration);

      const isOccupied = reservations.some(
        r => normalizeTime(r.start_time) === startTime &&
            normalizeTime(r.end_time) === endTime
      );

      slots.push({ start_time: startTime, end_time: endTime, available: !isOccupied });
      currentMinutes += duration;
    }

    return { amenity, date, slots };
  }
}