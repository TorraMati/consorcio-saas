import { Payment, Expense } from '../../../../infrastructure/database/models/index.js';
import { NotFoundError, ValidationError } from '../../../../shared/errors/AppError.js';

export class ConfirmTransferUseCase {
  async execute(paymentId, tenantId) {
    const payment = await Payment.findOne({
      where: { id: paymentId, tenant_id: tenantId, method: 'transfer' },
    });
    if (!payment) throw new NotFoundError('Payment not found');
    if (payment.status !== 'pending') {
      throw new ValidationError('Payment is not pending');
    }

    // Aprobar el pago
    await payment.update({
      status: 'approved',
      paid_at: new Date(),
    });

    // Marcar la expensa como pagada
    await Expense.update(
      { status: 'paid' },
      { where: { id: payment.expense_id } }
    );

    return payment;
  }
}