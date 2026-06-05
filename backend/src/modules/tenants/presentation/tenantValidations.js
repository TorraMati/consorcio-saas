import { body } from 'express-validator';
import { validateRequest } from '../../auth/presentation/authValidations.js';

export const createTenantValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('address').notEmpty().withMessage('Address is required'),
  validateRequest,
];

export const updateTenantValidation = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('address').optional().notEmpty().withMessage('Address cannot be empty'),
  validateRequest,
];