import { Sequelize } from 'sequelize';
import { logger } from '../../shared/utils/logger.js';

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: (msg) => logger.debug(msg),
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  }
);

export const connectDatabase = async () => {
  // Importar modelos para registrarlos
  await import('./models/index.js');
  await sequelize.authenticate();
  // Solo en desarrollo — en producción usaremos migraciones
  await sequelize.sync({ alter: false });
  logger.info('✅ Database connected and synced');
};