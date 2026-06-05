import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function PrivateRoute({ children }) {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/login" replace />;
}