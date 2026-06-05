import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../../../shared/errors/AppError.js';

export class JwtService {
  generateAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
  }

  generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      throw new UnauthorizedError('Invalid or expired token');
    }
  }
}