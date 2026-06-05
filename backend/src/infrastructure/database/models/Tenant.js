import { DataTypes } from 'sequelize';
import { sequelize } from '../connection.js';

export const Tenant = sequelize.define('Tenant', {
  first_name: { type: DataTypes.STRING(100), allowNull: true },
  last_name:  { type: DataTypes.STRING(100), allowNull: true },
  phone:      { type: DataTypes.STRING(30),  allowNull: true },
  email:      { type: DataTypes.STRING(150), allowNull: true },
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  cuit: {
    type: DataTypes.STRING(20),
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
  tableName: 'tenants',
  paranoid: true,
  deletedAt: 'deleted_at',
  underscored: true,
});