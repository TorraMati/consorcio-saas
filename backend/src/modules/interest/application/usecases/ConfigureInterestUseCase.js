import { InterestConfig } from '../../../../infrastructure/database/models/index.js';

export class ConfigureInterestUseCase {
  async execute(tenantId, dto) {
    const [config] = await InterestConfig.upsert({
      tenant_id: tenantId,
      is_enabled: dto.is_enabled,
      percentage: dto.percentage,
      grace_days: dto.grace_days,
    });
    return config;
  }

  async getConfig(tenantId) {
    const config = await InterestConfig.findOne({ where: { tenant_id: tenantId } });
    return config || { is_enabled: false, percentage: 0, grace_days: 0 };
  }
}