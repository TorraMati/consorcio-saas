import { DataTypes } from 'sequelize';
import { sequelize } from '../connection.js';

export const Liquidation = sequelize.define('Liquidation', {
  id: { type: DataTypes.CHAR(36), primaryKey: true },
  tenant_id: { type: DataTypes.CHAR(36), allowNull: false },
  building_id: { type: DataTypes.CHAR(36), allowNull: false },
  period: { type: DataTypes.STRING(7), allowNull: false },
  due_date: { type: DataTypes.DATEONLY, allowNull: false },
  status: { type: DataTypes.ENUM('draft','published','closed'), defaultValue: 'draft' },
  total_amount: { type: DataTypes.DECIMAL(14,2), defaultValue: 0 },
  notes: { type: DataTypes.TEXT, allowNull: true },
}, { tableName: 'liquidations', underscored: true });