import { Tenant } from '../../infrastructure/database/models/index.js';
import { NotFoundError, ForbiddenError } from '../../shared/errors/AppError.js';

export const tenantContext = async (req, res, next) => {
  try {
    // Super admin no tiene tenant
    if (req.user?.role === 'super_admin') return next();

    const tenantId = req.user?.tenant_id;
    if (!tenantId) throw new ForbiddenError('No tenant associated');

    const tenant = await Tenant.findOne({
      where: { id: tenantId, is_active: true },
    });

    if (!tenant) throw new NotFoundError('Tenant not found or inactive');

    // Inyectar tenant en el request
    req.tenant = tenant;
    req.tenantId = tenant.id;
    next();
  } catch (error) {
    next(error);
  }
};