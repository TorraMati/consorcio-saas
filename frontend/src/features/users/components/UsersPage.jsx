import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import client from '../../../api/client';
import { Spinner } from '../../../components/ui/Spinner';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Modal } from '../../../components/ui/Modal';
import { FormField } from '../../../components/ui/FormField';
import { Badge } from '../../../components/ui/Badge';

function UserForm({ user, onSuccess, onClose }) {
  const isEditing = !!user;
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      role: user?.role || '',
    }
  });

  const onSubmit = async (data) => {
    try {
      setError('');
      if (isEditing) {
        const payload = { ...data };
        if (!payload.password) delete payload.password;
        await client.put(`/users/${user.id}`, payload);
      } else {
        await client.post('/users', data);
      }
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
      <FormField label="Email" error={errors.email?.message}>
        <input {...register('email', { required: 'Requerido' })} type="email" placeholder="juan@email.com" className="input" />
      </FormField>
      <FormField label={isEditing ? 'Nueva contraseña (opcional)' : 'Contraseña'} error={errors.password?.message}>
        <input
          {...register('password', {
            required: isEditing ? false : 'Requerido',
            minLength: { value: 8, message: 'Mínimo 8 caracteres' }
          })}
          type="password"
          placeholder="••••••••"
          className="input"
        />
      </FormField>
      <FormField label="Teléfono (opcional)">
        <input {...register('phone')} placeholder="+54 11 1234-5678" className="input" />
      </FormField>
      <FormField label="Rol" error={errors.role?.message}>
        <select {...register('role', { required: 'Requerido' })} className="input">
          <option value="">Seleccioná un rol</option>
          <option value="owner">Propietario</option>
          <option value="tenant">Inquilino</option>
        </select>
      </FormField>
      {error && <div className="bg-danger/10 border border-danger/20 text-danger text-sm px-4 py-3 rounded-xl">{error}</div>}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
          {isSubmitting ? <Spinner size="sm" /> : isEditing ? 'Guardar cambios' : 'Crear usuario'}
        </button>
      </div>
    </form>
  );
}

export function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadUsers = useCallback(() => {
    setLoading(true);
    client.get('/users')
      .then(res => setUsers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este usuario?')) return;
    setDeletingId(id);
    try {
      await client.delete(`/users/${id}`);
      loadUsers();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const roleLabel = { admin: 'Administrador', owner: 'Propietario', tenant: 'Inquilino' };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-textPrimary">Usuarios</h1>
          <p className="text-textSecondary text-sm mt-1">Propietarios e inquilinos del consorcio</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo usuario
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : users.length === 0 ? (
          <EmptyState message="No hay usuarios registrados" />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs text-textSecondary font-medium px-6 py-4">Usuario</th>
                <th className="text-left text-xs text-textSecondary font-medium px-6 py-4">Email</th>
                <th className="text-left text-xs text-textSecondary font-medium px-6 py-4">Teléfono</th>
                <th className="text-left text-xs text-textSecondary font-medium px-6 py-4">Rol</th>
                <th className="text-left text-xs text-textSecondary font-medium px-6 py-4">Estado</th>
                <th className="text-left text-xs text-textSecondary font-medium px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr
                  key={user.id}
                  className={`border-b border-border last:border-0 hover:bg-surfaceHover transition-colors ${
                    i % 2 === 0 ? '' : 'bg-surface/50'
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs font-bold">
                        {user.first_name?.[0]}{user.last_name?.[0]}
                      </div>
                      <span className="text-sm font-medium text-textPrimary">
                        {user.first_name} {user.last_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-textSecondary">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-textSecondary">{user.phone || '—'}</td>
                  <td className="px-6 py-4 text-sm text-textSecondary">{roleLabel[user.role] || user.role}</td>
                  <td className="px-6 py-4">
                    <Badge status={user.is_active ? 'active' : 'cancelled'} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-textSecondary hover:bg-surfaceHover hover:text-textPrimary transition-all"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={deletingId === user.id}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-textSecondary hover:bg-danger/10 hover:text-danger transition-all"
                      >
                        {deletingId === user.id ? <Spinner size="sm" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={showModal} onClose={handleClose} title="Nuevo usuario">
        <UserForm onSuccess={loadUsers} onClose={handleClose} />
      </Modal>

      <Modal isOpen={!!editingUser} onClose={handleClose} title="Editar usuario">
        {editingUser && (
          <UserForm user={editingUser} onSuccess={loadUsers} onClose={handleClose} />
        )}
      </Modal>
    </div>
  );
}