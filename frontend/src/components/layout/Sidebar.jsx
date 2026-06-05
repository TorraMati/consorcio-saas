import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUnreadCount } from '../../hooks/useUnreadCount';
import { useRole } from '../../hooks/useRole';
import {
  LayoutDashboard, Receipt, CreditCard,
  Dumbbell, Newspaper, Bell, LogOut, FileText,
  Building2, Users, Calendar
} from 'lucide-react';

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const unreadCount = useUnreadCount();
  const { isAdmin, isResident, role } = useRole();
  
  const adminItems = [
    { to: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/buildings',     icon: Building2,       label: 'Unidades' },
    { to: '/users',         icon: Users,           label: 'Usuarios' },
    { to: '/expenses',      icon: Receipt,         label: 'Expensas' },
    { to: '/liquidations', icon: FileText, label: 'Liquidaciones' },
    { to: '/payments',      icon: CreditCard,      label: 'Pagos' },
    { to: '/amenities',     icon: Dumbbell,        label: 'Amenities' },
    { to: '/news',          icon: Newspaper,       label: 'Noticias' },
    { to: '/notifications', icon: Bell,            label: 'Notificaciones', badge: true },
  ];

  const residentItems = [
    { to: '/dashboard',     icon: LayoutDashboard, label: 'Mi panel' },
    { to: '/my-expenses',   icon: Receipt,         label: 'Mis expensas' },
    { to: '/my-payments',   icon: CreditCard,      label: 'Mis pagos' },
    { to: '/amenities',     icon: Dumbbell,        label: 'Amenities' },
    { to: '/news',          icon: Newspaper,       label: 'Noticias' },
    { to: '/notifications', icon: Bell,            label: 'Notificaciones', badge: true },
    { to: '/my-reservations', icon: Calendar, label: 'Mis Turnos' },
  ];

  const superAdminItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/tenants',   icon: Building2,       label: 'Consorcios' },
  ];

  const navItems = role === 'super_admin'
    ? superAdminItems
    : isAdmin
    ? adminItems
    : residentItems;

  const roleLabel = {
    super_admin: 'Super Admin',
    admin: 'Administrador',
    owner: 'Propietario',
    tenant: 'Inquilino',
  };

  return (
    <aside className="w-64 min-h-screen bg-surface border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-textPrimary">Consorcio</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-textSecondary hover:bg-surfaceHover hover:text-textPrimary'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span className="flex-1">{item.label}</span>
              {item.badge && unreadCount > 0 && (
                <span className="bg-primary text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary text-xs font-bold">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-textPrimary truncate">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-textSecondary">{roleLabel[user?.role]}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-textSecondary hover:bg-surfaceHover hover:text-danger transition-all w-full"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}