import { Building } from '../../../infrastructure/database/models/index.js';
import { NotFoundError, ValidationError } from '../../../shared/errors/AppError.js';
import { v4 as uuidv4 } from 'uuid';

export class BuildingController {
  getAll = async (req, res, next) => {
    try {
      const buildings = await Building.findAll({
        where: { tenant_id: req.tenantId },
        order: [['name', 'ASC']],
      });
      res.json({ status: 'success', data: buildings });
    } catch (error) { next(error); }
  };

  getById = async (req, res, next) => {
    try {
      const building = await Building.findOne({
        where: { id: req.params.id, tenant_id: req.tenantId },
      });
      if (!building) throw new NotFoundError('Building not found');
      res.json({ status: 'success', data: building });
    } catch (error) { next(error); }
  };

  create = async (req, res, next) => {
    try {
      const { name, address } = req.body;
      if (!name) throw new ValidationError('Building name is required');

      // Verificar límite
      const { TenantLimit } = await import('../../../infrastructure/database/models/index.js');
      const limit = await TenantLimit.findOne({ where: { tenant_id: req.tenantId } });
      if (limit) {
        const current = await Building.count({ where: { tenant_id: req.tenantId } });
        if (current >= limit.max_buildings) {
          throw new ValidationError(`Límite de edificios alcanzado (máx. ${limit.max_buildings})`);
        }
      }

      const existing = await Building.findOne({ where: { tenant_id: req.tenantId, name } });
      if (existing) throw new ValidationError('A building with that name already exists');

      const building = await Building.create({
        id: uuidv4(),
        tenant_id: req.tenantId,
        name,
        address: address || null,
      });
      res.status(201).json({ status: 'success', data: building });
    } catch (error) { next(error); }
  };

  update = async (req, res, next) => {
    try {
      const building = await Building.findOne({
        where: { id: req.params.id, tenant_id: req.tenantId },
      });
      if (!building) throw new NotFoundError('Building not found');
      await building.update(req.body);
      res.json({ status: 'success', data: building });
    } catch (error) { next(error); }
  };

  delete = async (req, res, next) => {
    try {
      const building = await Building.findOne({
        where: { id: req.params.id, tenant_id: req.tenantId },
      });
      if (!building) throw new NotFoundError('Building not found');
      await building.destroy();
      res.json({ status: 'success', data: { message: 'Building deleted' } });
    } catch (error) { next(error); }
  };
}