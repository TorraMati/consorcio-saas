import { Router } from 'express';
import { NewsController } from './NewsController.js';
import { authenticate } from '../../../presentation/middlewares/authenticate.js';
import { authorize } from '../../../presentation/middlewares/authorize.js';
import { tenantContext } from '../../../presentation/middlewares/tenantContext.js';

const router = Router();
const controller = new NewsController();

router.use(authenticate, tenantContext);

router.get('/', authorize('admin', 'owner', 'tenant'), controller.getAll);
router.get('/:id', authorize('admin', 'owner', 'tenant'), controller.getById);
router.post('/', authorize('admin'), controller.create);
router.patch('/:id/publish', authorize('admin'), controller.publish);
router.delete('/:id', authorize('admin'), controller.delete);

export default router;