'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api';
import Link from 'next/link';

interface Program {
  id: string;
  name: string;
}

interface PoaTemplate {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt: string;
}

interface PoaTemplateActivity {
  id: string;
  name: string;
  description?: string;
  meta?: number;
  unit?: string;
  programId: string;
  program?: Program;
}

interface ApiResponse {
  data: PoaTemplate[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export default function PoaTemplatesPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [templates, setTemplates] = useState<PoaTemplate[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [activities, setActivities] = useState<PoaTemplateActivity[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
  });
  const [newActivity, setNewActivity] = useState({
    name: '',
    description: '',
    meta: '',
    unit: '',
    programId: '',
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    fetchTemplates();
    fetchPrograms();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/poa-templates?limit=100');
      const data = response as ApiResponse;
      setTemplates(data.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar plantillas');
    } finally {
      setLoading(false);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await apiClient.get('/programs/active/list');
      setPrograms(response || []);
    } catch (err) {
      console.error('Error fetching programs:', err);
      setPrograms([]);
    }
  };

  const fetchActivities = async (templateId: string) => {
    try {
      const response = await apiClient.get(`/poa-templates/${templateId}/activities`);
      setActivities(response || []);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setActivities([]);
    }
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/poa-templates', newTemplate);
      setNewTemplate({ name: '', description: '' });
      setShowCreateForm(false);
      await fetchTemplates();
      alert('Plantilla creada exitosamente');
    } catch (err: any) {
      alert('Error al crear plantilla: ' + (err.message || 'Error desconocido'));
    }
  };

  const handleSelectTemplate = async (templateId: string) => {
    setSelectedTemplateId(templateId);
    await fetchActivities(templateId);
  };

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplateId) return;

    try {
      await apiClient.post(`/poa-templates/${selectedTemplateId}/activities`, {
        name: newActivity.name,
        description: newActivity.description,
        meta: newActivity.meta ? Number(newActivity.meta) : undefined,
        unit: newActivity.unit || undefined,
        programId: newActivity.programId,
      });
      setNewActivity({ name: '', description: '', meta: '', unit: '', programId: '' });
      await fetchActivities(selectedTemplateId);
      alert('Actividad agregada');
    } catch (err: any) {
      alert('Error al agregar actividad: ' + (err.message || 'Error desconocido'));
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    if (!selectedTemplateId) return;
    if (!confirm('¿Eliminar esta actividad de la plantilla?')) return;

    try {
      await apiClient.delete(`/poa-templates/${selectedTemplateId}/activities/${activityId}`);
      await fetchActivities(selectedTemplateId);
    } catch (err: any) {
      alert('Error al eliminar actividad: ' + (err.message || 'Error desconocido'));
    }
  };

  if (authLoading || (isAuthenticated && loading)) {
    return <div className="p-8 text-center">Cargando...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Plantillas POA</h1>
        <p className="text-gray-600">Crea plantillas y organiza actividades por programa</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {(user?.role === 'ADMIN' || user?.role === 'SUPERVISOR_POA') && (
        <div className="mb-6">
          {!showCreateForm ? (
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              + Crear Plantilla
            </button>
          ) : (
            <form
              onSubmit={handleCreateTemplate}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
            >
              <h2 className="text-xl font-bold mb-4">Nueva Plantilla</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Nombre de plantilla"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  required
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
                />
                <input
                  type="text"
                  placeholder="Descripción (opcional)"
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Guardar
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
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-4 py-3 bg-gray-100 border-b">
              <h2 className="text-lg font-semibold">Plantillas</h2>
            </div>
            <ul className="divide-y">
              {templates.map((template) => (
                <li key={template.id}>
                  <button
                    onClick={() => handleSelectTemplate(template.id)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 ${
                      selectedTemplateId === template.id ? 'bg-primary-50' : ''
                    }`}
                  >
                    <p className="font-medium text-gray-900">{template.name}</p>
                    <p className="text-sm text-gray-600">{template.description || 'Sin descripción'}</p>
                  </button>
                </li>
              ))}
            </ul>

            {templates.length === 0 && (
              <div className="p-6 text-center text-gray-500">No hay plantillas</div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-4 py-3 bg-gray-100 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">Actividades de plantilla</h2>
            </div>

            {!selectedTemplateId ? (
              <div className="p-6 text-center text-gray-500">
                Selecciona una plantilla para ver sus actividades
              </div>
            ) : (
              <div className="p-4">
                {(user?.role === 'ADMIN' || user?.role === 'SUPERVISOR_POA') && (
                  <form
                    onSubmit={handleCreateActivity}
                    className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200"
                  >
                    <h3 className="font-semibold mb-3">Agregar actividad</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Nombre de actividad"
                        value={newActivity.name}
                        onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                        required
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
                      />
                      <select
                        value={newActivity.programId}
                        onChange={(e) => setNewActivity({ ...newActivity, programId: e.target.value })}
                        required
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
                      >
                        <option value="">Selecciona programa</option>
                        {programs.map((program) => (
                          <option key={program.id} value={program.id}>
                            {program.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        placeholder="Meta (opcional)"
                        value={newActivity.meta}
                        onChange={(e) => setNewActivity({ ...newActivity, meta: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
                      />
                      <input
                        type="text"
                        placeholder="Unidad (opcional)"
                        value={newActivity.unit}
                        onChange={(e) => setNewActivity({ ...newActivity, unit: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
                      />
                      <input
                        type="text"
                        placeholder="Descripción (opcional)"
                        value={newActivity.description}
                        onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                        className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
                      />
                    </div>
                    <div className="mt-3">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Agregar
                      </button>
                    </div>
                  </form>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-semibold">Actividad</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold">Programa</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold">Meta</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold">Unidad</th>
                        <th className="px-4 py-2 text-right text-sm font-semibold">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activities.map((activity) => (
                        <tr key={activity.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm">
                            <p className="font-medium text-gray-900">{activity.name}</p>
                            {activity.description && (
                              <p className="text-xs text-gray-500">{activity.description}</p>
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            {activity.program?.name || '-'}
                          </td>
                          <td className="px-4 py-2 text-sm">{activity.meta ?? '-'}</td>
                          <td className="px-4 py-2 text-sm">{activity.unit || '-'}</td>
                          <td className="px-4 py-2 text-right text-sm">
                            {(user?.role === 'ADMIN' || user?.role === 'SUPERVISOR_POA') && (
                              <button
                                onClick={() => handleDeleteActivity(activity.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                Eliminar
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {activities.length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                      Esta plantilla no tiene actividades
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link href="/agreements" className="text-primary-600 hover:underline">
          ← Volver a Convenios
        </Link>
      </div>
    </div>
  );
}
