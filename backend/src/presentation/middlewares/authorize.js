import { ForbiddenError } from '../../shared/errors/AppError.js';

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      throw new ForbiddenError('You do not have permission to access this resource');
    }
    next();
  };
};