import { Expense } from '../../../../infrastructure/database/models/index.js';
import { NotFoundError, ValidationError } from '../../../../shared/errors/AppError.js';

export class UpdateExpenseUseCase {
  async execute(id, tenantId, dto) {
    const expense = await Expense.findOne({ where: { id, tenant_id: tenantId } });
    if (!expense) throw new NotFoundError('Expense not found');
    if (expense.status === 'paid') throw new ValidationError('Cannot modify a paid expense');
    await expense.update(dto);
    return expense;
  }

  async delete(id, tenantId) {
    const expense = await Expense.findOne({ where: { id, tenant_id: tenantId } });
    if (!expense) throw new NotFoundError('Expense not found');
    if (expense.status === 'paid') throw new ValidationError('Cannot delete a paid expense');
    await expense.destroy();
    return { message: 'Expense deleted successfully' };
  }
}