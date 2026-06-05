import { CreateExpenseUseCase } from '../application/usecases/CreateExpenseUseCase.js';
import { GetExpensesUseCase } from '../application/usecases/GetExpensesUseCase.js';
import { UpdateExpenseUseCase } from '../application/usecases/UpdateExpenseUseCase.js';
import { CreateExpenseDTO, UpdateExpenseDTO } from '../application/dtos/ExpenseDTO.js';

export class ExpenseController {
  constructor() {
    this.createUseCase = new CreateExpenseUseCase();
    this.getUseCase = new GetExpensesUseCase();
    this.updateUseCase = new UpdateExpenseUseCase();
  }

  getAll = async (req, res, next) => {
    try {
      const expenses = await this.getUseCase.getByTenant(req.tenantId, req.query);
      res.json({ status: 'success', data: expenses });
    } catch (error) { next(error); }
  };

  getByBuilding = async (req, res, next) => {
    try {
      const expenses = await this.getUseCase.getByBuilding(req.params.buildingId, req.tenantId);
      res.json({ status: 'success', data: expenses });
    } catch (error) { next(error); }
  };

  getById = async (req, res, next) => {
    try {
      const expense = await this.getUseCase.getById(req.params.id, req.tenantId);
      res.json({ status: 'success', data: expense });
    } catch (error) { next(error); }
  };

  create = async (req, res, next) => {
    try {
      const dto = new CreateExpenseDTO({ ...req.body, tenant_id: req.tenantId });
      const expense = await this.createUseCase.execute(dto);
      res.status(201).json({ status: 'success', data: expense });
    } catch (error) { next(error); }
  };

  update = async (req, res, next) => {
    try {
      const dto = new UpdateExpenseDTO(req.body);
      const expense = await this.updateUseCase.execute(req.params.id, req.tenantId, dto);
      res.json({ status: 'success', data: expense });
    } catch (error) { next(error); }
  };

  delete = async (req, res, next) => {
    try {
      const result = await this.updateUseCase.delete(req.params.id, req.tenantId);
      res.json({ status: 'success', data: result });
    } catch (error) { next(error); }
  };
}