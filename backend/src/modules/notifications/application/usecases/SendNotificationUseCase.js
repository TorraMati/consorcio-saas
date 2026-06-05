import { Notification, User } from '../../../../infrastructure/database/models/index.js';
import { emailService } from '../../../../infrastructure/services/EmailService.js';

export class SendNotificationUseCase {
  async execute(dto) {
    // Guardar notificación in-app siempre
    const notification = await Notification.create({
      tenant_id: dto.tenant_id,
      user_id: dto.user_id,
      type: dto.type,
      title: dto.title,
      message: dto.message,
      channel: 'in_app',
    });

    // Si también es por email, enviarlo
    if (dto.channel === 'email' || dto.channel === 'both') {
      const user = await User.findByPk(dto.user_id);
      if (user) {
        await emailService.send({
          to: user.email,
          subject: dto.title,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>${dto.title}</h2>
              <p>${dto.message}</p>
              <hr/>
              <small>Consorcio SaaS - Notificación automática</small>
            </div>
          `,
        });

        await Notification.create({
          tenant_id: dto.tenant_id,
          user_id: dto.user_id,
          type: dto.type,
          title: dto.title,
          message: dto.message,
          channel: 'email',
        });
      }
    }

    return notification;
  }

  // Enviar a múltiples usuarios a la vez
  async sendBulk(users, notificationData) {
    const promises = users.map((user) =>
      this.execute({ ...notificationData, user_id: user.id })
    );
    await Promise.allSettled(promises);
  }
}