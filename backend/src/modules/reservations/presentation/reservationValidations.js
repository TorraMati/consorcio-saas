import { body } from 'express-validator';
import { validateRequest } from '../../auth/presentation/authValidations.js';

export const createReservationValidation = [
  body('amenity_id').notEmpty().withMessage('Amenity ID is required'),
  body('date').isDate().withMessage('Date must be valid (YYYY-MM-DD)'),
  body('start_time')
    .matches(/^\d{2}:\d{2}$/)
    .withMessage('start_time must be in format HH:MM'),
  body('end_time')
    .matches(/^\d{2}:\d{2}$/)
    .withMessage('end_time must be in format HH:MM'),
  validateRequest,
];