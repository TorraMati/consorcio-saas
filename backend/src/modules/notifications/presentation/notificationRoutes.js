import { Router } from 'express';
import { NotificationController } from './NotificationController.js';
import { authenticate } from '../../../presentation/middlewares/authenticate.js';
import { tenantContext } from '../../../presentation/middlewares/tenantContext.js';

const router = Router();
const controller = new NotificationController();

router.use(authenticate, tenantContext);

router.get('/', controller.getMine);
router.get('/unread-count', controller.getUnreadCount);
router.patch('/:id/read', controller.markAsRead);
router.patch('/read-all', controller.markAllAsRead);

export default router;