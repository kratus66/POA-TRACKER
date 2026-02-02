'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';

interface Activity {
  id: string;
  description: string;
  program: string;
  quantitativeValue: number | null;
  quantitativeUnit: string | null;
  status: string;
  createdAt: string;
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('No autenticado');
        return;
      }

      const response = await fetch('http://localhost:4000/poa-activities', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar actividades');
      }

      const data = await response.json();
      setActivities(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = activities.filter(activity =>
    activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.program.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Actividades</h1>
          <p className="mt-1 text-sm text-gray-600">Todas las actividades operativas del sistema</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-lg shadow p-4">
          <input
            type="text"
            placeholder="Buscar por descripción o programa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Actividades</dt>
            <dd className="text-3xl font-bold text-gray-900 mt-2">{activities.length}</dd>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Con Meta Cuantitativa</dt>
            <dd className="text-3xl font-bold text-gray-900 mt-2">
              {activities.filter(a => a.quantitativeValue).length}
            </dd>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Activas</dt>
            <dd className="text-3xl font-bold text-gray-900 mt-2">
              {activities.filter(a => a.status === 'ACTIVE').length}
            </dd>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredActivities.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No hay actividades registradas</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Descripción</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Programa</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Meta</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Unidad</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Creada</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredActivities.map((activity) => (
                    <tr key={activity.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{activity.description}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{activity.program}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{activity.quantitativeValue || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{activity.quantitativeUnit || '-'}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          {activity.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(activity.createdAt).toLocaleDateString('es-ES')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
