import { useEffect, useState, useCallback } from 'react';
import { Plus, Building2, Settings, Trash2, UserPlus, Edit2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import client from '../../../api/client';
import { Spinner } from '../../../components/ui/Spinner';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Modal } from '../../../components/ui/Modal';
import { FormField } from '../../../components/ui/FormField';

function CreateTenantForm({ onSuccess, onClose }) {
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setError('');
      await client.post('/tenants', data);
      onSuccess();
      onClose();
    } catch (err) { setError(err.message); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Nombre" error={errors.first_name?.message}>
          <input {...register('first_name', { required: 'Requerido' })} placeholder="Juan" className="input" />
        </FormField>
        <FormField label="Apellido" error={errors.last_name?.message}>
          <input {...register('last_name', { required: 'Requerido' })} placeholder="García" className="input" />
        </FormField>
      </div>
      <FormField label="Nombre del consorcio" error={errors.name?.message}>
        <input {...register('name', { required: 'Requerido' })} placeholder="Consorcio Belgrano" className="input" />
      </FormField>
      <FormField label="Dirección">
        <input {...register('address')} placeholder="Av. Cabildo 1234" className="input" />
      </FormField>
      <FormField label="CUIT">
        <input {...register('cuit')} placeholder="30-12345678-9" className="input" />
      </FormField>
      <FormField label="Teléfono">
        <input {...register('phone')} placeholder="+54 11 1234-5678" className="input" />
      </FormField>
      <FormField label="Email de contacto" error={errors.email?.message}>
        <input {...register('email', { required: 'Requerido' })} type="email" placeholder="contacto@consorcio.com" className="input" />
      </FormField>
      {error && <div className="bg-danger/10 border border-danger/20 text-danger text-sm px-4 py-3 rounded-xl">{error}</div>}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
          {isSubmitting ? <Spinner size="sm" /> : 'Crear cliente'}
        </button>
      </div>
    </form>
  );
}

function CreateAdminForm({ tenant, onSuccess, onClose }) {
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setError('');
      await client.post(`/super-admin/tenants/${tenant.id}/admin`, data);
      onSuccess();
      onClose();
    } catch (err) { setError(err.message); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-sm text-textSecondary">
        Creando administrador para <strong className="text-textPrimary">{tenant.name}</strong>
      </p>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Nombre" error={errors.first_name?.message}>
          <input {...register('first_name', { required: 'Requerido' })} placeholder="Juan" className="input" />
        </FormField>
        <FormField label="Apellido" error={errors.last_name?.message}>
          <input {...register('last_name', { required: 'Requerido' })} placeholder="García" className="input" />
        </FormField>
      </div>
      <FormField label="Email" error={errors.email?.message}>
        <input {...register('email', { required: 'Requerido' })} type="email" placeholder="admin@consorcio.com" className="input" />
      </FormField>
      <FormField label="Contraseña" error={errors.password?.message}>
        <input {...register('password', { required: 'Requerido', minLength: { value: 8, message: 'Mínimo 8 caracteres' } })} type="password" placeholder="••••••••" className="input" />
      </FormField>
      <FormField label="Teléfono (opcional)">
        <input {...register('phone')} placeholder="+54 11 1234-5678" className="input" />
      </FormField>
      {error && <div className="bg-danger/10 border border-danger/20 text-danger text-sm px-4 py-3 rounded-xl">{error}</div>}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
          {isSubmitting ? <Spinner size="sm" /> : 'Crear administrador'}
        </button>
      </div>
    </form>
  );
}

