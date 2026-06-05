import { Router } from 'express';
import { AuthController } from './AuthController.js';
import { loginValidation, registerValidation } from './authValidations.js';
import { authenticate } from '../../../presentation/middlewares/authenticate.js';
import { optionalAuth } from '../../../presentation/middlewares/optionalAuth.js';

const router = Router();
const controller = new AuthController();

router.post('/login', loginValidation, controller.login);
router.post('/register', registerValidation, controller.register);
router.post('/refresh', controller.refreshToken);
router.get('/me', authenticate, controller.me);
router.post('/register', optionalAuth, registerValidation, controller.register);

export default router;