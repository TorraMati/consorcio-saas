import { useEffect, useState, useCallback } from 'react';
import { Calendar, Clock, XCircle } from 'lucide-react';
import client from '../../../api/client';
import { Spinner } from '../../../components/ui/Spinner';
import { Badge } from '../../../components/ui/Badge';
import { EmptyState } from '../../../components/ui/EmptyState';

export function MyReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  const loadReservations = useCallback(() => {
    setLoading(true);
    client.get('/reservations/mine')
      .then(res => setReservations(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadReservations(); }, [loadReservations]);

  const handleCancel = async (id) => {
    if (!confirm('¿Cancelar esta reserva?')) return;
    setCancelling(id);
    try {
      await client.patch(`/reservations/${id}/cancel`);
      loadReservations();
    } catch (err) {
      alert(err.message);
    } finally {
      setCancelling(null);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  const upcoming = reservations.filter(r => r.date >= today && r.status === 'active');
  const past = reservations.filter(r => r.date < today || r.status === 'cancelled');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-textPrimary">Mis Turnos</h1>
        <p className="text-textSecondary text-sm mt-1">Tus reservas de amenities</p>
      </div>

      {/* Próximos */}
      <div className="mb-8">
        <h2 className="font-medium text-textPrimary mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          Próximos turnos
        </h2>
        {loading ? (
          <div className="flex justify-center py-8"><Spinner size="lg" /></div>
        ) : upcoming.length === 0 ? (
          <EmptyState message="No tenés turnos próximos" />
        ) : (
          <div className="space-y-3">
            {upcoming.map(r => (
              <div key={r.id} className="card flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-textPrimary">{r.Amenity?.name}</p>
                    <p className="text-sm text-textSecondary">
                      {new Date(r.date + 'T00:00:00').toLocaleDateString('es-AR', {
                        weekday: 'long', day: 'numeric', month: 'long'
                      })}
                      {' · '}{r.start_time} - {r.end_time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge status={r.status} />
                  <button
                    onClick={() => handleCancel(r.id)}
                    disabled={cancelling === r.id}
                    className="flex items-center gap-1.5 text-xs bg-danger/10 text-danger hover:bg-danger/20 px-3 py-1.5 rounded-lg transition-all"
                  >
                    {cancelling === r.id
                      ? <Spinner size="sm" />
                      : <><XCircle className="w-3.5 h-3.5" /> Cancelar</>
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historial */}
      {past.length > 0 && (
        <div>
          <h2 className="font-medium text-textPrimary mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-textSecondary" />
            Historial
          </h2>
          <div className="space-y-2">
            {past.map(r => (
              <div key={r.id} className="card flex items-center justify-between opacity-60">
                <div>
                  <p className="text-sm font-medium text-textPrimary">{r.Amenity?.name}</p>
                  <p className="text-xs text-textSecondary">
                    {new Date(r.date + 'T00:00:00').toLocaleDateString('es-AR')}
                    {' · '}{r.start_time} - {r.end_time}
                  </p>
                </div>
                <Badge status={r.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}