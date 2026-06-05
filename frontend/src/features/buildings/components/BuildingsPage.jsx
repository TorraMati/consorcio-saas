import { useEffect, useState, useCallback } from 'react';
import { Plus, Building2, ChevronDown, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import client from '../../../api/client';
import { Spinner } from '../../../components/ui/Spinner';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Modal } from '../../../components/ui/Modal';
import { FormField } from '../../../components/ui/FormField';

function BuildingForm({ building, onSuccess, onClose }) {
  const isEditing = !!building;
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm({
    defaultValues: {
      name: building?.name || '',
      address: building?.address || '',
    }
  });

  const onSubmit = async (data) => {
    try {
      setError('');
      if (isEditing) {
        await client.put(`/buildings/${building.id}`, data);
      } else {
        await client.post('/buildings', data);
      }
      onSuccess();
      onClose();
    } catch (err) { setError(err.message); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Nombre del edificio" error={errors.name?.message}>
        <input {...register('name', { required: 'Requerido' })} placeholder="Torre Norte" className="input" />
      </FormField>
      <FormField label="Dirección">
        <input {...register('address')} placeholder="Av. Corrientes 1234" className="input" />
      </FormField>
      {error && <div className="bg-danger/10 border border-danger/20 text-danger text-sm px-4 py-3 rounded-xl">{error}</div>}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
          {isSubmitting ? <Spinner size="sm" /> : isEditing ? 'Guardar cambios' : 'Crear edificio'}
        </button>
      </div>
    </form>
  );
}

function UnitForm({ buildingId, unit, users, onSuccess, onClose }) {
  const isEditing = !!unit;
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm({
    defaultValues: {
      unit_number: unit?.unit_number || '',
      floor: unit?.floor || '',
      percentage: unit?.percentage || '',
      owner_id: unit?.owner_id || '',
      tenant_user_id: unit?.tenant_user_id || '',
    }
  });

  const owners = users.filter(u => u.role === 'owner');
  const tenants = users.filter(u => u.role === 'tenant');

  const onSubmit = async (data) => {
    try {
      setError('');
      const payload = Object.fromEntries(
        Object.entries({ ...data, building_id: buildingId })
          .filter(([_, v]) => v !== '')
      );
      if (isEditing) {
        await client.put(`/units/${unit.id}`, payload);
      } else {
        await client.post('/units', payload);
      }
      onSuccess();
      onClose();
    } catch (err) { setError(err.message); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <FormField label="Número de unidad" error={errors.unit_number?.message}>
          <input {...register('unit_number', { required: 'Requerido' })} placeholder="2B" className="input" />
        </FormField>
        <FormField label="Piso (opcional)">
          <input {...register('floor')} placeholder="2" className="input" />
        </FormField>
        <FormField label="Coeficiente %">
          <input
            {...register('percentage')}
            type="number"
            min="0"
            max="100"
            step="0.001"
            placeholder="4.045"
            className="input"
          />
        </FormField>
      </div>
      <FormField label="Propietario (opcional)">
        <select {...register('owner_id')} className="input">
          <option value="">Sin asignar</option>
          {owners.map(u => (
            <option key={u.id} value={u.id}>{u.first_name} {u.last_name}</option>
          ))}
        </select>
      </FormField>
      <FormField label="Inquilino (opcional)">
        <select {...register('tenant_user_id')} className="input">
          <option value="">Sin asignar</option>
          {tenants.map(u => (
            <option key={u.id} value={u.id}>{u.first_name} {u.last_name}</option>
          ))}
        </select>
      </FormField>
      {error && <div className="bg-danger/10 border border-danger/20 text-danger text-sm px-4 py-3 rounded-xl">{error}</div>}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
          {isSubmitting ? <Spinner size="sm" /> : isEditing ? 'Guardar cambios' : 'Crear unidad'}
        </button>
      </div>
    </form>
  );
}

function BuildingCard({ building, users, onRefresh }) {
  const [expanded, setExpanded] = useState(false);
  const [units, setUnits] = useState([]);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [editingBuilding, setEditingBuilding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadUnits = useCallback(() => {
    setLoadingUnits(true);
    client.get(`/units/building/${building.id}`)
      .then(res => setUnits(res.data))
      .catch(console.error)
      .finally(() => setLoadingUnits(false));
  }, [building.id]);

  const handleExpand = () => {
    if (!expanded) loadUnits();
    setExpanded(!expanded);
  };

  const handleDeleteBuilding = async () => {
    if (!confirm('¿Eliminar este edificio?')) return;
    try {
      await client.delete(`/buildings/${building.id}`);
      onRefresh();
    } catch (err) { alert(err.message); }
  };

  const handleDeleteUnit = async (unitId) => {
    if (!confirm('¿Eliminar esta unidad?')) return;
    setDeletingId(unitId);
    try {
      await client.delete(`/units/${unitId}`);
      loadUnits();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleUnitClose = () => {
    setShowUnitModal(false);
    setEditingUnit(null);
  };

  return (
    <div className="card">
      {/* Header del edificio */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleExpand}
          className="flex items-center gap-3 flex-1 text-left"
        >
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-textPrimary">{building.name}</p>
            {building.address && (
              <p className="text-xs text-textSecondary">{building.address}</p>
            )}
          </div>
          <div className="ml-3 text-textSecondary">
            {expanded
              ? <ChevronDown className="w-4 h-4" />
              : <ChevronRight className="w-4 h-4" />
            }
          </div>
        </button>

        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => setShowUnitModal(true)}
            className="flex items-center gap-1.5 text-xs bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Unidad
          </button>
          <button
            onClick={() => setEditingBuilding(true)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-textSecondary hover:bg-surfaceHover hover:text-textPrimary transition-all"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={handleDeleteBuilding}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-textSecondary hover:bg-danger/10 hover:text-danger transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Unidades expandidas */}
      {expanded && (
        <div className="mt-4 border-t border-border pt-4">
          {loadingUnits ? (
            <div className="flex justify-center py-4"><Spinner size="sm" /></div>
          ) : units.length === 0 ? (
            <p className="text-sm text-textSecondary text-center py-4">
              No hay unidades. Hacé clic en "+ Unidad" para agregar.
            </p>
          ) : (
            <div className="space-y-2">
              {units.map(unit => (
                <div
                  key={unit.id}
                  className="flex items-center justify-between bg-surfaceHover rounded-xl px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-textPrimary">
                      Unidad {unit.unit_number}
                      {unit.floor && <span className="text-textSecondary font-normal"> · Piso {unit.floor}</span>}
                    </p>
                    <p className="text-xs text-textSecondary">
                      {unit.owner
                        ? `Prop: ${unit.owner.first_name} ${unit.owner.last_name}`
                        : 'Sin propietario'}
                      {unit.tenantUser && ` · Inq: ${unit.tenantUser.first_name} ${unit.tenantUser.last_name}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingUnit(unit)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-textSecondary hover:bg-border hover:text-textPrimary transition-all"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteUnit(unit.id)}
                      disabled={deletingId === unit.id}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-textSecondary hover:bg-danger/10 hover:text-danger transition-all"
                    >
                      {deletingId === unit.id ? <Spinner size="sm" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal nueva unidad */}
      <Modal isOpen={showUnitModal} onClose={handleUnitClose} title={`Nueva unidad en ${building.name}`}>
        <UnitForm
          buildingId={building.id}
          users={users}
          onSuccess={() => { loadUnits(); if (!expanded) setExpanded(true); }}
          onClose={handleUnitClose}
        />
      </Modal>

      {/* Modal editar unidad */}
      <Modal isOpen={!!editingUnit} onClose={handleUnitClose} title="Editar unidad">
        {editingUnit && (
          <UnitForm
            buildingId={building.id}
            unit={editingUnit}
            users={users}
            onSuccess={loadUnits}
            onClose={handleUnitClose}
          />
        )}
      </Modal>

      {/* Modal editar edificio */}
      <Modal isOpen={editingBuilding} onClose={() => setEditingBuilding(false)} title="Editar edificio">
        <BuildingForm
          building={building}
          onSuccess={onRefresh}
          onClose={() => setEditingBuilding(false)}
        />
      </Modal>
    </div>
  );
}

export function BuildingsPage() {
  const [buildings, setBuildings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const loadData = useCallback(() => {
    setLoading(true);
    Promise.all([
      client.get('/buildings'),
      client.get('/users'),
    ])
      .then(([buildingsRes, usersRes]) => {
        setBuildings(buildingsRes.data);
        setUsers(usersRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-textPrimary">Edificios y Unidades</h1>
          <p className="text-textSecondary text-sm mt-1">Gestión de edificios y departamentos</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo edificio
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : buildings.length === 0 ? (
        <EmptyState message="No hay edificios registrados. Creá el primero." />
      ) : (
        <div className="space-y-4">
          {buildings.map(building => (
            <BuildingCard
              key={building.id}
              building={building}
              users={users}
              onRefresh={loadData}
            />
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nuevo edificio">
        <BuildingForm onSuccess={loadData} onClose={() => setShowModal(false)} />
      </Modal>
    </div>
  );
}