import { Expense, Building } from '../../../../infrastructure/database/models/index.js';
import { ValidationError, NotFoundError } from '../../../../shared/errors/AppError.js';

export class CreateExpenseUseCase {
  async execute(dto) {
    // Verificar que la unidad existe y pertenece al tenant
    const building = await Building.findOne({
      where: { id: dto.building_id, tenant_id: dto.tenant_id },
    });
    if (!building) throw new NotFoundError('Building unit not found');

    // Verificar que no exista una expensa para ese período y unidad
    const existing = await Expense.findOne({
      where: {
        building_id: dto.building_id,
        period: dto.period,
        tenant_id: dto.tenant_id,
      },
    });
    if (existing) throw new ValidationError(`Expense for period ${dto.period} already exists for this unit`);

    return await Expense.create(dto);
  }
}