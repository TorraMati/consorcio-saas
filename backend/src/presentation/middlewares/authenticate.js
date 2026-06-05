import { JwtService } from '../../modules/auth/infrastructure/JwtService.js';
import { UnauthorizedError } from '../../shared/errors/AppError.js';

const jwtService = new JwtService();

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwtService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};