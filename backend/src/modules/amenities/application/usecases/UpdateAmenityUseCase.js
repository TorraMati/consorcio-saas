import { Amenity } from '../../../../infrastructure/database/models/index.js';
import { NotFoundError } from '../../../../shared/errors/AppError.js';

export class UpdateAmenityUseCase {
  async execute(id, tenantId, dto) {
    const amenity = await Amenity.findOne({ where: { id, tenant_id: tenantId } });
    if (!amenity) throw new NotFoundError('Amenity not found');
    await amenity.update(dto);
    return amenity;
  }

  async delete(id, tenantId) {
    const amenity = await Amenity.findOne({ where: { id, tenant_id: tenantId } });
    if (!amenity) throw new NotFoundError('Amenity not found');
    await amenity.destroy();
    return { message: 'Amenity deleted successfully' };
  }
}