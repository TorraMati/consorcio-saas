import { DataTypes } from 'sequelize';
import { sequelize } from '../connection.js';

export const TenantLimit = sequelize.define('TenantLimit', {
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
  max_buildings: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  max_units: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
  },
  max_amenities: {
    type: DataTypes.INTEGER,
    defaultValue: 2,
  },
  monthly_price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
}, {
  tableName: 'tenant_limits',
  underscored: true,
});