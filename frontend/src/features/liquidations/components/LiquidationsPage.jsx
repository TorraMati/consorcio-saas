import { useEffect, useState, useCallback } from 'react';
import { Plus, FileText, CheckCircle, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import client from '../../../api/client';
import { Spinner } from '../../../components/ui/Spinner';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Modal } from '../../../components/ui/Modal';
import { FormField } from '../../../components/ui/FormField';

const CATEGORIES = [
  { value: 'ordinaria', label: 'Ordinaria' },
  { value: 'extraordinaria', label: 'Extraordinaria' },
  { value: 'servicio', label: 'Servicio' },
  { value: 'otro', label: 'Otro' },
];

const STATUS_LABELS = {
  draft: { label: 'Borrador', color: 'text-warning bg-warning/10' },
  published: { label: 'Publicada', color: 'text-success bg-success/10' },
  closed: { label: 'Cerrada', color: 'text-textSecondary bg-surfaceHover' },
};

function CreateLiquidationForm({ buildings, onSuccess, onClose }) {
  const [error, setError] = useState('');
  const { register, handleSubmit, control, watch, formState: { isSubmitting, errors } } = useForm({
    defaultValues: {
      building_id: '',
      period: '',
      due_date: '',
      notes: '',
      items: [{ name: '', category: 'ordinaria', amount: '' }],
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const items = watch('items');
  const total = items.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);

  const onSubmit = async (data) => {
    try {
      setError('');
      await client.post('/liquidations', {
        ...data,
        items: data.items.map(i => ({ ...i, amount: parseFloat(i.amount) })),
      });
      onSuccess();
      onClose();
    } catch (err) { setError(err.message); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Edificio" error={errors.building_id?.message}>
          <select {...register('building_id', { required: 'Requerido' })} className="input">
            <option value="">Seleccioná un edificio</option>
            {buildings.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Período (MM-YYYY)" error={errors.period?.message}>
          <input
            {...register('period', {
              required: 'Requerido',
              pattern: { value: /^\d{2}-\d{4}$/, message: 'Formato MM-YYYY' }
            })}
            placeholder="03-2026"
            className="input"
          />
        </FormField>
      </div>

      <FormField label="Fecha de vencimiento" error={errors.due_date?.message}>
        <input {...register('due_date', { required: 'Requerido' })} type="date" className="input" />
      </FormField>

      {/* Conceptos */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-textSecondary uppercase tracking-wider">Conceptos</p>
          <button
            type="button"
            onClick={() => append({ name: '', category: 'ordinaria', amount: '' })}
            className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Agregar concepto
          </button>
        </div>
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-12 gap-2 items-start">
              <div className="col-span-5">
                <input
                  {...register(`items.${index}.name`, { required: true })}
                  placeholder="Ej: Ordinarias"
                  className="input text-sm"
                />
              </div>
              <div className="col-span-3">
                <select {...register(`items.${index}.category`)} className="input text-sm">
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-3">
                <input
                  {...register(`items.${index}.amount`, { required: true })}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Monto total"
                  className="input text-sm"
                />
              </div>
              <div className="col-span-1 flex justify-center pt-2">
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(index)} className="text-danger hover:text-danger/80">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-4 bg-surfaceHover rounded-xl px-4 py-3 flex items-center justify-between">
          <p className="text-sm text-textSecondary">Total liquidación</p>
          <p className="text-lg font-bold text-textPrimary">
            ${total.toLocaleString('es-AR')}
          </p>
        </div>
      </div>

      <FormField label="Notas (opcional)">
        <textarea {...register('notes')} placeholder="Observaciones..." className="input resize-none" rows={2} />
      </FormField>

      {error && <div className="bg-danger/10 border border-danger/20 text-danger text-sm px-4 py-3 rounded-xl">{error}</div>}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
          {isSubmitting ? <Spinner size="sm" /> : 'Crear liquidación'}
        </button>
      </div>
    </form>
  );
}

function LiquidationCard({ liq, onPublish, onDelete, onRefresh }) {
  const [expanded, setExpanded] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const status = STATUS_LABELS[liq.status] || STATUS_LABELS.draft;

  const handlePublish = async () => {
    if (!confirm(`¿Publicar liquidación ${liq.period}? Esto generará las expensas para todas las unidades.`)) return;
    setPublishing(true);
    try {
      await onPublish(liq.id);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-3 flex-1 text-left">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-textPrimary">
                {liq.Building?.name} — {liq.period}
              </p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.color}`}>
                {status.label}
              </span>
            </div>
            <p className="text-xs text-textSecondary">
              Vence: {new Date(liq.due_date).toLocaleDateString('es-AR')} ·
              Total: ${parseFloat(liq.total_amount || 0).toLocaleString('es-AR')}
            </p>
          </div>
          <div className="ml-3 text-textSecondary">
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
        </button>

        <div className="flex items-center gap-2 ml-4">
          {liq.status === 'draft' && (
            <>
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="flex items-center gap-1.5 text-xs bg-success/10 text-success hover:bg-success/20 px-3 py-1.5 rounded-lg transition-all"
              >
                {publishing ? <Spinner size="sm" /> : <><CheckCircle className="w-3.5 h-3.5" /> Publicar</>}
              </button>
              <button
                onClick={() => onDelete(liq.id)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-textSecondary hover:bg-danger/10 hover:text-danger transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {expanded && liq.items?.length > 0 && (
        <div className="mt-4 border-t border-border pt-4">
          <p className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-3">Conceptos</p>
          <div className="space-y-2">
            {liq.items.map(item => (
              <div key={item.id} className="flex items-center justify-between bg-surfaceHover rounded-xl px-4 py-2">
                <div>
                  <p className="text-sm font-medium text-textPrimary">{item.name}</p>
                  <p className="text-xs text-textSecondary capitalize">{item.category}</p>
                </div>
                <p className="text-sm font-semibold text-textPrimary">
                  ${parseFloat(item.amount).toLocaleString('es-AR')}
                </p>
              </div>
            ))}
          </div>
          {liq.notes && (
            <p className="text-xs text-textSecondary mt-3 bg-surfaceHover rounded-xl px-4 py-2">
              📝 {liq.notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function LiquidationsPage() {
  const [liquidations, setLiquidations] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterBuilding, setFilterBuilding] = useState('');

  const loadData = useCallback(() => {
    setLoading(true);
    const params = filterBuilding ? `?building_id=${filterBuilding}` : '';
    Promise.all([
      client.get(`/liquidations${params}`),
      client.get('/buildings'),
    ])
      .then(([liqRes, buildRes]) => {
        setLiquidations(liqRes.data);
        setBuildings(buildRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filterBuilding]);

  useEffect(() => { loadData(); }, [loadData]);

  const handlePublish = async (id) => {
    await client.post(`/liquidations/${id}/publish`);
    loadData();
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta liquidación?')) return;
    await client.delete(`/liquidations/${id}`);
    loadData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-textPrimary">Liquidaciones</h1>
          <p className="text-textSecondary text-sm mt-1">Generación y distribución de expensas</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nueva liquidación
        </button>
      </div>

      {/* Filtro por edificio */}
      {buildings.length > 1 && (
        <div className="mb-6">
          <select
            value={filterBuilding}
            onChange={e => setFilterBuilding(e.target.value)}
            className="input max-w-xs"
          >
            <option value="">Todos los edificios</option>
            {buildings.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : liquidations.length === 0 ? (
        <EmptyState message="No hay liquidaciones. Creá la primera." />
      ) : (
        <div className="space-y-4">
          {liquidations.map(liq => (
            <LiquidationCard
              key={liq.id}
              liq={liq}
              onPublish={handlePublish}
              onDelete={handleDelete}
              onRefresh={loadData}
            />
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nueva liquidación">
        <CreateLiquidationForm
          buildings={buildings}
          onSuccess={loadData}
          onClose={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
}