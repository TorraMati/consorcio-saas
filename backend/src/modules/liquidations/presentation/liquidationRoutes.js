import { Router } from 'express';
import { LiquidationController } from './LiquidationController.js';
import { authenticate } from '../../../presentation/middlewares/authenticate.js';
import { authorize } from '../../../presentation/middlewares/authorize.js';
import { tenantContext } from '../../../presentation/middlewares/tenantContext.js';

const router = Router();
const ctrl = new LiquidationController();

router.use(authenticate, tenantContext);

router.get('/',           authorize('admin'), ctrl.getAll);
router.get('/:id',        authorize('admin'), ctrl.getById);
router.post('/',          authorize('admin'), ctrl.create);
router.post('/:id/publish', authorize('admin'), ctrl.publish);
router.delete('/:id',     authorize('admin'), ctrl.delete);

export default router;