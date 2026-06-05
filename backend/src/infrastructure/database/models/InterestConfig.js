import { DataTypes } from 'sequelize';
import { sequelize } from '../connection.js';

export const InterestConfig = sequelize.define('InterestConfig', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tenant_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
  },
  is_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  percentage: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
  },
  grace_days: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'interest_configs',
  underscored: true,
});