import { CreateUnitUseCase } from '../application/usecases/CreateUnitUseCase.js';
import { GetUnitsUseCase } from '../application/usecases/GetUnitsUseCase.js';
import { UpdateUnitUseCase } from '../application/usecases/UpdateUnitUseCase.js';
import { CreateUnitDTO, UpdateUnitDTO } from '../application/dtos/UnitDTO.js';

export class UnitController {
  constructor() {
    this.createUseCase = new CreateUnitUseCase();
    this.getUseCase = new GetUnitsUseCase();
    this.updateUseCase = new UpdateUnitUseCase();
  }

  getByBuilding = async (req, res, next) => {
    try {
      const units = await this.getUseCase.getByBuilding(req.params.buildingId, req.tenantId);
      res.json({ status: 'success', data: units });
    } catch (error) { next(error); }
  };

  getAll = async (req, res, next) => {
    try {
      const units = await this.getUseCase.getByTenant(req.tenantId);
      res.json({ status: 'success', data: units });
    } catch (error) { next(error); }
  };

  getById = async (req, res, next) => {
    try {
      const unit = await this.getUseCase.getById(req.params.id, req.tenantId);
      res.json({ status: 'success', data: unit });
    } catch (error) { next(error); }
  };

  create = async (req, res, next) => {
    try {
      const dto = new CreateUnitDTO({ ...req.body, tenant_id: req.tenantId });
      const unit = await this.createUseCase.execute(dto);
      res.status(201).json({ status: 'success', data: unit });
    } catch (error) { next(error); }
  };

  update = async (req, res, next) => {
    try {
      const dto = new UpdateUnitDTO(req.body);
      const unit = await this.updateUseCase.execute(req.params.id, req.tenantId, dto);
      res.json({ status: 'success', data: unit });
    } catch (error) { next(error); }
  };

  delete = async (req, res, next) => {
    try {
      const result = await this.updateUseCase.delete(req.params.id, req.tenantId);
      res.json({ status: 'success', data: result });
    } catch (error) { next(error); }
  };
}