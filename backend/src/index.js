import 'dotenv/config';
import cron from 'node-cron';
import app from './app.js';
import { connectDatabase } from './infrastructure/database/connection.js';
import { logger } from './shared/utils/logger.js';
import { ApplyInterestUseCase } from './modules/interest/application/usecases/ApplyInterestUseCase.js';

const PORT = process.env.PORT || 3000;
const applyInterestUseCase = new ApplyInterestUseCase();

async function bootstrap() {
  try {
    await connectDatabase();

    // Cron: aplicar interés todos los días a medianoche
    cron.schedule('0 0 * * *', async () => {
      logger.info('⏰ Running interest cron job...');
      await applyInterestUseCase.applyToOverdue();
    });

    // Cron: avisos de vencimiento todos los días a las 9am
    cron.schedule('0 9 * * *', async () => {
      logger.info('⏰ Running upcoming warnings cron job...');
      await applyInterestUseCase.sendUpcomingWarnings();
    });

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();