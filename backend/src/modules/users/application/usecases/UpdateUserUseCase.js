import { User } from '../../../../infrastructure/database/models/index.js';
import { NotFoundError } from '../../../../shared/errors/AppError.js';

export class UpdateUserUseCase {
  async execute(id, dto, tenantId) {
    const where = { id };
    if (tenantId) where.tenant_id = tenantId;

    const user = await User.findOne({ where });
    if (!user) throw new NotFoundError('User not found');

    await user.update(dto);

    const { password_hash: _, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  async delete(id, tenantId) {
    const where = { id };
    if (tenantId) where.tenant_id = tenantId;

    const user = await User.findOne({ where });
    if (!user) throw new NotFoundError('User not found');

    await user.destroy();
    return { message: 'User deleted successfully' };
  }
}