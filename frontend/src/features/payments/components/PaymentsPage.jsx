import { useEffect, useState, useCallback } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import client from '../../../api/client';
import { Spinner } from '../../../components/ui/Spinner';
import { Badge } from '../../../components/ui/Badge';
import { EmptyState } from '../../../components/ui/EmptyState';

export function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const loadPayments = useCallback(() => {
    setLoading(true);
    client.get('/payments')
      .then(res => setPayments(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadPayments(); }, [loadPayments]);

  const handleAction = async (id, action) => {
    setActionLoading(id);
    try {
      await client.patch(`/payments/${id}/${action}`);
      loadPayments();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const methodLabel = { mercadopago: 'MercadoPago', transfer: 'Transferencia' };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-textPrimary">Pagos</h1>
        <p className="text-textSecondary text-sm mt-1">Gestión de pagos del consorcio</p>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : payments.length === 0 ? (
          <EmptyState message="No hay pagos registrados" />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs text-textSecondary font-medium px-6 py-4">Período</th>
                <th className="text-left text-xs text-textSecondary font-medium px-6 py-4">Monto</th>
                <th className="text-left text-xs text-textSecondary font-medium px-6 py-4">Método</th>
                <th className="text-left text-xs text-textSecondary font-medium px-6 py-4">Fecha</th>
                <th className="text-left text-xs text-textSecondary font-medium px-6 py-4">Estado</th>
                <th className="text-left text-xs text-textSecondary font-medium px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, i) => (
                <tr
                  key={payment.id}
                  className={`border-b border-border last:border-0 hover:bg-surfaceHover transition-colors ${
                    i % 2 === 0 ? '' : 'bg-surface/50'
                  }`}
                >
                  <td className="px-6 py-4 text-sm text-textPrimary">
                    {payment.Expense?.period || '—'}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-textPrimary">
                    ${parseFloat(payment.amount).toLocaleString('es-AR')}
                  </td>
                  <td className="px-6 py-4 text-sm text-textSecondary">
                    {methodLabel[payment.method] || payment.method}
                  </td>
                  <td className="px-6 py-4 text-sm text-textSecondary">
                    {payment.paid_at
                      ? new Date(payment.paid_at).toLocaleDateString('es-AR')
                      : '—'}
                  </td>
                  <td className="px-6 py-4"><Badge status={payment.status} /></td>
                  <td className="px-6 py-4">
                    {payment.status === 'pending' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAction(payment.id, 'confirm')}
                          disabled={actionLoading === payment.id}
                          className="flex items-center gap-1.5 text-xs bg-success/10 text-success hover:bg-success/20 px-3 py-1.5 rounded-lg transition-all"
                        >
                          {actionLoading === payment.id
                            ? <Spinner size="sm" />
                            : <><CheckCircle className="w-3.5 h-3.5" /> Confirmar</>
                          }
                        </button>
                        <button
                          onClick={() => handleAction(payment.id, 'reject')}
                          disabled={actionLoading === payment.id}
                          className="flex items-center gap-1.5 text-xs bg-danger/10 text-danger hover:bg-danger/20 px-3 py-1.5 rounded-lg transition-all"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Rechazar
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-textSecondary">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}