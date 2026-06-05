import { CreateUserUseCase } from '../application/usecases/CreateUserUseCase.js';
import { GetUsersUseCase } from '../application/usecases/GetUsersUseCase.js';
import { UpdateUserUseCase } from '../application/usecases/UpdateUserUseCase.js';
import { CreateUserDTO, UpdateUserDTO } from '../application/dtos/UserDTO.js';

export class UserController {
  constructor() {
    this.createUseCase = new CreateUserUseCase();
    this.getUseCase = new GetUsersUseCase();
    this.updateUseCase = new UpdateUserUseCase();
  }

  getAll = async (req, res, next) => {
    try {
      const users = await this.getUseCase.getByTenant(req.tenantId);
      res.json({ status: 'success', data: users });
    } catch (error) { next(error); }
  };

  getById = async (req, res, next) => {
    try {
      const user = await this.getUseCase.getById(req.params.id, req.tenantId);
      res.json({ status: 'success', data: user });
    } catch (error) { next(error); }
  };

  create = async (req, res, next) => {
    try {
      const dto = new CreateUserDTO({ ...req.body, tenant_id: req.tenantId });
      const user = await this.createUseCase.execute(dto);
      res.status(201).json({ status: 'success', data: user });
    } catch (error) { next(error); }
  };

  update = async (req, res, next) => {
    try {
      const dto = new UpdateUserDTO(req.body);
      const user = await this.updateUseCase.execute(req.params.id, dto, req.tenantId);
      res.json({ status: 'success', data: user });
    } catch (error) { next(error); }
  };

  delete = async (req, res, next) => {
    try {
      const result = await this.updateUseCase.delete(req.params.id, req.tenantId);
      res.json({ status: 'success', data: result });
    } catch (error) { next(error); }
  };
}