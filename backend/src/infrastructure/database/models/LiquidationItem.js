import { DataTypes } from 'sequelize';
import { sequelize } from '../connection.js';

export const LiquidationItem = sequelize.define('LiquidationItem', {
  id: { type: DataTypes.CHAR(36), primaryKey: true },
  liquidation_id: { type: DataTypes.CHAR(36), allowNull: false },
  name: { type: DataTypes.STRING(100), allowNull: false },
  category: { type: DataTypes.ENUM('ordinaria','extraordinaria','servicio','otro'), defaultValue: 'otro' },
  amount: { type: DataTypes.DECIMAL(14,2), allowNull: false },
}, { tableName: 'liquidation_items', underscored: true });