function SetLimitsForm({ tenant, sysConfig, onSuccess, onClose }) {
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(0);
  const { register, handleSubmit, watch, formState: { isSubmitting } } = useForm({
    defaultValues: {
      max_buildings: tenant.limits?.max_buildings || 1,
      max_units: tenant.limits?.max_units || 10,
      max_amenities: tenant.limits?.max_amenities || 2,
    }
  });

  const maxUnits = watch('max_units') || 0;
  const maxAmenities = watch('max_amenities') || 0;

  useEffect(() => {
    const price = (parseFloat(maxUnits) * parseFloat(sysConfig?.price_per_unit || 500)) +
                  (parseFloat(maxAmenities) * parseFloat(sysConfig?.price_per_amenity || 200));
    setPreview(price);
  }, [maxUnits, maxAmenities, sysConfig]);

  const onSubmit = async (data) => {
    try {
      setError('');
      await client.put(`/tenant-limits/${tenant.id}`, {
        max_buildings: parseInt(data.max_buildings),
        max_units: parseInt(data.max_units),
        max_amenities: parseInt(data.max_amenities),
      });
      onSuccess();
      onClose();
    } catch (err) { setError(err.message); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-sm text-textSecondary">
        Límites para <strong className="text-textPrimary">{tenant.name}</strong>
      </p>
      <div className="grid grid-cols-3 gap-4">
        <FormField label="Máx. edificios">
          <input {...register('max_buildings')} type="number" min="1" className="input" />
        </FormField>
        <FormField label="Máx. unidades">
          <input {...register('max_units')} type="number" min="1" className="input" />
        </FormField>
        <FormField label="Máx. amenities">
          <input {...register('max_amenities')} type="number" min="0" className="input" />
        </FormField>
      </div>

      {/* Preview del precio */}
      <div className="bg-surfaceHover rounded-xl px-4 py-3">
        <p className="text-xs text-textSecondary mb-1">Plan mensual calculado</p>
        <p className="text-xl font-bold text-textPrimary">
          ${preview.toLocaleString('es-AR')}
        </p>
        <p className="text-xs text-textSecondary mt-1">
          {maxUnits} unidades × ${parseFloat(sysConfig?.price_per_unit || 500).toLocaleString('es-AR')} +
          {' '}{maxAmenities} amenities × ${parseFloat(sysConfig?.price_per_amenity || 200).toLocaleString('es-AR')}
        </p>
      </div>

      {error && <div className="bg-danger/10 border border-danger/20 text-danger text-sm px-4 py-3 rounded-xl">{error}</div>}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
          {isSubmitting ? <Spinner size="sm" /> : 'Guardar límites'}
        </button>
      </div>
    </form>
  );
}

function SystemConfigForm({ config, onSuccess, onClose }) {
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      price_per_unit: config?.price_per_unit || 500,
      price_per_amenity: config?.price_per_amenity || 200,
    }
  });

  const onSubmit = async (data) => {
    try {
      setError('');
      await client.put('/tenant-limits/system-config', {
        price_per_unit: parseFloat(data.price_per_unit),
        price_per_amenity: parseFloat(data.price_per_amenity),
      });
      onSuccess();
      onClose();
    } catch (err) { setError(err.message); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-sm text-textSecondary">Estos precios se usan para calcular el plan mensual de cada consorcio.</p>
      <FormField label="Precio por unidad (departamento) $">
        <input {...register('price_per_unit')} type="number" min="0" step="0.01" className="input" />
      </FormField>
      <FormField label="Precio por amenity $">
        <input {...register('price_per_amenity')} type="number" min="0" step="0.01" className="input" />
      </FormField>
      {error && <div className="bg-danger/10 border border-danger/20 text-danger text-sm px-4 py-3 rounded-xl">{error}</div>}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
          {isSubmitting ? <Spinner size="sm" /> : 'Guardar precios'}
        </button>
      </div>
    </form>
  );
}

