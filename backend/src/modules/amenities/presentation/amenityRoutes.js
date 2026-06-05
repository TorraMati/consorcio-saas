import { Router } from 'express';
import { AmenityController } from './AmenityController.js';
import { authenticate } from '../../../presentation/middlewares/authenticate.js';
import { authorize } from '../../../presentation/middlewares/authorize.js';
import { tenantContext } from '../../../presentation/middlewares/tenantContext.js';
import { createAmenityValidation } from './amenityValidations.js';

const router = Router();
const controller = new AmenityController();

router.use(authenticate, tenantContext);

router.get('/', authorize('admin', 'owner', 'tenant'), controller.getAll);
router.get('/:id', authorize('admin', 'owner', 'tenant'), controller.getById);
router.post('/', authorize('admin'), createAmenityValidation, controller.create);
router.put('/:id', authorize('admin'), controller.update);
router.delete('/:id', authorize('admin'), controller.delete);

export default router;