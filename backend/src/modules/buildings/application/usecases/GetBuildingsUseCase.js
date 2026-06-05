import { Building, User } from '../../../../infrastructure/database/models/index.js';
import { NotFoundError } from '../../../../shared/errors/AppError.js';

const userAttributes = ['id', 'first_name', 'last_name', 'email', 'phone'];

export class GetBuildingsUseCase {
  async getAll(tenantId) {
    return await Building.findAll({
      where: { tenant_id: tenantId },
      include: [
        { model: User, as: 'owner', attributes: userAttributes },
        { model: User, as: 'tenantUser', attributes: userAttributes },
      ],
      order: [['unit_number', 'ASC']],
    });
  }

  async getById(id, tenantId) {
    const building = await Building.findOne({
      where: { id, tenant_id: tenantId },
      include: [
        { model: User, as: 'owner', attributes: userAttributes },
        { model: User, as: 'tenantUser', attributes: userAttributes },
      ],
    });
    if (!building) throw new NotFoundError('Building unit not found');
    return building;
  }
}