import { Building } from '../../../../infrastructure/database/models/index.js';
import { NotFoundError } from '../../../../shared/errors/AppError.js';

export class UpdateBuildingUseCase {
  async execute(id, tenantId, dto) {
    const building = await Building.findOne({ where: { id, tenant_id: tenantId } });
    if (!building) throw new NotFoundError('Building unit not found');
    await building.update(dto);
    return building;
  }

  async delete(id, tenantId) {
    const building = await Building.findOne({ where: { id, tenant_id: tenantId } });
    if (!building) throw new NotFoundError('Building unit not found');
    await building.destroy();
    return { message: 'Unit deleted successfully' };
  }
}