import { Amenity } from '../../../../infrastructure/database/models/index.js';
import { NotFoundError } from '../../../../shared/errors/AppError.js';

export class GetAmenitiesUseCase {
  async getAll(tenantId) {
    return await Amenity.findAll({
      where: { tenant_id: tenantId, is_active: true },
      order: [['name', 'ASC']],
    });
  }

  async getById(id, tenantId) {
    const amenity = await Amenity.findOne({
      where: { id, tenant_id: tenantId },
    });
    if (!amenity) throw new NotFoundError('Amenity not found');
    return amenity;
  }
}