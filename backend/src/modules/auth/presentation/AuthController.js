import { LoginUseCase } from '../application/usecases/LoginUseCase.js';
import { RegisterUseCase } from '../application/usecases/RegisterUseCase.js';
import { RefreshTokenUseCase } from '../application/usecases/RefreshTokenUseCase.js';
import { LoginDTO } from '../application/dtos/LoginDTO.js';
import { RegisterDTO } from '../application/dtos/RegisterDTO.js';

export class AuthController {
  constructor() {
    this.loginUseCase = new LoginUseCase();
    this.registerUseCase = new RegisterUseCase();
    this.refreshTokenUseCase = new RefreshTokenUseCase();
  }

  login = async (req, res, next) => {
    try {
      const dto = new LoginDTO(req.body);
      const result = await this.loginUseCase.execute(dto);
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  };

  register = async (req, res, next) => {
    try {
      const dto = new RegisterDTO(req.body);
      const creatorRole = req.user?.role || 'public';
      const result = await this.registerUseCase.execute(dto, creatorRole);
      res.status(201).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      const result = await this.refreshTokenUseCase.execute(refreshToken);
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  };

  me = async (req, res) => {
    res.status(200).json({ status: 'success', data: { user: req.user } });
  };
}