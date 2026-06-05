import { Expense, Building, Payment } from '../../../../infrastructure/database/models/index.js';
import { NotFoundError } from '../../../../shared/errors/AppError.js';

export class GetExpensesUseCase {
  async getByTenant(tenantId, filters = {}) {
    const where = { tenant_id: tenantId };
    if (filters.status) where.status = filters.status;
    if (filters.period) where.period = filters.period;

    return await Expense.findAll({
      where,
      include: [{ model: Building, attributes: ['id', 'unit_number', 'floor'] }],
      order: [['due_date', 'DESC']],
    });
  }

  async getByBuilding(buildingId, tenantId) {
    return await Expense.findAll({
      where: { building_id: buildingId, tenant_id: tenantId },
      include: [{ model: Payment, attributes: ['id', 'status', 'method', 'amount', 'paid_at'] }],
      order: [['period', 'DESC']],
    });
  }

  async getById(id, tenantId) {
    const expense = await Expense.findOne({
      where: { id, tenant_id: tenantId },
      include: [
        { model: Building, attributes: ['id', 'unit_number', 'floor'] },
        { model: Payment },
      ],
    });
    if (!expense) throw new NotFoundError('Expense not found');
    return expense;
  }
}