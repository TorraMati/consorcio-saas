import { CreateTenantUseCase } from '../application/usecases/CreateTenantUseCase.js';
import { GetTenantUseCase } from '../application/usecases/GetTenantUseCase.js';
import { UpdateTenantUseCase } from '../application/usecases/UpdateTenantUseCase.js';
import { CreateTenantDTO, UpdateTenantDTO } from '../application/dtos/TenantDTO.js';

export class TenantController {
  constructor() {
    this.createUseCase = new CreateTenantUseCase();
    this.getUseCase = new GetTenantUseCase();
    this.updateUseCase = new UpdateTenantUseCase();
  }

  getAll = async (req, res, next) => {
    try {
      const tenants = await this.getUseCase.getAll();
      res.json({ status: 'success', data: tenants });
    } catch (error) { next(error); }
  };

  getById = async (req, res, next) => {
    try {
      const tenant = await this.getUseCase.getById(req.params.id);
      res.json({ status: 'success', data: tenant });
    } catch (error) { next(error); }
  };

  create = async (req, res, next) => {
    try {
      const dto = new CreateTenantDTO(req.body);
      const tenant = await this.createUseCase.execute(dto);
      res.status(201).json({ status: 'success', data: tenant });
    } catch (error) { next(error); }
  };

  update = async (req, res, next) => {
    try {
      const dto = new UpdateTenantDTO(req.body);
      const tenant = await this.updateUseCase.execute(req.params.id, dto);
      res.json({ status: 'success', data: tenant });
    } catch (error) { next(error); }
  };

  delete = async (req, res, next) => {
    try {
      const result = await this.updateUseCase.delete(req.params.id);
      res.json({ status: 'success', data: result });
    } catch (error) { next(error); }
  };
}