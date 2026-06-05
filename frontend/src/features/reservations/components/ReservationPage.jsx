import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, CheckCircle } from 'lucide-react';
import client from '../../../api/client';
import { Spinner } from '../../../components/ui/Spinner';
import { Modal } from '../../../components/ui/Modal';

export function ReservationPage() {
  const { amenityId } = useParams();
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);
  const [amenity, setAmenity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(null);
  const [booking, setBooking] = useState(false);
  const [success, setSuccess] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);

  const loadSlots = useCallback(() => {
    setLoading(true);
    client.get(`/reservations/slots/${amenityId}?date=${selectedDate}`)
      .then(res => {
        setAmenity(res.data.amenity);
        setSlots(res.data.slots);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [amenityId, selectedDate]);

  useEffect(() => { loadSlots(); }, [loadSlots]);

  const handleConfirm = async () => {
    if (!confirming) return;
    setBooking(true);
    try {
      await client.post('/reservations', {
        amenity_id: amenityId,
        date: selectedDate,
        start_time: confirming.start_time,
        end_time: confirming.end_time,
      });
      setSuccess(true);
      setConfirming(null);
      loadSlots();
    } catch (err) {
      alert(err.message);
    } finally {
      setBooking(false);
    }
  };

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    return new Date(year, month - 1, day).toLocaleDateString('es-AR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate('/amenities')}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-textSecondary hover:bg-surfaceHover transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-textPrimary">
            {amenity?.name}
          </h1>
          <p className="text-textSecondary text-sm mt-1">
            {amenity?.slot_type === 'hourly'
              ? `Disponible de ${amenity?.open_time} a ${amenity?.close_time}`
              : 'Reserva por turno'}
          </p>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-3 bg-success/10 border border-success/20 text-success px-4 py-3 rounded-xl mb-6">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <p className="text-sm font-medium">¡Reserva realizada con éxito!</p>
        </div>
      )}

      {/* Selector de fecha */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-primary" />
          <label className="text-sm font-medium text-textPrimary">Seleccioná una fecha</label>
        </div>
        <input
          type="date"
          value={selectedDate}
          min={today}
          onChange={e => { setSelectedDate(e.target.value); setSuccess(false); }}
          className="input max-w-xs"
        />
        {selectedDate && (
          <p className="text-xs text-textSecondary mt-2 capitalize">
            {formatDate(selectedDate)}
          </p>
        )}
      </div>

      {/* Slots */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-textPrimary">Turnos disponibles</h2>
        </div>
        {loading ? (
          <div className="flex justify-center py-8"><Spinner size="lg" /></div>
        ) : slots.length === 0 ? (
          <p className="text-textSecondary text-sm">No hay turnos para este día.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {slots.map((slot, i) => (
              <button
                key={i}
                disabled={!slot.available}
                onClick={() => slot.available && setConfirming(slot)}
                className={`flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  !slot.available
                    ? 'bg-surfaceHover text-textSecondary opacity-50 cursor-not-allowed'
                    : 'bg-primary/10 text-primary hover:bg-primary hover:text-white cursor-pointer'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{slot.start_time} - {slot.end_time}</span>
                {!slot.available && <span className="text-xs opacity-70">Ocupado</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmación */}
      <Modal
        isOpen={!!confirming}
        onClose={() => setConfirming(null)}
        title="Confirmar reserva"
      >
        {confirming && (
          <div className="space-y-4">
            <div className="bg-surfaceHover rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-textSecondary">Amenity</span>
                <span className="text-textPrimary font-medium">{amenity?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-textSecondary">Fecha</span>
                <span className="text-textPrimary font-medium capitalize">
                  {formatDate(selectedDate)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-textSecondary">Horario</span>
                <span className="text-textPrimary font-medium">
                  {confirming.start_time} - {confirming.end_time}
                </span>
              </div>
            </div>

            <p className="text-sm text-textSecondary">
              ¿Confirmás la reserva para este turno?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirming(null)}
                className="btn-ghost flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                disabled={booking}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {booking ? <Spinner size="sm" /> : 'Confirmar reserva'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}