import { Unit, User, Building } from '../../../../infrastructure/database/models/index.js';
import { NotFoundError } from '../../../../shared/errors/AppError.js';

const userAttrs = ['id', 'first_name', 'last_name', 'email', 'phone'];

export class GetUnitsUseCase {
  async getByBuilding(buildingId, tenantId) {
    return await Unit.findAll({
      where: { building_id: buildingId, tenant_id: tenantId },
      include: [
        { model: User, as: 'owner', attributes: userAttrs },
        { model: User, as: 'tenantUser', attributes: userAttrs },
      ],
      order: [['unit_number', 'ASC']],
    });
  }

  async getByTenant(tenantId) {
    return await Unit.findAll({
      where: { tenant_id: tenantId },
      include: [
        { model: Building, attributes: ['id', 'name'] },
        { model: User, as: 'owner', attributes: userAttrs },
        { model: User, as: 'tenantUser', attributes: userAttrs },
      ],
      order: [['unit_number', 'ASC']],
    });
  }

  async getById(id, tenantId) {
    const unit = await Unit.findOne({
      where: { id, tenant_id: tenantId },
      include: [
        { model: Building, attributes: ['id', 'name'] },
        { model: User, as: 'owner', attributes: userAttrs },
        { model: User, as: 'tenantUser', attributes: userAttrs },
      ],
    });
    if (!unit) throw new NotFoundError('Unit not found');
    return unit;
  }
}