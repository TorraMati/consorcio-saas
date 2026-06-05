import { MercadoPagoConfig, Payment as MPPayment } from 'mercadopago';
import { Payment, Expense } from '../../../../infrastructure/database/models/index.js';
import { logger } from '../../../../shared/utils/logger.js';

export class MercadoPagoWebhookUseCase {
  async execute(body) {
    // Solo procesar notificaciones de pagos
    if (body.type !== 'payment') return { received: true };

    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN,
    });

    const mpPayment = new MPPayment(client);
    const mpData = await mpPayment.get({ id: body.data.id });

    logger.info(`MP Webhook received: ${mpData.status} for ${mpData.external_reference}`);

    const payment = await Payment.findOne({
      where: { mp_preference_id: mpData.preference_id },
    });

    if (!payment) return { received: true };

    // Actualizar estado según respuesta de MP
    const statusMap = {
      approved: 'approved',
      rejected: 'rejected',
      pending: 'pending',
    };

    const newStatus = statusMap[mpData.status] || 'pending';

    await payment.update({
      status: newStatus,
      mp_payment_id: String(mpData.id),
      paid_at: newStatus === 'approved' ? new Date() : null,
    });

    // Si fue aprobado, marcar la expensa como pagada
    if (newStatus === 'approved') {
      await Expense.update(
        { status: 'paid' },
        { where: { id: payment.expense_id } }
      );
    }

    return { received: true };
  }
}