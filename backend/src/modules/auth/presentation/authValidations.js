import { body, validationResult } from 'express-validator';
import { ValidationError } from '../../../shared/errors/AppError.js';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(errors.array().map((e) => e.msg).join(', '));
  }
  next();
};

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
  validateRequest,
];

export const registerValidation = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('first_name').notEmpty().withMessage('First name required'),
  body('last_name').notEmpty().withMessage('Last name required'),
  body('role')
    .isIn(['super_admin', 'admin', 'owner', 'tenant'])
    .withMessage('Invalid role'),
  validateRequest,
];