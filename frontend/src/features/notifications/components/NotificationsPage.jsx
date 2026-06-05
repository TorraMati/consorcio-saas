import { useEffect, useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import client from '../../../api/client';
import { Spinner } from '../../../components/ui/Spinner';
import { EmptyState } from '../../../components/ui/EmptyState';

const typeLabel = {
  new_expense:      { label: 'Nueva expensa',      color: 'bg-primary/10 text-primary' },
  new_news:         { label: 'Nueva noticia',       color: 'bg-indigo-500/10 text-indigo-400' },
  payment_approved: { label: 'Pago acreditado',     color: 'bg-success/10 text-success' },
  interest_warning: { label: 'Aviso de interés',    color: 'bg-warning/10 text-warning' },
  interest_applied: { label: 'Interés aplicado',    color: 'bg-danger/10 text-danger' },
};

export function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/notifications')
      .then(res => setNotifications(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const markAllRead = async () => {
    await client.patch('/notifications/read-all');
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const markRead = async (id) => {
    await client.patch(`/notifications/${id}/read`);
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    );
  };

  const unread = notifications.filter(n => !n.is_read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-textPrimary">Notificaciones</h1>
          <p className="text-textSecondary text-sm mt-1">
            {unread > 0 ? `${unread} sin leer` : 'Todo al día'}
          </p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="btn-ghost flex items-center gap-2 text-sm">
            <CheckCheck className="w-4 h-4" />
            Marcar todas como leídas
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : notifications.length === 0 ? (
        <EmptyState message="No tenés notificaciones" />
      ) : (
        <div className="space-y-2">
          {notifications.map(notification => {
            const type = typeLabel[notification.type] || { label: notification.type, color: 'bg-primary/10 text-primary' };
            return (
              <div
                key={notification.id}
                onClick={() => !notification.is_read && markRead(notification.id)}
                className={`card cursor-pointer transition-all hover:border-primary/30 ${
                  !notification.is_read ? 'border-primary/20' : 'opacity-60'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    notification.is_read ? 'bg-border' : 'bg-primary'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${type.color}`}>
                        {type.label}
                      </span>
                      <span className="text-xs text-textSecondary">
                        {new Date(notification.created_at).toLocaleDateString('es-AR')}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-textPrimary">{notification.title}</p>
                    <p className="text-sm text-textSecondary mt-0.5">{notification.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}