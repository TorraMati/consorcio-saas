import { CreateAmenityUseCase } from '../application/usecases/CreateAmenityUseCase.js';
import { GetAmenitiesUseCase } from '../application/usecases/GetAmenitiesUseCase.js';
import { UpdateAmenityUseCase } from '../application/usecases/UpdateAmenityUseCase.js';
import { CreateAmenityDTO, UpdateAmenityDTO } from '../application/dtos/AmenityDTO.js';

export class AmenityController {
  constructor() {
    this.createUseCase = new CreateAmenityUseCase();
    this.getUseCase = new GetAmenitiesUseCase();
    this.updateUseCase = new UpdateAmenityUseCase();
  }

  getAll = async (req, res, next) => {
    try {
      const amenities = await this.getUseCase.getAll(req.tenantId);
      res.json({ status: 'success', data: amenities });
    } catch (error) { next(error); }
  };

  getById = async (req, res, next) => {
    try {
      const amenity = await this.getUseCase.getById(req.params.id, req.tenantId);
      res.json({ status: 'success', data: amenity });
    } catch (error) { next(error); }
  };

  create = async (req, res, next) => {
    try {
      const dto = new CreateAmenityDTO({ ...req.body, tenant_id: req.tenantId });
      const amenity = await this.createUseCase.execute(dto);
      res.status(201).json({ status: 'success', data: amenity });
    } catch (error) { next(error); }
  };

  update = async (req, res, next) => {
    try {
      const dto = new UpdateAmenityDTO(req.body);
      const amenity = await this.updateUseCase.execute(req.params.id, req.tenantId, dto);
      res.json({ status: 'success', data: amenity });
    } catch (error) { next(error); }
  };

  delete = async (req, res, next) => {
    try {
      const result = await this.updateUseCase.delete(req.params.id, req.tenantId);
      res.json({ status: 'success', data: result });
    } catch (error) { next(error); }
  };
}