export function TenantsPage() {
  const [data, setData] = useState({ tenants: [], system_config: null });
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showSysConfig, setShowSysConfig] = useState(false);
  const [editingLimits, setEditingLimits] = useState(null);
  const [creatingAdmin, setCreatingAdmin] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadData = useCallback(() => {
  setLoading(true);
  client.get('/tenant-limits')
    .then(res => {
      console.log('respuesta loadData:', res.data);
      setData(res.data);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
}, []);

  const handleActivate = async (tenantId) => {
  try {
    await client.patch(`/super-admin/tenants/${tenantId}/activate`);
    setData({ tenants: [], system_config: null });
    loadData();
  } catch (err) {
    alert(err.message);
  }
};

  useEffect(() => { loadData(); }, [loadData]);

  const handleDelete = async (tenantId, soft = true) => {
  const msg = soft
    ? '¿Desactivar este consorcio? Sus datos se conservan.'
    : '⚠️ ¿BORRAR DEFINITIVAMENTE? Esta acción no se puede deshacer.';
  if (!confirm(msg)) return;
  setDeletingId(tenantId);
  try {
    await client.delete(`/tenants/${tenantId}${soft ? '' : '?permanent=true'}`);
    setData({ tenants: [], system_config: null });
    loadData();
  } catch (err) {
    alert(err.message);
  } finally {
    setDeletingId(null);
  }
};

  const totalRevenue = data.tenants?.reduce((sum, t) => sum + (t.monthly_price || 0), 0) || 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-textPrimary">Consorcios</h1>
          <p className="text-textSecondary text-sm mt-1">
            {data.tenants?.length || 0} consorcios · Facturación total: ${totalRevenue.toLocaleString('es-AR')}/mes
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowSysConfig(true)} className="btn-ghost flex items-center gap-2 text-sm">
            <Settings className="w-4 h-4" />
            Precios
          </button>
          <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nuevo consorcio
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : data.tenants?.length === 0 ? (
        <EmptyState message="No hay consorcios registrados" />
      ) : (
        <div className="space-y-4">
          {data.tenants?.map(item => (
            <div key={item.tenant.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-textPrimary">{item.tenant.name}</p>
                    {!item.tenant.is_active && (
                    <span className="badge-warning">Inactivo</span>
                    )}
                  </div>
                  <p className="text-xs text-textSecondary">{item.tenant.slug}</p>
                </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCreatingAdmin(item.tenant)}
                    className="flex items-center gap-1.5 text-xs bg-success/10 text-success hover:bg-success/20 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Admin
                  </button>
                  <button
                    onClick={() => setEditingLimits({ ...item.tenant, limits: item.limits })}
                    className="flex items-center gap-1.5 text-xs bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <Settings className="w-3.5 h-3.5" /> Límites
                  </button>
                  {item.tenant.is_active ? (
                  <button
                    onClick={() => handleDelete(item.tenant.id, true)}
                    disabled={deletingId === item.tenant.id}
                    className="flex items-center gap-1.5 text-xs bg-warning/10 text-warning hover:bg-warning/20 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Desactivar
                  </button>
                ) : (
                  <button
                    onClick={() => handleActivate(item.tenant.id)}
                    className="flex items-center gap-1.5 text-xs bg-success/10 text-success hover:bg-success/20 px-3 py-1.5 rounded-lg transition-all"
                  >
                    ✓ Activar
                  </button>
                )}
                <button
                  onClick={() => handleDelete(item.tenant.id, false)}
                  disabled={deletingId === item.tenant.id}
                  className="flex items-center gap-1.5 text-xs bg-danger/10 text-danger hover:bg-danger/20 px-3 py-1.5 rounded-lg transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Borrar
                </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div className="bg-surfaceHover rounded-xl px-4 py-3">
                  <p className="text-xs text-textSecondary mb-1">Edificios</p>
                  <p className="font-semibold text-textPrimary">
                    {item.usage.buildings}
                    <span className="text-textSecondary font-normal"> / {item.limits.max_buildings}</span>
                  </p>
                </div>
                <div className="bg-surfaceHover rounded-xl px-4 py-3">
                  <p className="text-xs text-textSecondary mb-1">Unidades</p>
                  <p className="font-semibold text-textPrimary">
                    {item.usage.units}
                    <span className="text-textSecondary font-normal"> / {item.limits.max_units}</span>
                  </p>
                </div>
                <div className="bg-surfaceHover rounded-xl px-4 py-3">
                  <p className="text-xs text-textSecondary mb-1">Amenities</p>
                  <p className="font-semibold text-textPrimary">
                    {item.usage.amenities}
                    <span className="text-textSecondary font-normal"> / {item.limits.max_amenities}</span>
                  </p>
                </div>
                <div className="bg-surfaceHover rounded-xl px-4 py-3">
                  <p className="text-xs text-textSecondary mb-1">Plan mensual</p>
                  <p className="font-semibold text-success">
                    ${parseFloat(item.monthly_price || 0).toLocaleString('es-AR')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Nuevo consorcio">
        <CreateTenantForm onSuccess={loadData} onClose={() => setShowCreate(false)} />
      </Modal>

      <Modal isOpen={showSysConfig} onClose={() => setShowSysConfig(false)} title="Configurar precios globales">
        <SystemConfigForm config={data.system_config} onSuccess={loadData} onClose={() => setShowSysConfig(false)} />
      </Modal>

      <Modal isOpen={!!editingLimits} onClose={() => setEditingLimits(null)} title="Configurar límites">
        {editingLimits && (
          <SetLimitsForm
            tenant={editingLimits}
            sysConfig={data.system_config}
            onSuccess={loadData}
            onClose={() => setEditingLimits(null)}
          />
        )}
      </Modal>

      <Modal isOpen={!!creatingAdmin} onClose={() => setCreatingAdmin(null)} title="Crear administrador">
        {creatingAdmin && (
          <CreateAdminForm
            tenant={creatingAdmin}
            onSuccess={loadData}
            onClose={() => setCreatingAdmin(null)}
          />
        )}
      </Modal>
    </div>
  );
}