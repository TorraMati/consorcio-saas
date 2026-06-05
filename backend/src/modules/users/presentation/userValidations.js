import { body } from 'express-validator';
import { validateRequest } from '../../auth/presentation/authValidations.js';

export const createUserValidation = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password min 8 characters'),
  body('first_name').notEmpty().withMessage('First name required'),
  body('last_name').notEmpty().withMessage('Last name required'),
  body('role').isIn(['admin', 'owner', 'tenant']).withMessage('Invalid role'),
  validateRequest,
];

export const updateUserValidation = [
  body('first_name').optional().notEmpty().withMessage('First name cannot be empty'),
  body('last_name').optional().notEmpty().withMessage('Last name cannot be empty'),
  validateRequest,
];