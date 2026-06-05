import { Router } from 'express';
import { authenticate } from '../../../presentation/middlewares/authenticate.js';
import { authorize } from '../../../presentation/middlewares/authorize.js';
import { User } from '../../../infrastructure/database/models/index.js';
import bcrypt from 'bcryptjs';

const router = Router();

router.use(authenticate, authorize('super_admin'));

router.get('/dashboard', async (req, res, next) => {
  try {
    const { Tenant, User, TenantLimit, Building, Unit, Payment } = await import('../../../infrastructure/database/models/index.js');

    const tenants = await Tenant.findAll({
      where: { is_active: true },
      include: [{ model: TenantLimit }],
    });

    const tenantsData = await Promise.all(tenants.map(async (tenant) => {
      const [users, buildings, units, payments] = await Promise.all([
        User.count({ where: { tenant_id: tenant.id } }),
        Building.count({ where: { tenant_id: tenant.id } }),
        Unit.count({ where: { tenant_id: tenant.id } }),
        Payment.findAll({
          where: { tenant_id: tenant.id, status: 'approved' },
          attributes: ['amount'],
        }),
      ]);

      const totalCollected = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
      const monthlyPrice = tenant.TenantLimit?.monthly_price || 0;

      return {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        users,
        buildings,
        units,
        total_collected: totalCollected,
        monthly_price: monthlyPrice,
        limits: tenant.TenantLimit || {
          max_buildings: 1,
          max_units: 10,
          max_amenities: 2,
        },
      };
    }));

    const totalRevenue = tenantsData.reduce((sum, t) => sum + t.monthly_price, 0);
    const totalCollectedAll = tenantsData.reduce((sum, t) => sum + t.total_collected, 0);

    res.json({
      status: 'success',
      data: {
        total_tenants: tenants.length,
        total_revenue: totalRevenue,
        total_collected: totalCollectedAll,
        tenants: tenantsData,
      },
    });
  } catch (error) { next(error); }
});

// Crear admin para un tenant
router.post('/tenants/:tenantId/admin', async (req, res, next) => {
  try {
    const { first_name, last_name, email, password, phone } = req.body;
    const { tenantId } = req.params;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ status: 'error', message: 'Email already in use' });
    }

    const password_hash = await bcrypt.hash(password, 12);
    const user = await User.create({
      tenant_id: tenantId,
      email,
      password_hash,
      first_name,
      last_name,
      phone: phone || null,
      role: 'admin',
    });

    const { password_hash: _, ...userWithoutPassword } = user.dataValues;
    res.status(201).json({ status: 'success', data: userWithoutPassword });
  } catch (error) { next(error); }
});

// Reactivar tenant
router.patch('/tenants/:tenantId/activate', async (req, res, next) => {
  try {
    const { Tenant } = await import('../../../infrastructure/database/models/index.js');

    // Buscar incluso inactivos con where explícito
    const tenant = await Tenant.findOne({
      where: { id: req.params.tenantId },
    });

    if (!tenant) {
      return res.status(404).json({ status: 'error', message: 'Tenant not found' });
    }

    await tenant.update({ is_active: true });
    res.json({ status: 'success', data: tenant });
  } catch (error) { next(error); }
});

export default router;