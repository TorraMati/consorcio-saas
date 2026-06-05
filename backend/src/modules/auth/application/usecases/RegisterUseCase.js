import bcrypt from 'bcryptjs';
import { User } from '../../../../infrastructure/database/models/index.js';
import { ValidationError } from '../../../../shared/errors/AppError.js';
import { JwtService } from '../../infrastructure/JwtService.js';

export class RegisterUseCase {
  constructor() {
    this.jwtService = new JwtService();
  }

  async execute(dto, creatorRole) {
  // Solo super_admin puede crear admins
  if (dto.role === 'admin' && creatorRole !== 'super_admin') {
    throw new ForbiddenError('Only super admins can create admin users');
  }

  // Admin solo puede crear owners y tenants
  if (['super_admin', 'admin'].includes(dto.role) && creatorRole === 'admin') {
    throw new ForbiddenError('Admins can only create owners and tenants');
  }
    // Verificar si el email ya existe
    const existing = await User.findOne({ where: { email: dto.email } });
    if (existing) throw new ValidationError('Email already in use');

    // Hash de contraseña
    const password_hash = await bcrypt.hash(dto.password, 12);

    // Crear usuario
    const user = await User.create({
      email: dto.email,
      password_hash,
      first_name: dto.first_name,
      last_name: dto.last_name,
      phone: dto.phone,
      role: dto.role,
      tenant_id: dto.tenant_id,
    });

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