import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './presentation/middlewares/errorHandler.js';
import { notFoundHandler } from './presentation/middlewares/notFoundHandler.js';
import authRoutes from './modules/auth/presentation/authRoutes.js';
import tenantRoutes from './modules/tenants/presentation/tenantRoutes.js';
import userRoutes from './modules/users/presentation/userRoutes.js';
import buildingRoutes from './modules/buildings/presentation/buildingRoutes.js';
import expenseRoutes from './modules/expenses/presentation/expenseRoutes.js';
import paymentRoutes from './modules/payments/presentation/paymentRoutes.js';
import amenityRoutes from './modules/amenities/presentation/amenityRoutes.js';
import reservationRoutes from './modules/reservations/presentation/reservationRoutes.js';
import notificationRoutes from './modules/notifications/presentation/notificationRoutes.js';
import interestRoutes from './modules/interest/presentation/interestRoutes.js';
import newsRoutes from './modules/news/presentation/newsRoutes.js';
import unitRoutes from './modules/units/presentation/unitRoutes.js';
import tenantLimitRoutes from './modules/tenantLimits/presentation/tenantLimitRoutes.js';
import superAdminRoutes from './modules/tenants/presentation/superAdminRoutes.js';
import liquidationRoutes from './modules/liquidations/presentation/liquidationRoutes.js';

const app = express();

// Seguridad
app.use(helmet());
app.use(cors());

// Parseo de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging HTTP
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/users', userRoutes);
app.use('/api/buildings', buildingRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/amenities', amenityRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/interest', interestRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/tenant-limits', tenantLimitRoutes);
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/liquidations', liquidationRoutes);

// Manejo de rutas no encontradas
app.use(notFoundHandler);

// Manejo centralizado de errores (siempre al final)
app.use(errorHandler);

export default app;