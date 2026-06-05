import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <p className="text-8xl font-bold text-border mb-4">404</p>
        <h1 className="text-2xl font-semibold text-textPrimary mb-2">Página no encontrada</h1>
        <p className="text-textSecondary mb-8">La página que buscás no existe.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-primary flex items-center gap-2 mx-auto"
        >
          <Home className="w-4 h-4" />
          Volver al inicio
        </button>
      </div>
    </div>
  );
}