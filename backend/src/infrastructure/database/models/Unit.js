import { DataTypes } from 'sequelize';
import { sequelize } from '../connection.js';

export const Unit = sequelize.define('Unit', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tenant_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  building_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  unit_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  floor: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  percentage: {
    type: DataTypes.DECIMAL(6, 3),
    defaultValue: 0,
    allowNull: true,
  },
  owner_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  tenant_user_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'units',
  paranoid: true,
  deletedAt: 'deleted_at',
  underscored: true,
});