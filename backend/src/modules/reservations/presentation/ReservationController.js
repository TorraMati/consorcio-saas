import { CreateReservationUseCase } from '../application/usecases/CreateReservationUseCase.js';
import { GetReservationsUseCase } from '../application/usecases/GetReservationsUseCase.js';
import { CancelReservationUseCase } from '../application/usecases/CancelReservationUseCase.js';
import { CreateReservationDTO } from '../application/dtos/ReservationDTO.js';

export class ReservationController {
  constructor() {
    this.createUseCase = new CreateReservationUseCase();
    this.getUseCase = new GetReservationsUseCase();
    this.cancelUseCase = new CancelReservationUseCase();
  }

  getAll = async (req, res, next) => {
    try {
      const reservations = await this.getUseCase.getByTenant(req.tenantId, req.query);
      res.json({ status: 'success', data: reservations });
    } catch (error) { next(error); }
  };

  getMine = async (req, res, next) => {
    try {
      const reservations = await this.getUseCase.getByUser(req.user.id, req.tenantId);
      res.json({ status: 'success', data: reservations });
    } catch (error) { next(error); }
  };

  getAvailableSlots = async (req, res, next) => {
    try {
      const { amenityId } = req.params;
      const { date } = req.query;
      const result = await this.getUseCase.getAvailableSlots(amenityId, date, req.tenantId);
      res.json({ status: 'success', data: result });
    } catch (error) { next(error); }
  };

  create = async (req, res, next) => {
    try {
      const dto = new CreateReservationDTO({
        ...req.body,
        tenant_id: req.tenantId,
        user_id: req.user.id,
      });
      const reservation = await this.createUseCase.execute(dto);
      res.status(201).json({ status: 'success', data: reservation });
    } catch (error) { next(error); }
  };

  cancel = async (req, res, next) => {
    try {
      const result = await this.cancelUseCase.execute(
        req.params.id,
        req.tenantId,
        req.user.id,
        req.user.role
      );
      res.json({ status: 'success', data: result });
    } catch (error) { next(error); }
  };
}