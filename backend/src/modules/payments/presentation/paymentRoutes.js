import { Router } from 'express';
import { PaymentController } from './PaymentController.js';
import { authenticate } from '../../../presentation/middlewares/authenticate.js';
import { authorize } from '../../../presentation/middlewares/authorize.js';
import { tenantContext } from '../../../presentation/middlewares/tenantContext.js';
import { createPaymentValidation } from './paymentValidations.js';

const router = Router();
const controller = new PaymentController();

// Webhook NO necesita auth (viene de MercadoPago)
router.post('/webhook', controller.webhook);

router.use(authenticate, tenantContext);

router.get('/', authorize('admin', 'super_admin'), controller.getAll);
router.get('/:id', authorize('admin', 'super_admin', 'owner', 'tenant'), controller.getById);
router.post('/', authorize('owner', 'tenant', 'admin'), createPaymentValidation, controller.create);
router.patch('/:id/confirm-transfer', authorize('admin'), controller.confirmTransfer);

router.get('/my', authorize('owner', 'tenant'), async (req, res, next) => {
  try {
    const { Payment, Expense } = await import('../../../infrastructure/database/models/index.js');

    const payments = await Payment.findAll({
      where: { user_id: req.user.id, tenant_id: req.tenantId },
      include: [{ model: Expense, attributes: ['period', 'due_date'] }],
      order: [['created_at', 'DESC']],
    });

    res.json({ status: 'success', data: payments });
  } catch (error) { next(error); }
});

// Confirmar transferencia manualmente
router.patch('/:id/confirm', authorize('admin', 'super_admin'), async (req, res, next) => {
  try {
    const { Payment, Expense } = await import('../../../infrastructure/database/models/index.js');
    const { NotFoundError, ValidationError } = await import('../../../shared/errors/AppError.js');

    const payment = await Payment.findOne({
      where: { id: req.params.id, tenant_id: req.tenantId },
    });
    if (!payment) throw new NotFoundError('Payment not found');
    if (payment.status !== 'pending') throw new ValidationError('Payment is not pending');

    await payment.update({ status: 'approved', paid_at: new Date() });
    await Expense.update({ status: 'paid' }, { where: { id: payment.expense_id } });

    res.json({ status: 'success', data: payment });
  } catch (error) { next(error); }
});

// Rechazar pago manualmente
router.patch('/:id/reject', authorize('admin', 'super_admin'), async (req, res, next) => {
  try {
    const { Payment } = await import('../../../infrastructure/database/models/index.js');
    const { NotFoundError, ValidationError } = await import('../../../shared/errors/AppError.js');

    const payment = await Payment.findOne({
      where: { id: req.params.id, tenant_id: req.tenantId },
    });
    if (!payment) throw new NotFoundError('Payment not found');
    if (payment.status !== 'pending') throw new ValidationError('Payment is not pending');

    await payment.update({ status: 'rejected' });
    res.json({ status: 'success', data: payment });
  } catch (error) { next(error); }
});

export default router;