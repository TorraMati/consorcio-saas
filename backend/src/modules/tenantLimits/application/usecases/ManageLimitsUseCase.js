import { TenantLimit, Tenant, SystemConfig } from '../../../../infrastructure/database/models/index.js';
import { NotFoundError } from '../../../../shared/errors/AppError.js';

export class ManageLimitsUseCase {
  async getSystemConfig() {
    const config = await SystemConfig.findOne();
    return config || { price_per_unit: 500, price_per_amenity: 200 };
  }

  async setSystemConfig({ price_per_unit, price_per_amenity }) {
    let config = await SystemConfig.findOne();
    if (config) {
      await config.update({ price_per_unit, price_per_amenity });
    } else {
      config = await SystemConfig.create({ price_per_unit, price_per_amenity });
    }
    return config;
  }

  calculateMonthlyPrice(max_units, max_amenities, price_per_unit, price_per_amenity) {
    return (max_units * parseFloat(price_per_unit)) +
           (max_amenities * parseFloat(price_per_amenity));
  }

  async setLimits(tenantId, { max_buildings, max_units, max_amenities }) {
    const tenant = await Tenant.findByPk(tenantId);
    if (!tenant) throw new NotFoundError('Tenant not found');

    const sysConfig = await this.getSystemConfig();
    const monthly_price = this.calculateMonthlyPrice(
      max_units, max_amenities,
      sysConfig.price_per_unit, sysConfig.price_per_amenity
    );

    const [limit] = await TenantLimit.upsert({
      tenant_id: tenantId,
      max_buildings,
      max_units,
      max_amenities,
      monthly_price,
      price_per_unit: sysConfig.price_per_unit,
      price_per_amenity: sysConfig.price_per_amenity,
    });
    return { ...limit.dataValues, monthly_price };
  }

  async getLimits(tenantId) {
    const limit = await TenantLimit.findOne({ where: { tenant_id: tenantId } });
    return limit || { max_buildings: 1, max_units: 10, max_amenities: 2, monthly_price: 0 };
  }

  async getAllWithUsage() {
    const { Building, Unit, Amenity } = await import('../../../../infrastructure/database/models/index.js');

    const tenants = await Tenant.findAll({
      include: [{ model: TenantLimit }],
    });

    const sysConfig = await this.getSystemConfig();

    const result = await Promise.all(tenants.map(async (tenant) => {
      const [buildings, units, amenities] = await Promise.all([
        Building.count({ where: { tenant_id: tenant.id } }),
        Unit.count({ where: { tenant_id: tenant.id } }),
        Amenity.count({ where: { tenant_id: tenant.id } }),
      ]);

      const limits = tenant.TenantLimit || {
        max_buildings: 1, max_units: 10, max_amenities: 2,
      };

      const monthly_price = this.calculateMonthlyPrice(
        limits.max_units, limits.max_amenities,
        sysConfig.price_per_unit, sysConfig.price_per_amenity
      );

      return {
        tenant: { id: tenant.id, name: tenant.name, slug: tenant.slug, is_active: tenant.is_active },
        limits: { ...limits.dataValues || limits, monthly_price },
        usage: { buildings, units, amenities },
        monthly_price,
      };
    }));

    return { tenants: result, system_config: sysConfig };
  }
}