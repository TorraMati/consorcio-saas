import { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, Eye, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import client from '../../../api/client';
import { Spinner } from '../../../components/ui/Spinner';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Modal } from '../../../components/ui/Modal';
import { FormField } from '../../../components/ui/FormField';
import { useRole } from '../../../hooks/useRole';

function CreateNewsForm({ onSuccess, onClose }) {
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setError('');
      await client.post('/news', {
        ...data,
        is_published: data.is_published === 'true',
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Título" error={errors.title?.message}>
        <input
          {...register('title', { required: 'El título es requerido' })}
          type="text"
          placeholder="Reunión de consorcio"
          className="input"
        />
      </FormField>

      <FormField label="Contenido" error={errors.content?.message}>
        <textarea
          {...register('content', { required: 'El contenido es requerido' })}
          placeholder="Escribí el contenido de la noticia..."
          rows={4}
          className="input resize-none"
        />
      </FormField>

      <FormField label="Estado">
        <select {...register('is_published')} className="input">
          <option value="false">Guardar como borrador</option>
          <option value="true">Publicar ahora</option>
        </select>
      </FormField>

      {error && (
        <div className="bg-danger/10 border border-danger/20 text-danger text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
          {isSubmitting ? <Spinner size="sm" /> : 'Crear noticia'}
        </button>
      </div>
    </form>
  );
}

export function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { isAdmin } = useRole();

  const loadNews = useCallback(() => {
    setLoading(true);
    client.get('/news')
      .then(res => setNews(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadNews(); }, [loadNews]);

  const handlePublish = async (id) => {
    await client.patch(`/news/${id}/publish`);
    loadNews();
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta noticia?')) return;
    await client.delete(`/news/${id}`);
    loadNews();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-textPrimary">Noticias</h1>
          <p className="text-textSecondary text-sm mt-1">Novedades del consorcio</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nueva noticia
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : news.length === 0 ? (
        <EmptyState message="No hay noticias publicadas" />
      ) : (
        <div className="space-y-4">
          {news.map(item => (
            <div key={item.id} className="card hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0 mr-4">
                  <h3 className="font-semibold text-textPrimary text-lg">{item.title}</h3>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {item.is_published
                    ? <span className="badge-success">Publicada</span>
                    : <span className="badge-warning">Borrador</span>
                  }
                  {isAdmin && (
                    <div className="flex items-center gap-1 ml-2">
                      {!item.is_published && (
                        <button
                          onClick={() => handlePublish(item.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-textSecondary hover:bg-success/10 hover:text-success transition-all"
                          title="Publicar"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-textSecondary hover:bg-danger/10 hover:text-danger transition-all"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-textSecondary text-sm leading-relaxed mb-4">{item.content}</p>
              <div className="flex items-center gap-2 text-xs text-textSecondary">
                <User className="w-3 h-3" />
                {item.author?.first_name} {item.author?.last_name}
                <span className="mx-1">·</span>
                {new Date(item.created_at).toLocaleDateString('es-AR')}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nueva noticia">
        <CreateNewsForm onSuccess={loadNews} onClose={() => setShowModal(false)} />
      </Modal>
    </div>
  );
}