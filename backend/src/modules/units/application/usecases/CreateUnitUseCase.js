import { Unit, TenantLimit } from '../../../../infrastructure/database/models/index.js';
import { ValidationError, NotFoundError } from '../../../../shared/errors/AppError.js';

export class CreateUnitUseCase {
  async execute(dto) {
    // Verificar límite de unidades
    const limit = await TenantLimit.findOne({ where: { tenant_id: dto.tenant_id } });
    if (limit) {
      const count = await Unit.count({ where: { tenant_id: dto.tenant_id } });
      if (count >= limit.max_units) {
        throw new ValidationError(
          `Your plan allows a maximum of ${limit.max_units} unit(s). Contact your administrator to upgrade.`
        );
      }
    }

    const existing = await Unit.findOne({
      where: { building_id: dto.building_id, unit_number: dto.unit_number },
    });
    if (existing) throw new ValidationError('Unit number already exists in this building');

    return await Unit.create(dto);
  }
}