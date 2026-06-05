import { News, User } from '../../../../infrastructure/database/models/index.js';
import { NotFoundError } from '../../../../shared/errors/AppError.js';

export class GetNewsUseCase {
  async getAll(tenantId, onlyPublished = false) {
    const where = { tenant_id: tenantId };
    if (onlyPublished) where.is_published = true;

    return await News.findAll({
      where,
      include: [{ model: User, as: 'author', attributes: ['id', 'first_name', 'last_name'] }],
      order: [['created_at', 'DESC']],
    });
  }

  async getById(id, tenantId) {
    const news = await News.findOne({
      where: { id, tenant_id: tenantId },
      include: [{ model: User, as: 'author', attributes: ['id', 'first_name', 'last_name'] }],
    });
    if (!news) throw new NotFoundError('News not found');
    return news;
  }

  async publish(id, tenantId) {
    const news = await News.findOne({ where: { id, tenant_id: tenantId } });
    if (!news) throw new NotFoundError('News not found');
    await news.update({ is_published: true });
    return news;
  }

  async delete(id, tenantId) {
    const news = await News.findOne({ where: { id, tenant_id: tenantId } });
    if (!news) throw new NotFoundError('News not found');
    await news.destroy();
    return { message: 'News deleted successfully' };
  }
}