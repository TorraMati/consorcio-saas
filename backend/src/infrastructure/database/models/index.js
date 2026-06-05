import { Tenant } from './Tenant.js';
import { User } from './User.js';
import { Building } from './Building.js';
import { Unit } from './Unit.js';
import { Expense } from './Expense.js';
import { Payment } from './Payment.js';
import { Amenity } from './Amenity.js';
import { Reservation } from './Reservation.js';
import { Notification } from './Notification.js';
import { News } from './News.js';
import { InterestConfig } from './InterestConfig.js';
import { TenantLimit } from './TenantLimit.js';
import { SystemConfig } from './SystemConfig.js';
import { Liquidation } from './Liquidation.js';
import { LiquidationItem } from './LiquidationItem.js';

// Tenant
Tenant.hasMany(User, { foreignKey: 'tenant_id' });
Tenant.hasMany(Building, { foreignKey: 'tenant_id' });
Tenant.hasMany(Unit, { foreignKey: 'tenant_id' });
Tenant.hasMany(Expense, { foreignKey: 'tenant_id' });
Tenant.hasMany(Amenity, { foreignKey: 'tenant_id' });
Tenant.hasMany(News, { foreignKey: 'tenant_id' });
Tenant.hasOne(InterestConfig, { foreignKey: 'tenant_id' });
Tenant.hasOne(TenantLimit, { foreignKey: 'tenant_id' });
Tenant.hasMany(Liquidation, { foreignKey: 'tenant_id' });

// User
User.belongsTo(Tenant, { foreignKey: 'tenant_id' });
User.hasMany(Payment, { foreignKey: 'user_id' });
User.hasMany(Reservation, { foreignKey: 'user_id' });
User.hasMany(Notification, { foreignKey: 'user_id' });

// Building
Building.belongsTo(Tenant, { foreignKey: 'tenant_id' });
Building.hasMany(Unit, { foreignKey: 'building_id' });
Building.hasMany(Amenity, { foreignKey: 'building_id' });
Building.hasMany(Liquidation, { foreignKey: 'building_id' });

// Unit
Unit.belongsTo(Building, { foreignKey: 'building_id' });
Unit.belongsTo(Tenant, { foreignKey: 'tenant_id' });
Unit.belongsTo(User, { as: 'owner', foreignKey: 'owner_id' });
Unit.belongsTo(User, { as: 'tenantUser', foreignKey: 'tenant_user_id' });
Unit.hasMany(Expense, { foreignKey: 'unit_id' });

// Expense
Expense.belongsTo(Unit, { foreignKey: 'unit_id' });
Expense.belongsTo(Tenant, { foreignKey: 'tenant_id' });
Expense.belongsTo(Liquidation, { foreignKey: 'liquidation_id' });
Expense.hasMany(Payment, { foreignKey: 'expense_id' });

// Payment
Payment.belongsTo(Expense, { foreignKey: 'expense_id' });
Payment.belongsTo(User, { foreignKey: 'user_id' });
Payment.belongsTo(Tenant, { foreignKey: 'tenant_id' });

// Amenity
Amenity.belongsTo(Tenant, { foreignKey: 'tenant_id' });
Amenity.belongsTo(Building, { foreignKey: 'building_id' });
Amenity.hasMany(Reservation, { foreignKey: 'amenity_id' });

// Reservation
Reservation.belongsTo(Amenity, { foreignKey: 'amenity_id' });
Reservation.belongsTo(User, { foreignKey: 'user_id' });

// Notification
Notification.belongsTo(User, { foreignKey: 'user_id' });

// News
News.belongsTo(Tenant, { foreignKey: 'tenant_id' });
News.belongsTo(User, { as: 'author', foreignKey: 'author_id' });

// TenantLimit
TenantLimit.belongsTo(Tenant, { foreignKey: 'tenant_id' });

// Liquidation
Liquidation.belongsTo(Tenant, { foreignKey: 'tenant_id' });
Liquidation.belongsTo(Building, { foreignKey: 'building_id' });
Liquidation.hasMany(LiquidationItem, { foreignKey: 'liquidation_id', as: 'items' });
Liquidation.hasMany(Expense, { foreignKey: 'liquidation_id' });

// LiquidationItem
LiquidationItem.belongsTo(Liquidation, { foreignKey: 'liquidation_id' });

export {
  Tenant, User, Building, Unit, Expense,
  Payment, Amenity, Reservation,
  Notification, News, InterestConfig,
  TenantLimit, SystemConfig,
  Liquidation, LiquidationItem,
};