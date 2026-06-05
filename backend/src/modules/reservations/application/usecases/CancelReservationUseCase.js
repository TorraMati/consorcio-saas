import { Reservation } from '../../../../infrastructure/database/models/index.js';
import { NotFoundError, ValidationError } from '../../../../shared/errors/AppError.js';

export class CancelReservationUseCase {
  async execute(id, tenantId, userId, role) {
    const reservation = await Reservation.findOne({
      where: { id, tenant_id: tenantId },
    });
    if (!reservation) throw new NotFoundError('Reservation not found');
    if (reservation.status === 'cancelled') {
      throw new ValidationError('Reservation is already cancelled');
    }

    // Solo admin o el propio usuario puede cancelar
    if (role !== 'admin' && reservation.user_id !== userId) {
      throw new ValidationError('You can only cancel your own reservations');
    }

    await reservation.update({ status: 'cancelled' });
    return { message: 'Reservation cancelled successfully' };
  }
}