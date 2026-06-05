import { useEffect, useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import client from '../../../api/client';
import { Spinner } from '../../../components/ui/Spinner';
import { Badge } from '../../../components/ui/Badge';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Modal } from '../../../components/ui/Modal';
import { FormField } from '../../../components/ui/FormField';

function CreateExpenseForm({ onSuccess, onClose }) {
  const [buildings, setBuildings] = useState([]);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm();

  useEffect(() => {
    client.get('/buildings').then(res => setBuildings(res.data)).catch(console.error);
  }, []);

  const onSubmit = async (data) => {
    try {
      setError('');
      await client.post('/expenses', data);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Unidad" error={errors.building_id?.message}>
        <select
          {...register('building_id', { required: 'Seleccioná una unidad' })}
          className="input"
        >
          <option value="">Seleccioná una unidad</option>
          {buildings.map(b => (
            <option key={b.id} value={b.id}>
              Unidad {b.unit_number} {b.floor ? `— Piso ${b.floor}` : ''}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Monto ($)" error={errors.amount?.message}>
        <input
          {...register('amount', {
            required: 'El monto es requerido',
            min: { value: 0.01, message: 'El monto debe ser mayor a 0' }
          })}
          type="number"
          step="0.01"
          placeholder="15000.00"
          className="input"
        />
      </FormField>

      <FormField label="Período (AAAA-MM)" error={errors.period?.message}>
        <input
          {...register('period', {
            required: 'El período es requerido',
            pattern: { value: /^\d{4}-\d{2}$/, message: 'Formato: AAAA-MM' }
          })}
          type="text"
          placeholder="2026-03"
          className="input"
        />
      </FormField>

      <FormField label="Fecha de vencimiento" error={errors.due_date?.message}>
        <input
          {...register('due_date', { required: 'La fecha es requerida' })}
          type="date"
          className="input"
        />
      </FormField>

      {error && (
        <div className="bg-danger/10 border border-danger/20 text-danger text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-ghost flex-1">
          Cancelar
        </button>
        <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
          {isSubmitting ? <Spinner size="sm" /> : 'Crear expensa'}
        </button>
      </div>
    </form>
  );
}

export function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const loadExpenses = useCallback(() => {
    setLoading(true);
    client.get('/expenses')
      .then(res => setExpenses(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadExpenses(); }, [loadExpenses]);

  const filtered = filter === 'all'
    ? expenses
    : expenses.filter(e => e.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-textPrimary">Expensas</h1>
          <p className="text-textSecondary text-sm mt-1">Gestión de expensas del consorcio</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nueva expensa
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'paid', 'overdue'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-xl text-sm transition-all ${
              filter === f
                ? 'bg-primary text-white'
                : 'bg-surfaceHover text-textSecondary hover:text-textPrimary'
            }`}
          >
            {{ all: 'Todas', pending: 'Pendientes', paid: 'Pagadas', overdue: 'Vencidas' }[f]}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : filtered.length === 0 ? (
          <EmptyState message="No hay expensas para mostrar" />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs text-textSecondary font-medium px-6 py-4">Unidad</th>
                <th className="text-left text-xs text-textSecondary font-medium px-6 py-4">Período</th>
                <th className="text-left text-xs text-textSecondary font-medium px-6 py-4">Monto</th>
                <th className="text-left text-xs text-textSecondary font-medium px-6 py-4">Vencimiento</th>
                <th className="text-left text-xs text-textSecondary font-medium px-6 py-4">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((expense, i) => (
                <tr
                  key={expense.id}
                  className={`border-b border-border last:border-0 hover:bg-surfaceHover transition-colors ${
                    i % 2 === 0 ? '' : 'bg-surface/50'
                  }`}
                >
                  <td className="px-6 py-4 text-sm text-textPrimary">
                    {expense.Building?.unit_number || '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-textPrimary">{expense.period}</td>
                  <td className="px-6 py-4 text-sm font-medium text-textPrimary">
                    ${parseFloat(expense.amount).toLocaleString('es-AR')}
                  </td>
                  <td className="px-6 py-4 text-sm text-textSecondary">{expense.due_date}</td>
                  <td className="px-6 py-4"><Badge status={expense.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nueva expensa">
        <CreateExpenseForm onSuccess={loadExpenses} onClose={() => setShowModal(false)} />
      </Modal>
    </div>
  );
}