import { Op } from 'sequelize';
import { Expense, InterestConfig, Tenant, User, Building } from '../../../../infrastructure/database/models/index.js';
import { SendNotificationUseCase } from '../../../notifications/application/usecases/SendNotificationUseCase.js';
import { logger } from '../../../../shared/utils/logger.js';

const notificationUseCase = new SendNotificationUseCase();

export class ApplyInterestUseCase {

  // Cron job: aplica interés a expensas vencidas
  async applyToOverdue() {
    const today = new Date().toISOString().split('T')[0];
    const tenants = await Tenant.findAll({ where: { is_active: true } });

    for (const tenant of tenants) {
      const config = await InterestConfig.findOne({ where: { tenant_id: tenant.id } });
      if (!config || !config.is_enabled) continue;

      // Calcular fecha límite con días de gracia
      const graceDateLimit = new Date();
      graceDateLimit.setDate(graceDateLimit.getDate() - config.grace_days);
      const graceLimit = graceDateLimit.toISOString().split('T')[0];

      // Buscar expensas vencidas sin interés aplicado
      const overdueExpenses = await Expense.findAll({
        where: {
          tenant_id: tenant.id,
          status: 'pending',
          due_date: { [Op.lt]: graceLimit },
          interest_applied: false,
        },
        include: [{ model: Building, attributes: ['owner_id', 'tenant_user_id'] }],
      });

      for (const expense of overdueExpenses) {
        // Interés simple: monto * porcentaje / 100
        const interestAmount = parseFloat(expense.amount) * config.percentage / 100;
        const newAmount = parseFloat(expense.amount) + interestAmount;

        await expense.update({
          amount: newAmount,
          interest_applied: true,
          interest_amount: interestAmount,
          status: 'overdue',
        });

        // Notificar al propietario
        const userId = expense.Building?.owner_id || expense.Building?.tenant_user_id;
        if (userId) {
          await notificationUseCase.execute({
            tenant_id: tenant.id,
            user_id: userId,
            type: 'interest_applied',
            title: 'Interés aplicado a tu expensa',
            message: `Se aplicó un interés de $${interestAmount.toFixed(2)} a tu expensa del período ${expense.period}.`,
            channel: 'both',
          });
        }

        logger.info(`Interest applied to expense ${expense.id}: +$${interestAmount}`);
      }
    }
  }

  // Cron job: aviso 15 días antes del vencimiento
  async sendUpcomingWarnings() {
    const warningDate = new Date();
    warningDate.setDate(warningDate.getDate() + 15);
    const targetDate = warningDate.toISOString().split('T')[0];

    const upcomingExpenses = await Expense.findAll({
      where: { due_date: targetDate, status: 'pending' },
      include: [{ model: Building, attributes: ['owner_id', 'tenant_user_id'] }],
    });

    for (const expense of upcomingExpenses) {
      const userId = expense.Building?.owner_id || expense.Building?.tenant_user_id;
      if (userId) {
        await notificationUseCase.execute({
          tenant_id: expense.tenant_id,
          user_id: userId,
          type: 'interest_warning',
          title: 'Tu expensa vence en 15 días',
          message: `Tu expensa del período ${expense.period} por $${expense.amount} vence el ${expense.due_date}. Abonala a tiempo para evitar intereses.`,
          channel: 'both',
        });
      }
    }

    logger.info(`Sent ${upcomingExpenses.length} upcoming expense warnings`);
  }
}