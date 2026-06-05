import { CreatePaymentUseCase } from '../application/usecases/CreatePaymentUseCase.js';
import { GetPaymentsUseCase } from '../application/usecases/GetPaymentsUseCase.js';
import { ConfirmTransferUseCase } from '../application/usecases/ConfirmTransferUseCase.js';
import { MercadoPagoWebhookUseCase } from '../application/usecases/MercadoPagoWebhookUseCase.js';
import { CreatePaymentDTO } from '../application/dtos/PaymentDTO.js';

export class PaymentController {
  constructor() {
    this.createUseCase = new CreatePaymentUseCase();
    this.getUseCase = new GetPaymentsUseCase();
    this.confirmTransferUseCase = new ConfirmTransferUseCase();
    this.webhookUseCase = new MercadoPagoWebhookUseCase();
  }

  getAll = async (req, res, next) => {
    try {
      const payments = await this.getUseCase.getByTenant(req.tenantId);
      res.json({ status: 'success', data: payments });
    } catch (error) { next(error); }
  };

  getById = async (req, res, next) => {
    try {
      const payment = await this.getUseCase.getById(req.params.id, req.tenantId);
      res.json({ status: 'success', data: payment });
    } catch (error) { next(error); }
  };

  create = async (req, res, next) => {
    try {
      const dto = new CreatePaymentDTO({
        ...req.body,
        tenant_id: req.tenantId,
        user_id: req.user.id,
      });
      const result = await this.createUseCase.execute(dto);
      res.status(201).json({ status: 'success', data: result });
    } catch (error) { next(error); }
  };

  confirmTransfer = async (req, res, next) => {
    try {
      const payment = await this.confirmTransferUseCase.execute(
        req.params.id,
        req.tenantId
      );
      res.json({ status: 'success', data: payment });
    } catch (error) { next(error); }
  };

  webhook = async (req, res, next) => {
    try {
      const result = await this.webhookUseCase.execute(req.body);
      res.json(result);
    } catch (error) { next(error); }
  };
}