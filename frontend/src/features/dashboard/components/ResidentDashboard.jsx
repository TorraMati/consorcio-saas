import { useEffect, useState, useCallback } from 'react';
import { Receipt, CreditCard, Calendar } from 'lucide-react';
import client from '../../../api/client';
import { Spinner } from '../../../components/ui/Spinner';
import { Badge } from '../../../components/ui/Badge';
import { EmptyState } from '../../../components/ui/EmptyState';
import { useAuthStore } from '../../../store/authStore';

function StatCard({ icon, label, value, color }) {
  const Icon = icon;
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-textSecondary text-sm">{label}</p>
        <p className="text-2xl font-semibold text-textPrimary">{value}</p>
      </div>
    </div>
  );
}

export function ResidentDashboard() {
  const { user } = useAuthStore();
  const [expenses, setExpenses] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [expensesRes, reservationsRes] = await Promise.all([
        client.get('/expenses/my'),
        client.get('/reservations/mine'),
      ]);
      setExpenses(expensesRes.data);
      setReservations(reservationsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Spinner size="lg" />
    </div>
  );

  const pending = expenses.filter(e => e.status === 'pending');
  const overdue = expenses.filter(e => e.status === 'overdue');
  const activeReservations = reservations.filter(r => r.status === 'active');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-textPrimary">
          Hola, {user?.first_name} 👋
        </h1>
        <p className="text-textSecondary text-sm mt-1">Resumen de tu cuenta</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={Receipt}  label="Expensas pendientes" value={pending.length}           color="bg-warning" />
        <StatCard icon={CreditCard} label="Expensas vencidas"  value={overdue.length}          color="bg-danger" />
        <StatCard icon={Calendar} label="Reservas activas"    value={activeReservations.length} color="bg-primary" />
      </div>

      {/* Expensas pendientes */}
      <div className="card mb-6">
        <h2 className="font-semibold text-textPrimary mb-4">Mis expensas pendientes</h2>
        {pending.length === 0 ? (
          <EmptyState message="No tenés expensas pendientes 🎉" />
        ) : (
          <div className="space-y-3">
            {pending.map(expense => (
              <div key={expense.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-textPrimary">Período {expense.period}</p>
                  <p className="text-xs text-textSecondary">Vence: {expense.due_date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-textPrimary">
                    ${parseFloat(expense.amount).toLocaleString('es-AR')}
                  </span>
                  <Badge status={expense.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Próximas reservas */}
      <div className="card">
        <h2 className="font-semibold text-textPrimary mb-4">Mis reservas activas</h2>
        {activeReservations.length === 0 ? (
          <EmptyState message="No tenés reservas activas" />
        ) : (
          <div className="space-y-3">
            {activeReservations.slice(0, 5).map(reservation => (
              <div key={reservation.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-textPrimary">
                    {reservation.Amenity?.name}
                  </p>
                  <p className="text-xs text-textSecondary">
                    {reservation.date} · {reservation.start_time} - {reservation.end_time}
                  </p>
                </div>
                <Badge status={reservation.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}