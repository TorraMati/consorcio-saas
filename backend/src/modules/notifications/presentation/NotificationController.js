import { GetNotificationsUseCase } from '../application/usecases/GetNotificationsUseCase.js';

export class NotificationController {
  constructor() {
    this.getUseCase = new GetNotificationsUseCase();
  }

  getMine = async (req, res, next) => {
    try {
      const notifications = await this.getUseCase.getByUser(req.user.id, req.tenantId);
      res.json({ status: 'success', data: notifications });
    } catch (error) { next(error); }
  };

  getUnreadCount = async (req, res, next) => {
    try {
      const result = await this.getUseCase.getUnreadCount(req.user.id, req.tenantId);
      res.json({ status: 'success', data: result });
    } catch (error) { next(error); }
  };

  markAsRead = async (req, res, next) => {
    try {
      const result = await this.getUseCase.markAsRead(req.params.id, req.user.id);
      res.json({ status: 'success', data: result });
    } catch (error) { next(error); }
  };

  markAllAsRead = async (req, res, next) => {
    try {
      const result = await this.getUseCase.markAllAsRead(req.user.id, req.tenantId);
      res.json({ status: 'success', data: result });
    } catch (error) { next(error); }
  };
}