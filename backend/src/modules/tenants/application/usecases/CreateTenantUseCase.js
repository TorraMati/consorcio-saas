import { Tenant } from '../../../../infrastructure/database/models/index.js';
import { ValidationError } from '../../../../shared/errors/AppError.js';

export class CreateTenantUseCase {
  async execute(dto) {
    const existing = await Tenant.findOne({ where: { slug: dto.slug } });
    if (existing) throw new ValidationError('A tenant with that name already exists');

    const tenant = await Tenant.create({
      name: dto.name,
      slug: dto.slug,
      address: dto.address,
      cuit: dto.cuit,
    });

    return tenant;
  }
}