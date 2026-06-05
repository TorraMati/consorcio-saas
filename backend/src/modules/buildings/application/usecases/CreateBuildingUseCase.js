import { Building, TenantLimit } from '../../../../infrastructure/database/models/index.js';
import { ValidationError } from '../../../../shared/errors/AppError.js';

export class CreateBuildingUseCase {
  async execute(dto) {
    // Verificar límite de edificios
    const limit = await TenantLimit.findOne({ where: { tenant_id: dto.tenant_id } });
    if (limit) {
      const count = await Building.count({ where: { tenant_id: dto.tenant_id } });
      if (count >= limit.max_buildings) {
        throw new ValidationError(
          `Your plan allows a maximum of ${limit.max_buildings} building(s). Contact your administrator to upgrade.`
        );
      }
    }

    const existing = await Building.findOne({
      where: { tenant_id: dto.tenant_id, name: dto.name },
    });
    if (existing) throw new ValidationError('A building with that name already exists');

    return await Building.create(dto);
  }
}