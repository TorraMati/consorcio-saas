import { Router } from 'express';
import { ReservationController } from './ReservationController.js';
import { authenticate } from '../../../presentation/middlewares/authenticate.js';
import { authorize } from '../../../presentation/middlewares/authorize.js';
import { tenantContext } from '../../../presentation/middlewares/tenantContext.js';
import { createReservationValidation } from './reservationValidations.js';

const router = Router();
const controller = new ReservationController();

router.use(authenticate, tenantContext);

router.get('/', authorize('admin'), controller.getAll);
router.get('/mine', authorize('admin', 'owner', 'tenant'), controller.getMine);
router.get('/slots/:amenityId', authorize('admin', 'owner', 'tenant'), controller.getAvailableSlots);
router.post('/', authorize('admin', 'owner', 'tenant'), createReservationValidation, controller.create);
router.patch('/:id/cancel', authorize('admin', 'owner', 'tenant'), controller.cancel);

export default router;