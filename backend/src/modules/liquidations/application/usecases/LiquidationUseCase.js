import { v4 as uuidv4 } from 'uuid';
import { Liquidation, LiquidationItem, Unit, Expense, Building } from '../../../../infrastructure/database/models/index.js';
import { NotFoundError, ValidationError } from '../../../../shared/errors/AppError.js';

export class LiquidationUseCase {

  async getAll(tenantId, buildingId = null) {
    const where = { tenant_id: tenantId };
    if (buildingId) where.building_id = buildingId;
    return Liquidation.findAll({
      where,
      include: [
        { model: LiquidationItem, as: 'items' },
        { model: Building, attributes: ['id', 'name'] },
      ],
      order: [['period', 'DESC']],
    });
  }

  async getById(id, tenantId) {
    const liq = await Liquidation.findOne({
      where: { id, tenant_id: tenantId },
      include: [
        { model: LiquidationItem, as: 'items' },
        { model: Building, attributes: ['id', 'name', 'address'] },
      ],
    });
    if (!liq) throw new NotFoundError('Liquidación no encontrada');
    return liq;
  }

  async create(tenantId, { building_id, period, due_date, notes, items }) {
    if (!items || items.length === 0)
      throw new ValidationError('Debe agregar al menos un concepto');

    const existing = await Liquidation.findOne({ where: { building_id, period } });
    if (existing) throw new ValidationError(`Ya existe una liquidación para ese edificio en ${period}`);

    const total_amount = items.reduce((sum, i) => sum + parseFloat(i.amount), 0);

    const liquidation = await Liquidation.create({
      id: uuidv4(),
      tenant_id: tenantId,
      building_id,
      period,
      due_date,
      notes: notes || null,
      status: 'draft',
      total_amount,
    });

    await Promise.all(items.map(item =>
      LiquidationItem.create({
        id: uuidv4(),
        liquidation_id: liquidation.id,
        name: item.name,
        category: item.category || 'otro',
        amount: parseFloat(item.amount),
      })
    ));

    return this.getById(liquidation.id, tenantId);
  }

    async publish(id, tenantId) {
        const liq = await this.getById(id, tenantId);

        if (liq.status !== 'draft')
            throw new ValidationError('Solo se pueden publicar liquidaciones en borrador');

        const units = await Unit.findAll({
            where: { building_id: liq.building_id, tenant_id: tenantId, is_active: true },
        });

        if (units.length === 0)
            throw new ValidationError('El edificio no tiene unidades activas');

        const items = liq.items;

        await Promise.all(units.map(unit => {
            const pct = parseFloat(unit.percentage || 0) / 100;
            const description = items.map(item => ({
            name: item.name,
            category: item.category,
            subtotal: parseFloat((parseFloat(item.amount) * pct).toFixed(2)),
            }));
            const amount = description.reduce((sum, d) => sum + d.subtotal, 0);

            return Expense.create({
            id: uuidv4(),
            tenant_id: tenantId,
            unit_id: unit.id,
            building_id: liq.building_id,
            liquidation_id: liq.id,
            amount: parseFloat(amount.toFixed(2)),
            description: JSON.stringify(description),
            period: liq.period,
            due_date: liq.due_date,
            status: 'pending',
            });
        }));

        await liq.update({ status: 'published' });
        return liq;
    }

  async delete(id, tenantId) {
    const liq = await this.getById(id, tenantId);
    if (liq.status === 'published')
      throw new ValidationError('No se puede eliminar una liquidación publicada');
    await LiquidationItem.destroy({ where: { liquidation_id: id } });
    await liq.destroy();
    return { message: 'Liquidación eliminada' };
  }
}