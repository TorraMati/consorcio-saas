import { ManageLimitsUseCase } from '../application/usecases/ManageLimitsUseCase.js';

export class TenantLimitController {
  constructor() {
    this.useCase = new ManageLimitsUseCase();
  }

  getAll = async (req, res, next) => {
    try {
      const data = await this.useCase.getAllWithUsage();
      res.json({ status: 'success', data });
    } catch (error) { next(error); }
  };

  getByTenant = async (req, res, next) => {
    try {
      const data = await this.useCase.getLimits(req.params.tenantId);
      res.json({ status: 'success', data });
    } catch (error) { next(error); }
  };

  set = async (req, res, next) => {
    try {
      const data = await this.useCase.setLimits(req.params.tenantId, req.body);
      res.json({ status: 'success', data });
    } catch (error) { next(error); }
  };

  getSystemConfig = async (req, res, next) => {
    try {
      const data = await this.useCase.getSystemConfig();
      res.json({ status: 'success', data });
    } catch (error) { next(error); }
  };

  setSystemConfig = async (req, res, next) => {
    try {
      const data = await this.useCase.setSystemConfig(req.body);
      res.json({ status: 'success', data });
    } catch (error) { next(error); }
  };
}