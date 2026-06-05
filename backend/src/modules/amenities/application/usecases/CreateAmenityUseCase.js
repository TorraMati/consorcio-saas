import { Amenity, TenantLimit } from '../../../../infrastructure/database/models/index.js';
import { ValidationError } from '../../../../shared/errors/AppError.js';

export class CreateAmenityUseCase {
  async execute(dto) {
    // Verificar límite de amenities
    const limit = await TenantLimit.findOne({ where: { tenant_id: dto.tenant_id } });
    if (limit) {
      const count = await Amenity.count({ where: { tenant_id: dto.tenant_id } });
      if (count >= limit.max_amenities) {
        throw new ValidationError(
          `Your plan allows a maximum of ${limit.max_amenities} amenity(s). Contact your administrator to upgrade.`
        );
      }
    }

    const existing = await Amenity.findOne({
      where: { tenant_id: dto.tenant_id, name: dto.name },
    });
    if (existing) throw new ValidationError('Amenity with that name already exists');

    // Validar según tipo de turno
    if (dto.slot_type === 'hourly') {
      if (!dto.open_time || !dto.close_time) {
        throw new ValidationError('Hourly amenities require open and close time');
      }
      // Permitir horarios que cruzan medianoche (ej: 20:00 a 02:00)
      // Solo validamos que no sean iguales
      if (dto.open_time === dto.close_time) {
        throw new ValidationError('Open and close time cannot be the same');
      }
    }

    if (dto.slot_type === 'shift' && (!dto.shifts || dto.shifts.length === 0)) {
      throw new ValidationError('Shift amenities require at least one shift');
    }

    return await Amenity.create(dto);
  }
}