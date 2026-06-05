import { Router } from 'express';
import { ExpenseController } from './ExpenseController.js';
import { authenticate } from '../../../presentation/middlewares/authenticate.js';
import { authorize } from '../../../presentation/middlewares/authorize.js';
import { tenantContext } from '../../../presentation/middlewares/tenantContext.js';
import { createExpenseValidation } from './expenseValidations.js';
import { Op } from 'sequelize';

const router = Router();
const controller = new ExpenseController();

router.use(authenticate, tenantContext);

// Resumen del mes actual
router.get('/summary/current-month', authorize('admin', 'super_admin'), async (req, res, next) => {
  try {
    const { Expense, Payment } = await import('../../../infrastructure/database/models/index.js');
    const { Op } = await import('sequelize');

    const now = new Date();
    const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const [expenses, payments] = await Promise.all([
      Expense.findAll({
        where: { tenant_id: req.tenantId, period },
      }),
      Payment.findAll({
        where: {
          tenant_id: req.tenantId,
          status: 'approved',
          paid_at: {
            [Op.gte]: new Date(now.getFullYear(), now.getMonth(), 1),
            [Op.lte]: new Date(now.getFullYear(), now.getMonth() + 1, 0),
          },
        },
      }),
    ]);

    const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const totalCollected = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const pending = expenses.filter(e => e.status === 'pending').length;
    const paid = expenses.filter(e => e.status === 'paid').length;
    const overdue = expenses.filter(e => e.status === 'overdue').length;

    res.json({
      status: 'success',
      data: {
        period,
        total_expenses: totalExpenses,
        total_collected: totalCollected,
        pending_count: pending,
        paid_count: paid,
        overdue_count: overdue,
        collection_rate: totalExpenses > 0
          ? Math.round((totalCollected / totalExpenses) * 100)
          : 0,
      },
    });
  } catch (error) { next(error); }
});

// ⚠️ Rutas específicas SIEMPRE antes de las rutas con parámetros como /:id
router.get('/my', authorize('owner', 'tenant'), async (req, res, next) => {
  try {
    const { Unit, Expense } = await import('../../../infrastructure/database/models/index.js');

    const units = await Unit.findAll({
      where: {
        tenant_id: req.tenantId,
        [Op.or]: [
          { owner_id: req.user.id },
          { tenant_user_id: req.user.id },
        ],
      },
    });

    const unitIds = units.map(u => u.id);

    if (unitIds.length === 0) {
      return res.json({ status: 'success', data: [] });
    }

    const expenses = await Expense.findAll({
      where: { unit_id: unitIds, tenant_id: req.tenantId },
      include: [{ model: Unit, attributes: ['unit_number', 'floor', 'percentage'] }],
      order: [['period', 'DESC']],
    });

    res.json({ status: 'success', data: expenses });
  } catch (error) { next(error); }
});

router.get('/', authorize('admin', 'super_admin', 'owner', 'tenant'), controller.getAll);
router.get('/building/:buildingId', authorize('admin', 'super_admin'), controller.getByBuilding);
router.get('/:id', authorize('admin', 'super_admin', 'owner', 'tenant'), controller.getById);
router.post('/', authorize('admin', 'super_admin'), createExpenseValidation, controller.create);
router.put('/:id', authorize('admin', 'super_admin'), controller.update);
router.delete('/:id', authorize('admin', 'super_admin'), controller.delete);

export default router;