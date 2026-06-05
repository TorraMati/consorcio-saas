import { Unit } from '../../../../infrastructure/database/models/index.js';
import { NotFoundError } from '../../../../shared/errors/AppError.js';

export class UpdateUnitUseCase {
  async execute(id, tenantId, dto) {
    const unit = await Unit.findOne({ where: { id, tenant_id: tenantId } });
    if (!unit) throw new NotFoundError('Unit not found');
    await unit.update(dto);
    return unit;
  }

  async delete(id, tenantId) {
    const unit = await Unit.findOne({ where: { id, tenant_id: tenantId } });
    if (!unit) throw new NotFoundError('Unit not found');
    await unit.destroy();
    return { message: 'Unit deleted successfully' };
  }
}