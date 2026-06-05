import bcrypt from 'bcryptjs';
import { User } from '../../../../infrastructure/database/models/index.js';
import { ValidationError } from '../../../../shared/errors/AppError.js';

export class CreateUserUseCase {
  async execute(dto) {
    const existing = await User.findOne({ where: { email: dto.email } });
    if (existing) throw new ValidationError('Email already in use');

    const password_hash = await bcrypt.hash(dto.password, 12);

    const user = await User.create({
      email: dto.email,
      password_hash,
      first_name: dto.first_name,
      last_name: dto.last_name,
      phone: dto.phone,
      role: dto.role,
      tenant_id: dto.tenant_id,
    });

    // No devolver password_hash
    const { password_hash: _, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }
}