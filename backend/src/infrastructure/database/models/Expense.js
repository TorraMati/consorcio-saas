import { DataTypes } from 'sequelize';
import { sequelize } from '../connection.js';

export const Expense = sequelize.define('Expense', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tenant_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  unit_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  building_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  liquidation_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  description: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  period: {
    type: DataTypes.STRING(7),
    allowNull: false,
  },
  due_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'overdue', 'expired'),
    defaultValue: 'pending',
  },
  interest_applied: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  interest_amount: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'expenses',
  paranoid: true,
  deletedAt: 'deleted_at',
  underscored: true,
});