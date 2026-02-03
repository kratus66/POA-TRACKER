"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api';
import Layout from '@/components/Layout';

interface Program {
  id: string;
  name: string;
}

interface PoaTheme {
  id: string;
  title: string;
  description?: string;
  sheetKey: string;
}

interface PoaPeriod {
  id: string;
  year: number;
  agreement?: {
    agreementNumber?: string;
    municipality?: { name: string };
  };
}

interface AgreementActivity {
  id: string;
  name: string;
  description?: string;
  meta?: number;
  unit?: string;
  status: string;
  progress: number;
  program?: Program;
  theme?: PoaTheme;
  createdAt: string;
}

interface ApiPoaPeriodsResponse {
  data: PoaPeriod[];
}

interface ApiProgramsResponse {
  data: Program[];
}

export default function ActivitiesPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  const [activities, setActivities] = useState<AgreementActivity[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [poaPeriods, setPoaPeriods] = useState<PoaPeriod[]>([]);
  const [selectedPoaPeriodId, setSelectedPoaPeriodId] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [groupByTheme, setGroupByTheme] = useState(true); // Nueva opción para agrupar
  const [newActivity, setNewActivity] = useState({
    poaPeriodId: '',
    programId: '',
    name: '',
    description: '',
    meta: '',
    unit: '',
  });

  const canCreate = user?.role === 'ADMIN' || user?.role === 'COORDINATOR';

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchPrograms();
      fetchPoaPeriods();
    }
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    if (selectedPoaPeriodId) {
      fetchActivities(selectedPoaPeriodId);
    } else {
      setActivities([]);
    }
  }, [selectedPoaPeriodId]);

  const fetchPrograms = async () => {
    try {
      const response = await apiClient.get('/programs?limit=1000');
      const data = response as ApiProgramsResponse;
      setPrograms(data?.data || []);
    } catch (err) {
      console.error('Error fetching programs:', err);
      setPrograms([]);
    }
  };

  const fetchPoaPeriods = async () => {
    try {
      const response = await apiClient.get('/poa-periods?limit=1000');
      const data = response as ApiPoaPeriodsResponse;
      setPoaPeriods(data?.data || []);
    } catch (err) {
      console.error('Error fetching POA periods:', err);
      setPoaPeriods([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async (poaPeriodId: string) => {
    try {
      setLoadingActivities(true);
      const response = await apiClient.get(
        `/agreement-activities/period/${poaPeriodId}`
      );
      setActivities(response || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar actividades');
      setActivities([]);
    } finally {
      setLoadingActivities(false);
    }
  };

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newActivity.poaPeriodId || !newActivity.programId || !newActivity.name) {
      alert('Completa vigencia, programa y nombre de la actividad');
      return;
    }

    try {
      await apiClient.post('/agreement-activities', {
        poaPeriodId: newActivity.poaPeriodId,
        programId: newActivity.programId,
        name: newActivity.name,
        description: newActivity.description || undefined,
        meta: newActivity.meta ? Number(newActivity.meta) : undefined,
        unit: newActivity.unit || undefined,
      });

      setNewActivity({
        poaPeriodId: newActivity.poaPeriodId,
        programId: '',
        name: '',
        description: '',
        meta: '',
        unit: '',
      });

      if (newActivity.poaPeriodId) {
        setSelectedPoaPeriodId(newActivity.poaPeriodId);
        await fetchActivities(newActivity.poaPeriodId);
      }

      alert('Actividad creada exitosamente');
    } catch (err: any) {
      alert('Error al crear actividad: ' + (err.message || 'Error desconocido'));
    }
  };

  const filteredActivities = activities.filter((activity) =>
    `${activity.name} ${activity.description || ''} ${activity.program?.name || ''} ${activity.theme?.title || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Agrupar actividades por tema
  const activitiesByTheme: { [key: string]: AgreementActivity[] } = {};
  const activitiesWithoutTheme: AgreementActivity[] = [];

  filteredActivities.forEach((activity) => {
    if (activity.theme) {
      const themeTitle = activity.theme.title;
      if (!activitiesByTheme[themeTitle]) {
        activitiesByTheme[themeTitle] = [];
      }
      activitiesByTheme[themeTitle].push(activity);
    } else {
      activitiesWithoutTheme.push(activity);
    }
  });

  const themeNames = Object.keys(activitiesByTheme).sort();

  if (authLoading || (isAuthenticated && loading)) {
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
          <p className="mt-1 text-sm text-gray-600">
            Gestiona las actividades del POA por vigencia
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Selector de Vigencia */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vigencia POA
            </label>
            <select
              value={selectedPoaPeriodId}
              onChange={(e) => setSelectedPoaPeriodId(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">Selecciona una vigencia...</option>
              {poaPeriods.map((poa) => (
                <option key={poa.id} value={poa.id}>
                  {poa.agreement?.agreementNumber
                    ? `Convenio ${poa.agreement.agreementNumber} - POA ${poa.year}`
                    : `POA ${poa.year}`}
                  {poa.agreement?.municipality?.name
                    ? ` (${poa.agreement.municipality.name})`
                    : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <input
              type="text"
              placeholder="Buscar por nombre, descripción, programa o tema..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          <div className="md:pt-7 flex gap-2">
            <button
              onClick={() => setGroupByTheme(!groupByTheme)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              title={groupByTheme ? 'Ver lista completa' : 'Agrupar por tema'}
            >
              {groupByTheme ? '📋 Lista' : '🗂️ Por Tema'}
            </button>
            {canCreate && (
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                {showCreateForm ? 'Cancelar' : '+ Nueva Actividad'}
              </button>
            )}
          </div>
        </div>

        {showCreateForm && canCreate && (
          <form
            onSubmit={handleCreateActivity}
            className="bg-white rounded-lg shadow p-6 border border-gray-200"
          >
            <h2 className="text-xl font-bold mb-4">Crear Actividad del POA</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vigencia POA
                </label>
                <select
                  value={newActivity.poaPeriodId}
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, poaPeriodId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Selecciona una vigencia...</option>
                  {poaPeriods.map((poa) => (
                    <option key={poa.id} value={poa.id}>
                      {poa.agreement?.agreementNumber
                        ? `Convenio ${poa.agreement.agreementNumber} - POA ${poa.year}`
                        : `POA ${poa.year}`}
                      {poa.agreement?.municipality?.name
                        ? ` (${poa.agreement.municipality.name})`
                        : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Programa
                </label>
                <select
                  value={newActivity.programId}
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, programId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Selecciona un programa...</option>
                  {programs.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la actividad
                </label>
                <input
                  type="text"
                  value={newActivity.name}
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={newActivity.description}
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta (opcional)
                </label>
                <input
                  type="number"
                  value={newActivity.meta}
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, meta: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unidad (opcional)
                </label>
                <input
                  type="text"
                  value={newActivity.unit}
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, unit: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Guardar Actividad
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-6 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Actividades</dt>
            <dd className="text-3xl font-bold text-gray-900 mt-2">{activities.length}</dd>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Con Meta Cuantitativa</dt>
            <dd className="text-3xl font-bold text-gray-900 mt-2">
              {activities.filter(a => a.meta).length}
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
          {loadingActivities ? (
            <div className="p-6 text-center text-gray-500">Cargando actividades...</div>
          ) : !selectedPoaPeriodId ? (
            <div className="p-6 text-center text-gray-500">Selecciona una vigencia para ver actividades</div>
          ) : filteredActivities.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No hay actividades registradas</p>
            </div>
          ) : groupByTheme ? (
            // Vista agrupada por tema
            <div className="divide-y divide-gray-200">
              {themeNames.map((themeName) => (
                <div key={themeName} className="p-6">
                  <h3 className="text-lg font-bold text-primary-700 mb-4 flex items-center">
                    <span className="inline-block w-1 h-6 bg-primary-500 mr-3"></span>
                    {themeName}
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({activitiesByTheme[themeName].length} actividades)
                    </span>
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Actividad</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Programa</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Meta</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Unidad</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {activitiesByTheme[themeName].map((activity) => (
                          <tr key={activity.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">
                              <div className="font-medium">{activity.name}</div>
                              {activity.description && (
                                <div className="text-xs text-gray-500 mt-1">{activity.description}</div>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{activity.program?.name || '-'}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{activity.meta ?? 'N/A'}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{activity.unit || '-'}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                                {activity.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
              {activitiesWithoutTheme.length > 0 && (
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center">
                    <span className="inline-block w-1 h-6 bg-gray-400 mr-3"></span>
                    Sin tema asignado
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({activitiesWithoutTheme.length} actividades)
                    </span>
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Actividad</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Programa</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Meta</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Unidad</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {activitiesWithoutTheme.map((activity) => (
                          <tr key={activity.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">
                              <div className="font-medium">{activity.name}</div>
                              {activity.description && (
                                <div className="text-xs text-gray-500 mt-1">{activity.description}</div>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{activity.program?.name || '-'}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{activity.meta ?? 'N/A'}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{activity.unit || '-'}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                                {activity.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Vista lista completa
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actividad</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tema</th>
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
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="font-medium">{activity.name}</div>
                        {activity.description && (
                          <div className="text-xs text-gray-500">{activity.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {activity.theme ? (
                          <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded text-xs">
                            {activity.theme.title}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{activity.program?.name || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{activity.meta ?? 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{activity.unit || '-'}</td>
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
