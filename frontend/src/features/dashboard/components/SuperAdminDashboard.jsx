import { useEffect, useState } from 'react';
import { Building2, Users, DollarSign, Receipt } from 'lucide-react';
import client from '../../../api/client';
import { Spinner } from '../../../components/ui/Spinner';
import { EmptyState } from '../../../components/ui/EmptyState';

export function SuperAdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/super-admin/dashboard')
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-textPrimary">Panel SuperAdmin</h1>
        <p className="text-textSecondary text-sm mt-1">Control de todos los consorcios</p>
      </div>

      {/* Totales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-textSecondary text-sm">Consorcios activos</p>
            <p className="text-2xl font-semibold text-textPrimary">{data?.total_tenants}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-success rounded-xl flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-textSecondary text-sm">Facturación mensual</p>
            <p className="text-2xl font-semibold text-textPrimary">
              ${parseFloat(data?.total_revenue || 0).toLocaleString('es-AR')}
            </p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center">
            <Receipt className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-textSecondary text-sm">Total recaudado</p>
            <p className="text-2xl font-semibold text-textPrimary">
              ${data?.total_collected.toLocaleString('es-AR')}
            </p>
          </div>
        </div>
      </div>

      {/* Tabla de consorcios */}
      <div className="card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-textPrimary">Detalle por consorcio</h2>
        </div>
        {data?.tenants.length === 0 ? (
          <EmptyState message="No hay consorcios activos" />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs text-textSecondary font-medium px-6 py-4">Consorcio</th>
                <th className="text-left text-xs text-textSecondary font-medium px-6 py-4">Edificios</th>
                <th className="text-left text-xs text-textSecondary font-medium px-6 py-4">Unidades</th>
                <th className="text-left text-xs text-textSecondary font-medium px-6 py-4">Usuarios</th>
                <th className="text-left text-xs text-textSecondary font-medium px-6 py-4">Recaudado</th>
                <th className="text-left text-xs text-textSecondary font-medium px-6 py-4">Plan mensual</th>
              </tr>
            </thead>
            <tbody>
              {data?.tenants.map((tenant, i) => (
                <tr
                  key={tenant.id}
                  className={`border-b border-border last:border-0 hover:bg-surfaceHover transition-colors ${
                    i % 2 === 0 ? '' : 'bg-surface/50'
                  }`}
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-textPrimary">{tenant.name}</p>
                    <p className="text-xs text-textSecondary">{tenant.slug}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-textPrimary">
                    {tenant.buildings}
                    <span className="text-textSecondary"> / {tenant.limits.max_buildings}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-textPrimary">
                    {tenant.units}
                    <span className="text-textSecondary"> / {tenant.limits.max_units}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-textPrimary">{tenant.users}</td>
                  <td className="px-6 py-4 text-sm font-medium text-success">
                    ${parseFloat(tenant.total_collected || 0).toLocaleString('es-AR')}
                  </td>
                  <td className="px-6 py-4 text-sm text-textPrimary">
                    ${parseFloat(tenant.monthly_price || 0).toLocaleString('es-AR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}