import { useState } from 'react';
import { useForm } from 'react-hook-form';
import client from '../../../api/client';
import { Spinner } from '../../../components/ui/Spinner';

export function PayExpenseForm({ expense, onSuccess, onClose }) {
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      setError('');
      const res = await client.post('/payments', {
        expense_id: expense.id,
        method: data.method,
      });

      // Si es MercadoPago, redirigir al checkout
      if (data.method === 'mercadopago' && res.data.checkout_url) {
        window.open(res.data.checkout_url, '_blank');
      }

      onSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="bg-surfaceHover rounded-xl px-4 py-3">
        <p className="text-xs text-textSecondary mb-1">Monto a pagar</p>
        <p className="text-2xl font-bold text-textPrimary">
          ${parseFloat(expense.amount).toLocaleString('es-AR')}
        </p>
        <p className="text-xs text-textSecondary mt-1">Período {expense.period}</p>
      </div>

      <div>
        <label className="text-sm text-textSecondary mb-3 block">Método de pago</label>
        <div className="space-y-2">
          <label className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/50 cursor-pointer transition-all">
            <input
              {...register('method', { required: true })}
              type="radio"
              value="transfer"
              className="accent-primary"
            />
            <div>
              <p className="text-sm font-medium text-textPrimary">Transferencia bancaria</p>
              <p className="text-xs text-textSecondary">El administrador confirmará el pago</p>
            </div>
          </label>
          <label className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/50 cursor-pointer transition-all">
            <input
              {...register('method', { required: true })}
              type="radio"
              value="mercadopago"
              className="accent-primary"
            />
            <div>
              <p className="text-sm font-medium text-textPrimary">MercadoPago</p>
              <p className="text-xs text-textSecondary">Pago online inmediato</p>
            </div>
          </label>
        </div>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/20 text-danger text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
          {isSubmitting ? <Spinner size="sm" /> : 'Confirmar pago'}
        </button>
      </div>
    </form>
  );
}