import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Building2, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import client from '../../../api/client';
import { Spinner } from '../../../components/ui/Spinner';

export function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      setError('');
      const res = await client.post('/auth/login', data);
      setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-textPrimary">Consorcio SaaS</span>
        </div>

        {/* Card */}
        <div className="card">
          <h1 className="text-xl font-semibold text-textPrimary mb-1">Bienvenido</h1>
          <p className="text-sm text-textSecondary mb-6">Ingresá con tu cuenta</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm text-textSecondary mb-1.5 block">Email</label>
              <input
                {...register('email', { required: true })}
                type="email"
                placeholder="admin@consorcio.com"
                className="input"
              />
            </div>

            <div>
              <label className="text-sm text-textSecondary mb-1.5 block">Contraseña</label>
              <div className="relative">
                <input
                  {...register('password', { required: true })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary hover:text-textPrimary"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-danger/10 border border-danger/20 text-danger text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {isSubmitting ? <Spinner size="sm" /> : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}