import { Router } from 'express';
import { InterestController } from './InterestController.js';
import { authenticate } from '../../../presentation/middlewares/authenticate.js';
import { authorize } from '../../../presentation/middlewares/authorize.js';
import { tenantContext } from '../../../presentation/middlewares/tenantContext.js';

const router = Router();
const controller = new InterestController();

router.use(authenticate, tenantContext);

router.get('/config', authorize('admin'), controller.getConfig);
router.put('/config', authorize('admin'), controller.configure);
router.post('/apply', authorize('admin'), controller.applyManually);

export default router;