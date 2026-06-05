import { MercadoPagoConfig, Preference } from 'mercadopago';
import { Payment, Expense } from '../../../../infrastructure/database/models/index.js';
import { NotFoundError, ValidationError } from '../../../../shared/errors/AppError.js';

export class CreatePaymentUseCase {
  async execute(dto) {
    // Verificar que la expensa existe y pertenece al tenant
    const expense = await Expense.findOne({
      where: { id: dto.expense_id, tenant_id: dto.tenant_id },
    });
    if (!expense) throw new NotFoundError('Expense not found');
    if (expense.status === 'paid') throw new ValidationError('Expense already paid');

    // Pago por transferencia manual
    if (dto.method === 'transfer') {
      const payment = await Payment.create({
        tenant_id: dto.tenant_id,
        expense_id: dto.expense_id,
        user_id: dto.user_id,
        amount: expense.amount,
        method: 'transfer',
        status: 'pending',
      });
      return { payment, checkout_url: null };
    }

    // Pago por MercadoPago
    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN,
    });

    const preference = new Preference(client);
    const preferenceData = await preference.create({
      body: {
        items: [
          {
            title: `Expensa ${expense.period}`,
            quantity: 1,
            unit_price: parseFloat(expense.amount),
            currency_id: 'ARS',
          },
        ],
        external_reference: dto.expense_id,
        notification_url: `${process.env.APP_URL}/api/payments/webhook`,
        back_urls: {
          success: `${process.env.FRONTEND_URL}/payments/success`,
          failure: `${process.env.FRONTEND_URL}/payments/failure`,
          pending: `${process.env.FRONTEND_URL}/payments/pending`,
        },
        auto_return: 'approved',
      },
    });

    const payment = await Payment.create({
      tenant_id: dto.tenant_id,
      expense_id: dto.expense_id,
      user_id: dto.user_id,
      amount: expense.amount,
      method: 'mercadopago',
      status: 'pending',
      mp_preference_id: preferenceData.id,
    });

    return {
      payment,
      checkout_url: preferenceData.init_point,
    };
  }
}