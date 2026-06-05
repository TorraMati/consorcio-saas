import { JwtService } from '../../modules/auth/infrastructure/JwtService.js';

const jwtService = new JwtService();

export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      req.user = jwtService.verifyToken(token);
    }
  } catch {
    // Sin token es válido para registro público
  }
  next();
};