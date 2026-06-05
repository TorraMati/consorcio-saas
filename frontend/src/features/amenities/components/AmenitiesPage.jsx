import { useEffect, useState, useCallback } from 'react';
import { Plus, Clock, Users, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import client from '../../../api/client';
import { Spinner } from '../../../components/ui/Spinner';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Modal } from '../../../components/ui/Modal';
import { FormField } from '../../../components/ui/FormField';
import { useRole } from '../../../hooks/useRole';
import { useNavigate } from 'react-router-dom';

function CreateAmenityForm({ onSuccess, onClose }) {
  const [error, setError] = useState('');
  const [slotType, setSlotType] = useState('hourly');
  const [shifts, setShifts] = useState([
    { name: 'Mañana', start: '08:00', end: '12:00' },
  ]);
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm();

  const addShift = () => {
    setShifts([...shifts, { name: '', start: '', end: '' }]);
  };

  const removeShift = (index) => {
    setShifts(shifts.filter((_, i) => i !== index));
  };

  const updateShift = (index, field, value) => {
    const updated = [...shifts];
    updated[index][field] = value;
    setShifts(updated);
  };

  const onSubmit = async (data) => {
    try {
      setError('');
      const payload = {
        ...data,
        slot_type: slotType,
        capacity: parseInt(data.capacity) || 1,
        max_reservations_per_user: parseInt(data.max_reservations_per_user) || 1,
      };

      if (slotType === 'hourly') {
        payload.slot_duration_minutes = parseInt(data.slot_duration_minutes) || 60;
        delete payload.shifts;
      } else {
        payload.shifts = shifts;
        delete payload.open_time;
        delete payload.close_time;
        delete payload.slot_duration_minutes;
      }

      await client.post('/amenities', payload);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Nombre" error={errors.name?.message}>
        <input
          {...register('name', { required: 'El nombre es requerido' })}
          placeholder="Pileta, SUM, Parrilla..."
          className="input"
        />
      </FormField>

      <FormField label="Descripción (opcional)">
        <textarea
          {...register('description')}
          placeholder="Descripción del amenity..."
          rows={2}
          className="input resize-none"
        />
      </FormField>

      {/* Tipo de turno */}
      <div>
        <label className="text-sm text-textSecondary mb-2 block">Tipo de turno</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setSlotType('hourly')}
            className={`p-3 rounded-xl border text-sm transition-all ${
              slotType === 'hourly'
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-textSecondary hover:border-primary/50'
            }`}
          >
            ⏰ Por hora
          </button>
          <button
            type="button"
            onClick={() => setSlotType('shift')}
            className={`p-3 rounded-xl border text-sm transition-all ${
              slotType === 'shift'
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-textSecondary hover:border-primary/50'
            }`}
          >
            🌅 Por turno
          </button>
        </div>
      </div>

      {/* Configuración por hora */}
      {slotType === 'hourly' && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Apertura" error={errors.open_time?.message}>
              <input
                {...register('open_time', { required: slotType === 'hourly' })}
                type="time"
                className="input"
              />
            </FormField>
            <FormField label="Cierre" error={errors.close_time?.message}>
              <input
                {...register('close_time', { required: slotType === 'hourly' })}
                type="time"
                className="input"
              />
            </FormField>
          </div>
          <FormField label="Duración de cada turno (minutos)">
            <input
              {...register('slot_duration_minutes')}
              type="number"
              min="15"
              defaultValue={60}
              className="input"
            />
          </FormField>
        </>
      )}

      {/* Configuración por turnos */}
      {slotType === 'shift' && (
        <div>
          <label className="text-sm text-textSecondary mb-2 block">Turnos disponibles</label>
          <div className="space-y-2">
            {shifts.map((shift, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={shift.name}
                  onChange={e => updateShift(i, 'name', e.target.value)}
                  placeholder="Mañana"
                  className="input flex-1"
                />
                <input
                  type="time"
                  value={shift.start}
                  onChange={e => updateShift(i, 'start', e.target.value)}
                  className="input w-28"
                />
                <span className="text-textSecondary text-sm">a</span>
                <input
                  type="time"
                  value={shift.end}
                  onChange={e => updateShift(i, 'end', e.target.value)}
                  className="input w-28"
                />
                {shifts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeShift(i)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-danger hover:bg-danger/10 transition-all flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addShift}
              className="text-sm text-primary hover:text-primaryHover transition-colors mt-1"
            >
              + Agregar turno
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Capacidad por turno">
          <input
            {...register('capacity')}
            type="number"
            min="1"
            defaultValue={1}
            className="input"
          />
        </FormField>
        <FormField label="Máx. reservas por usuario">
          <input
            {...register('max_reservations_per_user')}
            type="number"
            min="1"
            defaultValue={1}
            className="input"
          />
        </FormField>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/20 text-danger text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
          {isSubmitting ? <Spinner size="sm" /> : 'Crear amenity'}
        </button>
      </div>
    </form>
  );
}

export function AmenitiesPage() {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { isAdmin, isResident } = useRole();
  const navigate = useNavigate();

  const loadAmenities = useCallback(() => {
    setLoading(true);
    client.get('/amenities')
      .then(res => setAmenities(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadAmenities(); }, [loadAmenities]);

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este amenity?')) return;
    await client.delete(`/amenities/${id}`);
    loadAmenities();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-textPrimary">Amenities</h1>
          <p className="text-textSecondary text-sm mt-1">Espacios comunes del consorcio</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nuevo amenity
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : amenities.length === 0 ? (
        <EmptyState message="No hay amenities configurados" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {amenities.map(amenity => (
            <div key={amenity.id} className="card hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-textPrimary">{amenity.name}</h3>
                  {amenity.description && (
                    <p className="text-sm text-textSecondary mt-1">{amenity.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span className="badge-success">Activo</span>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(amenity.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-textSecondary hover:bg-danger/10 hover:text-danger transition-all ml-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-textSecondary mb-3">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {amenity.open_time} - {amenity.close_time}
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  Cap. {amenity.capacity}
                </div>
              </div>
              <p className="text-xs text-textSecondary mb-4">
                Turnos de {amenity.slot_duration_minutes} minutos
              </p>
              {isResident && (
                <button
                  onClick={() => navigate(`/reservations/${amenity.id}`)}
                  className="btn-primary w-full text-center text-sm"
                >
                  Reservar turno
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nuevo amenity">
        <CreateAmenityForm onSuccess={loadAmenities} onClose={() => setShowModal(false)} />
      </Modal>
    </div>
  );
}