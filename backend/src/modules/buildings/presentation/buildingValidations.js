import { body } from 'express-validator';
import { validateRequest } from '../../auth/presentation/authValidations.js';

export const createBuildingValidation = [
  body('unit_number').notEmpty().withMessage('Unit number is required'),
  validateRequest,
];

export const updateBuildingValidation = [
  body('unit_number').optional().notEmpty().withMessage('Unit number cannot be empty'),
  validateRequest,
];