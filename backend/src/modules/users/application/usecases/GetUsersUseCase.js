import { User } from '../../../../infrastructure/database/models/index.js';
import { NotFoundError } from '../../../../shared/errors/AppError.js';

export class GetUsersUseCase {
  async getByTenant(tenantId) {
    return await User.findAll({
      where: { tenant_id: tenantId, is_active: true },
      attributes: { exclude: ['password_hash'] },
      order: [['last_name', 'ASC']],
    });
  }

  async getById(id, tenantId) {
    const where = { id };
    if (tenantId) where.tenant_id = tenantId;

    const user = await User.findOne({
      where,
      attributes: { exclude: ['password_hash'] },
    });

    if (!user) throw new NotFoundError('User not found');
    return user;
  }
}