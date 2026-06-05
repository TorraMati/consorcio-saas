import { Router } from 'express';
import { TenantLimitController } from './TenantLimitController.js';
import { authenticate } from '../../../presentation/middlewares/authenticate.js';
import { authorize } from '../../../presentation/middlewares/authorize.js';

const router = Router();
const controller = new TenantLimitController();

router.use(authenticate, authorize('super_admin'));

router.get('/system-config', controller.getSystemConfig);
router.put('/system-config', controller.setSystemConfig);
router.get('/', controller.getAll);
router.get('/:tenantId', controller.getByTenant);
router.put('/:tenantId', controller.set);

export default router;