import { body } from 'express-validator';
import { validateRequest } from '../../auth/presentation/authValidations.js';

export const createAmenityValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('open_time')
    .optional()
    .matches(/^\d{2}:\d{2}$/)
    .withMessage('open_time must be in format HH:MM'),
  body('close_time')
    .optional()
    .matches(/^\d{2}:\d{2}$/)
    .withMessage('close_time must be in format HH:MM'),
  body('capacity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Capacity must be at least 1'),
  body('slot_duration_minutes')
    .optional()
    .isInt({ min: 15 })
    .withMessage('Slot duration must be at least 15 minutes'),
  validateRequest,
];