import { LiquidationUseCase } from '../application/usecases/LiquidationUseCase.js';

const uc = new LiquidationUseCase();

export class LiquidationController {
  getAll = async (req, res, next) => {
    try {
      const data = await uc.getAll(req.tenantId, req.query.building_id);
      res.json({ status: 'success', data });
    } catch (e) { next(e); }
  };

  getById = async (req, res, next) => {
    try {
      const data = await uc.getById(req.params.id, req.tenantId);
      res.json({ status: 'success', data });
    } catch (e) { next(e); }
  };

  create = async (req, res, next) => {
    try {
      const data = await uc.create(req.tenantId, req.body);
      res.status(201).json({ status: 'success', data });
    } catch (e) { next(e); }
  };

  publish = async (req, res, next) => {
  try {
    console.log('tenantId en controller:', req.tenantId, 'user:', req.user);
    const data = await uc.publish(req.params.id, req.tenantId);
    res.json({ status: 'success', data });
  } catch (e) { next(e); }
  };

  delete = async (req, res, next) => {
    try {
      const data = await uc.delete(req.params.id, req.tenantId);
      res.json({ status: 'success', data });
    } catch (e) { next(e); }
  };
}