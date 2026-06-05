import { Router } from 'express';
import { TenantController } from './TenantController.js';
import { authenticate } from '../../../presentation/middlewares/authenticate.js';
import { authorize } from '../../../presentation/middlewares/authorize.js';
import { createTenantValidation, updateTenantValidation } from './tenantValidations.js';

const router = Router();
const controller = new TenantController();

// Solo super_admin puede gestionar tenants
router.use(authenticate, authorize('super_admin'));

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', createTenantValidation, controller.create);
router.put('/:id', updateTenantValidation, controller.update);
router.delete('/:id', authorize('super_admin'), async (req, res, next) => {
  try {
    const { Tenant } = await import('../../../infrastructure/database/models/index.js');
    const { NotFoundError } = await import('../../../shared/errors/AppError.js');

    const tenant = await Tenant.findByPk(req.params.id);
    if (!tenant) throw new NotFoundError('Tenant not found');

    const permanent = req.query.permanent === 'true';

    if (permanent) {
      await tenant.destroy({ force: true });
    } else {
      await tenant.update({ is_active: false });
    }

    res.json({ status: 'success', data: { message: permanent ? 'Tenant permanently deleted' : 'Tenant deactivated' } });
  } catch (error) { next(error); }
});

export default router;