import bcrypt from 'bcryptjs';
import { User } from '../../../../infrastructure/database/models/index.js';
import { UnauthorizedError, NotFoundError } from '../../../../shared/errors/AppError.js';
import { JwtService } from '../../infrastructure/JwtService.js';

export class LoginUseCase {
  constructor() {
    this.jwtService = new JwtService();
  }

  async execute(dto) {
    // Buscar usuario
    const user = await User.findOne({
      where: { email: dto.email, is_active: true },
    });

    if (!user) throw new NotFoundError('User not found');

    // Verificar contraseña
    const isValid = await bcrypt.compare(dto.password, user.password_hash);
    if (!isValid) throw new UnauthorizedError('Invalid credentials');

    // Generar tokens
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      tenant_id: user.tenant_id,
    };

    const accessToken = this.jwtService.generateAccessToken(payload);
    const refreshToken = this.jwtService.generateRefreshToken({ id: user.id });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        tenant_id: user.tenant_id,
      },
    };
  }
}