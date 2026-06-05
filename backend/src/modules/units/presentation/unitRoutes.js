import { Router } from 'express';
import { UnitController } from './UnitController.js';
import { authenticate } from '../../../presentation/middlewares/authenticate.js';
import { authorize } from '../../../presentation/middlewares/authorize.js';
import { tenantContext } from '../../../presentation/middlewares/tenantContext.js';

const router = Router();
const controller = new UnitController();

router.use(authenticate, tenantContext);

router.get('/', authorize('admin', 'super_admin'), controller.getAll);
router.get('/building/:buildingId', authorize('admin', 'super_admin', 'owner', 'tenant'), controller.getByBuilding);
router.get('/:id', authorize('admin', 'super_admin'), controller.getById);
router.post('/', authorize('admin', 'super_admin'), controller.create);
router.put('/:id', authorize('admin', 'super_admin'), controller.update);
router.delete('/:id', authorize('admin', 'super_admin'), controller.delete);

export default router;