import { body } from 'express-validator';
import { validateRequest } from '../../auth/presentation/authValidations.js';

export const createPaymentValidation = [
  body('expense_id').notEmpty().withMessage('Expense ID is required'),
  body('method')
    .isIn(['mercadopago', 'transfer'])
    .withMessage('Method must be mercadopago or transfer'),
  validateRequest,
];