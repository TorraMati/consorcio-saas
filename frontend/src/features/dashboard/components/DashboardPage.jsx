import { useEffect, useState } from 'react';
import { Receipt, CreditCard, Building2, Newspaper, TrendingUp, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import client from '../../../api/client';
import { Spinner } from '../../../components/ui/Spinner';
import { Badge } from '../../../components/ui/Badge';
import { EmptyState } from '../../../components/ui/EmptyState';
import { useRole } from '../../../hooks/useRole';
import { ResidentDashboard } from './ResidentDashboard';
import { SuperAdminDashboard } from './SuperAdminDashboard';

function StatCard({ icon, label, value, color, sub }) {
  const Icon = icon;
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-textSecondary text-sm">{label}</p>
        <p className="text-2xl font-semibold text-textPrimary">{value}</p>
        {sub && <p className="text-xs text-textSecondary mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-surface border border-border rounded-xl px-4 py-3 shadow-xl">
        <p className="text-xs text-textSecondary mb-1">{label}</p>
        <p className="text-sm font-semibold text-textPrimary">
          ${payload[0].value.toLocaleString('es-AR')}
        </p>
      </div>
    );
  }
  return null;
};

function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [summaryRes, expensesRes] = await Promise.all([
          client.get('/expenses/summary/current-month'),
          client.get('/expenses'),
        ]);
        setSummary(summaryRes.data);
        setExpenses(expensesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const chartData = expenses
    .reduce((acc, expense) => {
      const existing = acc.find(item => item.period === expense.period);
      if (existing) {
        existing.total += parseFloat(expense.amount);
      } else {
        acc.push({ period: expense.period, total: parseFloat(expense.amount) });
      }
      return acc;
    }, [])
    .sort((a, b) => a.period.localeCompare(b.period))
    .slice(-6);

  if (loading) return (
    <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-textPrimary">Dashboard</h1>
        <p className="text-textSecondary text-sm mt-1">
          Resumen de {summary?.period}
        </p>
      </div>

      {/* Stats del mes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Receipt}
          label="Total del mes"
          value={`$${parseFloat(summary?.total_expenses || 0).toLocaleString('es-AR')}`}
          color="bg-primary"
        />
        <StatCard
          icon={CreditCard}
          label="Recaudado"
          value={`$${parseFloat(summary?.total_collected || 0).toLocaleString('es-AR')}`}
          color="bg-success"
          sub={`${summary?.collection_rate ?? 0}% cobrado`}
        />
        <StatCard
          icon={Receipt}
          label="Pendientes"
          value={summary?.pending_count}
          color="bg-warning"
        />
        <StatCard
          icon={AlertCircle}
          label="Vencidas"
          value={summary?.overdue_count}
          color="bg-danger"
        />
      </div>

      {/* Alerta vencidas */}
      {summary?.overdue_count > 0 && (
        <div className="flex items-center gap-3 bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 mb-6">
          <AlertCircle className="w-4 h-4 text-danger flex-shrink-0" />
          <p className="text-sm text-danger">
            Hay <strong>{summary.overdue_count}</strong> expensa{summary.overdue_count > 1 ? 's' : ''} vencida{summary.overdue_count > 1 ? 's' : ''}.
          </p>
        </div>
      )}

      {/* Gráfico */}
      <div className="card">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-textPrimary">Expensas por período</h2>
        </div>
        {chartData.length === 0 ? (
          <EmptyState message="No hay datos para el gráfico" />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barSize={32}>
              <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: '#8b8b9e', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8b8b9e', fontSize: 11 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
              <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={index} fill={index === chartData.length - 1 ? '#6366f1' : '#2a2a3a'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { isAdmin, role } = useRole();
  if (role === 'super_admin') return <SuperAdminDashboard />;
  if (isAdmin) return <AdminDashboard />;
  return <ResidentDashboard />;
}