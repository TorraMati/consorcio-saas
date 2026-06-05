import { DataTypes } from 'sequelize';
import { sequelize } from '../connection.js';

export const Amenity = sequelize.define('Amenity', {
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
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  capacity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  // Tipo de turno: 'hourly' = por hora, 'shift' = mañana/tarde/noche
  slot_type: {
    type: DataTypes.ENUM('hourly', 'shift'),
    defaultValue: 'hourly',
  },
  // Para slot_type = 'hourly'
  open_time: {
    type: DataTypes.STRING(5),
    allowNull: true,
  },
  close_time: {
    type: DataTypes.STRING(5),
    allowNull: true,
  },
  slot_duration_minutes: {
    type: DataTypes.INTEGER,
    defaultValue: 60,
  },
  // Para slot_type = 'shift'
  shifts: {
    type: DataTypes.JSON,
    allowNull: true,
    // Ejemplo: [{ name: 'Mañana', start: '08:00', end: '12:00' }, ...]
  },
  // Límite de reservas activas por usuario
  max_reservations_per_user: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
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
  tableName: 'amenities',
  paranoid: true,
  deletedAt: 'deleted_at',
  underscored: true,
});