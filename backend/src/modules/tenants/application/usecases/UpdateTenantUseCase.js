import { Tenant } from '../../../../infrastructure/database/models/index.js';
import { NotFoundError } from '../../../../shared/errors/AppError.js';

export class UpdateTenantUseCase {
  async execute(id, dto) {
    const tenant = await Tenant.findByPk(id);
    if (!tenant) throw new NotFoundError('Tenant not found');
    await tenant.update(dto);
    return tenant;
  }

  async delete(id) {
    const tenant = await Tenant.findByPk(id);
    if (!tenant) throw new NotFoundError('Tenant not found');
    await tenant.destroy(); // Soft delete
    return { message: 'Tenant deleted successfully' };
  }
}