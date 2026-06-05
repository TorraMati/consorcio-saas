import { ConfigureInterestUseCase } from '../application/usecases/ConfigureInterestUseCase.js';
import { ApplyInterestUseCase } from '../application/usecases/ApplyInterestUseCase.js';
import { ConfigureInterestDTO } from '../application/dtos/InterestDTO.js';

export class InterestController {
  constructor() {
    this.configUseCase = new ConfigureInterestUseCase();
    this.applyUseCase = new ApplyInterestUseCase();
  }

  getConfig = async (req, res, next) => {
    try {
      const config = await this.configUseCase.getConfig(req.tenantId);
      res.json({ status: 'success', data: config });
    } catch (error) { next(error); }
  };

  configure = async (req, res, next) => {
    try {
      const dto = new ConfigureInterestDTO(req.body);
      const config = await this.configUseCase.execute(req.tenantId, dto);
      res.json({ status: 'success', data: config });
    } catch (error) { next(error); }
  };

  // Solo para testing manual — en producción lo hace el cron
  applyManually = async (req, res, next) => {
    try {
      await this.applyUseCase.applyToOverdue();
      res.json({ status: 'success', data: { message: 'Interest applied to overdue expenses' } });
    } catch (error) { next(error); }
  };
}