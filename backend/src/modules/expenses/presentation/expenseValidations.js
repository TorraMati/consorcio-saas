import { body, query } from 'express-validator';
import { validateRequest } from '../../auth/presentation/authValidations.js';

export const createExpenseValidation = [
  body('building_id').notEmpty().withMessage('Building ID is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('period')
    .matches(/^\d{4}-\d{2}$/)
    .withMessage('Period must be in format YYYY-MM'),
  body('due_date').isDate().withMessage('Due date must be a valid date'),
  validateRequest,
];