import { AppError } from '../../shared/errors/AppError.js';
import { logger } from '../../shared/utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  // Log del error
  logger.error(err);

  // Error operacional conocido
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      code: err.code,
      message: err.message,
    });
  }

  // Error de Sequelize
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      status: 'error',
      code: 'VALIDATION_ERROR',
      message: err.errors.map((e) => e.message).join(', '),
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      status: 'error',
      code: 'DUPLICATE_ENTRY',
      message: 'Resource already exists',
    });
  }

  // Error desconocido — no exponer detalles en producción
  return res.status(500).json({
    status: 'error',
    code: 'INTERNAL_ERROR',
    message:
      process.env.NODE_ENV === 'production'
        ? 'Something went wrong'
        : err.message,
  });
};