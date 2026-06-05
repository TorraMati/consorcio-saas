import { News, User } from '../../../../infrastructure/database/models/index.js';
import { SendNotificationUseCase } from '../../../notifications/application/usecases/SendNotificationUseCase.js';

const notificationUseCase = new SendNotificationUseCase();

export class CreateNewsUseCase {
  async execute(dto) {
    const news = await News.create(dto);

    // Si se publica, notificar a todos los usuarios del tenant
    if (dto.is_published) {
      const users = await User.findAll({
        where: { tenant_id: dto.tenant_id, is_active: true },
        attributes: ['id'],
      });

      await notificationUseCase.sendBulk(users, {
        tenant_id: dto.tenant_id,
        type: 'new_news',
        title: `Nueva noticia: ${dto.title}`,
        message: dto.content.substring(0, 150) + '...',
        channel: 'in_app',
      });
    }

    return news;
  }
}