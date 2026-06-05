import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainLayout } from './components/layout/MainLayout';
import { PrivateRoute } from './routes/PrivateRoute';
import { LoginPage } from './features/auth/components/LoginPage';
import { DashboardPage } from './features/dashboard/components/DashboardPage';
import { ExpensesPage } from './features/expenses/components/ExpensesPage';
import { PaymentsPage } from './features/payments/components/PaymentsPage';
import { AmenitiesPage } from './features/amenities/components/AmenitiesPage';
import { NewsPage } from './features/news/components/NewsPage';
import { NotificationsPage } from './features/notifications/components/NotificationsPage';
import { NotFoundPage } from './features/notFound/NotFoundPage';
import { BuildingsPage } from './features/buildings/components/BuildingsPage';
import { UsersPage } from './features/users/components/UsersPage';
import { MyExpensesPage } from './features/expenses/components/MyExpensesPage';
import { MyPaymentsPage } from './features/payments/components/MyPaymentsPage';
import { ReservationPage } from './features/reservations/components/ReservationPage';
import { MyReservationsPage } from './features/reservations/components/MyReservationsPage';
import { TenantsPage } from './features/tenants/components/TenantsPage';
import { LiquidationsPage } from './features/liquidations/components/LiquidationsPage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard"      element={<DashboardPage />} />
            <Route path="expenses"       element={<ExpensesPage />} />
            <Route path="payments"       element={<PaymentsPage />} />
            <Route path="amenities"      element={<AmenitiesPage />} />
            <Route path="news"           element={<NewsPage />} />
            <Route path="notifications"  element={<NotificationsPage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="buildings" element={<BuildingsPage />} />
            <Route path="users"     element={<UsersPage />} />
            <Route path="my-expenses" element={<MyExpensesPage />} />
            <Route path="my-payments" element={<MyPaymentsPage />} />
            <Route path="reservations/:amenityId" element={<ReservationPage />} />
            <Route path="my-reservations" element={<MyReservationsPage />} />
            <Route path="tenants" element={<TenantsPage />} />
            <Route path="liquidations" element={<LiquidationsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}