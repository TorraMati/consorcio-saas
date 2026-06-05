import { Payment, Expense, Unit, Building } from '../../../../infrastructure/database/models/index.js';
import { NotFoundError } from '../../../../shared/errors/AppError.js';

export class GetPaymentsUseCase {
  async getByTenant(tenantId) {
    return await Payment.findAll({
      where: { tenant_id: tenantId },
      include: [
        {
          model: Expense,
          attributes: ['id', 'period', 'due_date', 'amount'],
          include: [
            {
              model: Unit,
              attributes: ['unit_number', 'floor'],
              include: [{ model: Building, attributes: ['name'] }],
            },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  async getById(id, tenantId) {
    const payment = await Payment.findOne({
      where: { id, tenant_id: tenantId },
      include: [{ model: Expense }],
    });
    if (!payment) throw new NotFoundError('Payment not found');
    return payment;
  }
}