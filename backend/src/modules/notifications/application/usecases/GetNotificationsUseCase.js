import { Notification } from '../../../../infrastructure/database/models/index.js';

export class GetNotificationsUseCase {
  async getByUser(userId, tenantId) {
    return await Notification.findAll({
      where: { user_id: userId, tenant_id: tenantId, channel: 'in_app' },
      order: [['created_at', 'DESC']],
      limit: 50,
    });
  }

  async markAsRead(id, userId) {
    await Notification.update(
      { is_read: true },
      { where: { id, user_id: userId } }
    );
    return { message: 'Notification marked as read' };
  }

  async markAllAsRead(userId, tenantId) {
    await Notification.update(
      { is_read: true },
      { where: { user_id: userId, tenant_id: tenantId, is_read: false } }
    );
    return { message: 'All notifications marked as read' };
  }

  async getUnreadCount(userId, tenantId) {
    const count = await Notification.count({
      where: { user_id: userId, tenant_id: tenantId, is_read: false, channel: 'in_app' },
    });
    return { count };
  }
}