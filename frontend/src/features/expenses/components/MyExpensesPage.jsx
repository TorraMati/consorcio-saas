import { useEffect, useState, useCallback } from 'react';
import client from '../../../api/client';
import { Spinner } from '../../../components/ui/Spinner';
import { Badge } from '../../../components/ui/Badge';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Modal } from '../../../components/ui/Modal';
import { PayExpenseForm } from './PayExpenseForm';

export function MyExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const loadExpenses = useCallback(() => {
    setLoading(true);
    client.get('/expenses/my')
      .then(res => setExpenses(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadExpenses(); }, [loadExpenses]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-textPrimary">Mis Expensas</h1>
        <p className="text-textSecondary text-sm mt-1">Historial de tus expensas</p>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : expenses.length === 0 ? (
          <EmptyState message="No tenés expensas asignadas" />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs text-textSecondary font-medium px-6 py-4">Período</th>
                <th className="text-left text-xs text-textSecondary font-medium px-6 py-4">Monto</th>
                <th className="text-left text-xs text-textSecondary font-medium px-6 py-4">Vencimiento</th>
                <th className="text-left text-xs text-textSecondary font-medium px-6 py-4">Estado</th>
                <th className="text-left text-xs text-textSecondary font-medium px-6 py-4">Acción</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense, i) => (
                <tr
                  key={expense.id}
                  className={`border-b border-border last:border-0 hover:bg-surfaceHover transition-colors ${
                    i % 2 === 0 ? '' : 'bg-surface/50'
                  }`}
                >
                  <td className="px-6 py-4 text-sm text-textPrimary">{expense.period}</td>
                  <td className="px-6 py-4 text-sm font-medium text-textPrimary">
                    ${parseFloat(expense.amount).toLocaleString('es-AR')}
                  </td>
                  <td className="px-6 py-4 text-sm text-textSecondary">{expense.due_date}</td>
                  <td className="px-6 py-4"><Badge status={expense.status} /></td>
                  <td className="px-6 py-4">
                    {expense.status === 'pending' || expense.status === 'overdue' ? (
                      <button
                        onClick={() => setSelected(expense)}
                        className="btn-primary text-xs py-1.5 px-3"
                      >
                        Pagar
                      </button>
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

      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={`Pagar expensa ${selected?.period}`}
      >
        {selected && (
          <PayExpenseForm
            expense={selected}
            onSuccess={() => { loadExpenses(); setSelected(null); }}
            onClose={() => setSelected(null)}
          />
        )}
      </Modal>
    </div>
  );
}