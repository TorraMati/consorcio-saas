import { Tenant, User } from '../../../../infrastructure/database/models/index.js';
import { NotFoundError } from '../../../../shared/errors/AppError.js';

export class GetTenantUseCase {
  async getAll() {
    return await Tenant.findAll({
      order: [['created_at', 'DESC']],
    });
  }

  async getById(id) {
    const tenant = await Tenant.findByPk(id, {
      include: [{ model: User, attributes: ['id', 'email', 'first_name', 'last_name', 'role'] }],
    });
    if (!tenant) throw new NotFoundError('Tenant not found');
    return tenant;
  }
}
