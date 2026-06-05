import { DataTypes } from 'sequelize';
import { sequelize } from '../connection.js';

export const SystemConfig = sequelize.define('SystemConfig', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  price_per_unit: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 500,
  },
  price_per_amenity: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 200,
  },
}, {
  tableName: 'system_config',
  underscored: true,
});