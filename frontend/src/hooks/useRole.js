import { useAuthStore } from '../store/authStore';

export function useRole() {
  const { user } = useAuthStore();

  return {
    role: user?.role,
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
    isOwner: user?.role === 'owner',
    isTenant: user?.role === 'tenant',
    isResident: user?.role === 'owner' || user?.role === 'tenant',
  };
}