import { User } from '../../../../infrastructure/database/models/index.js';
import { UnauthorizedError } from '../../../../shared/errors/AppError.js';
import { JwtService } from '../../infrastructure/JwtService.js';

export class RefreshTokenUseCase {
  constructor() {
    this.jwtService = new JwtService();
  }

  async execute(refreshToken) {
    if (!refreshToken) throw new UnauthorizedError('Refresh token required');

    const decoded = this.jwtService.verifyToken(refreshToken);

    const user = await User.findByPk(decoded.id);
    if (!user || !user.is_active) throw new UnauthorizedError('User not found');

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      tenant_id: user.tenant_id,
    };

    const accessToken = this.jwtService.generateAccessToken(payload);

    return { accessToken };
  }
}