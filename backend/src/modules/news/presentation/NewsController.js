import { CreateNewsUseCase } from '../application/usecases/CreateNewsUseCase.js';
import { GetNewsUseCase } from '../application/usecases/GetNewsUseCase.js';
import { CreateNewsDTO } from '../application/dtos/NewsDTO.js';

export class NewsController {
  constructor() {
    this.createUseCase = new CreateNewsUseCase();
    this.getUseCase = new GetNewsUseCase();
  }

  getAll = async (req, res, next) => {
    try {
      const onlyPublished = req.user.role !== 'admin';
      const news = await this.getUseCase.getAll(req.tenantId, onlyPublished);
      res.json({ status: 'success', data: news });
    } catch (error) { next(error); }
  };

  getById = async (req, res, next) => {
    try {
      const news = await this.getUseCase.getById(req.params.id, req.tenantId);
      res.json({ status: 'success', data: news });
    } catch (error) { next(error); }
  };

  create = async (req, res, next) => {
    try {
      const dto = new CreateNewsDTO({
        ...req.body,
        tenant_id: req.tenantId,
        author_id: req.user.id,
      });
      const news = await this.createUseCase.execute(dto);
      res.status(201).json({ status: 'success', data: news });
    } catch (error) { next(error); }
  };

  publish = async (req, res, next) => {
    try {
      const news = await this.getUseCase.publish(req.params.id, req.tenantId);
      res.json({ status: 'success', data: news });
    } catch (error) { next(error); }
  };

  delete = async (req, res, next) => {
    try {
      const result = await this.getUseCase.delete(req.params.id, req.tenantId);
      res.json({ status: 'success', data: result });
    } catch (error) { next(error); }
  };
}