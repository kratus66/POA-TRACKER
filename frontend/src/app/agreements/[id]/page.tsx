'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api';
import Link from 'next/link';

interface Municipality {
  id: string;
  code: string;
  name: string;
  department: string;
}

interface Agreement {
  id: string;
  agreementNumber: string;
  startDate: string;
  endDate: string;
  status: string;
  municipality: Municipality;
  description?: string;
  createdAt: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface Program {
  id: string;
  name: string;
}

interface PoaTemplate {
  id: string;
  name: string;
  description?: string;
}

interface AgreementActivity {
  id: string;
  name: string;
  description?: string;
  meta?: number;
  unit?: string;
  progress: number;
  status: string;
  program?: Program;
}

interface PoaPeriod {
  id: string;
  year: number;
  status: string;
  supervisorId?: string;
  supervisor?: User;
  notes?: string;
  createdAt: string;
}

interface ApiPoaPeriodResponse {
  id: string;
  year: number;
  status: string;
  agreementId: string;
  supervisorId?: string;
  supervisor?: User;
  notes?: string;
}

export default function AgreementDetail() {
  const router = useRouter();
  const params = useParams();
  const agreementId = params.id as string;
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [poaPeriods, setPoaPeriods] = useState<PoaPeriod[]>([]);
  const [supervisors, setSupervisors] = useState<User[]>([]);
  const [templates, setTemplates] = useState<PoaTemplate[]>([]);
  const [activities, setActivities] = useState<AgreementActivity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [activityEdits, setActivityEdits] = useState<
    Record<string, { progress: number; status: string }>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreatePoa, setShowCreatePoa] = useState(false);
  const [newPoaYear, setNewPoaYear] = useState(new Date().getFullYear());
  const [selectedPoaId, setSelectedPoaId] = useState<string | null>(null);
  const [selectedSupervisorId, setSelectedSupervisorId] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [selectedPoaForApply, setSelectedPoaForApply] = useState('');
  const [selectedPoaForActivities, setSelectedPoaForActivities] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (agreementId) {
      fetchAgreement();
      fetchPoaPeriods();
      fetchSupervisors();
      fetchTemplates();
    }
  }, [agreementId]);

  useEffect(() => {
    if (selectedPoaForActivities) {
      fetchActivities(selectedPoaForActivities);
    }
  }, [selectedPoaForActivities]);

  const fetchAgreement = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/agreements/${agreementId}`);
      setAgreement(response);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar convenio');
    } finally {
      setLoading(false);
    }
  };

  const fetchPoaPeriods = async () => {
    try {
      const response = await apiClient.get(
        `/poa-periods/agreement/${agreementId}`
      );
      setPoaPeriods(response || []);
    } catch (err) {
      console.error('Error fetching POA periods:', err);
      setPoaPeriods([]);
    }
  };

  const fetchSupervisors = async () => {
    try {
      const response = await apiClient.get('/admin/users');
      const data = response as any;
      // Filtrar solo supervisores
      const supervisorUsers = (data.data || data).filter(
        (u: User) => u.role === 'SUPERVISOR_POA'
      );
      setSupervisors(supervisorUsers);
    } catch (err) {
      console.error('Error fetching supervisors:', err);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await apiClient.get('/poa-templates/active/list');
      setTemplates(response || []);
    } catch (err) {
      console.error('Error fetching templates:', err);
      setTemplates([]);
    }
  };

  const fetchActivities = async (poaPeriodId: string) => {
    try {
      setLoadingActivities(true);
      const response = await apiClient.get(
        `/agreement-activities/period/${poaPeriodId}`
      );
      const data = response || [];
      setActivities(data);
      const edits = data.reduce(
        (acc: Record<string, { progress: number; status: string }>, item: AgreementActivity) => {
          acc[item.id] = {
            progress: item.progress ?? 0,
            status: item.status || 'PENDING',
          };
          return acc;
        },
        {}
      );
      setActivityEdits(edits);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setActivities([]);
    } finally {
      setLoadingActivities(false);
    }
  };

  const handleCreatePoaPeriod = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/poa-periods', {
        year: newPoaYear,
        agreementId,
      });
      setNewPoaYear(new Date().getFullYear());
      setShowCreatePoa(false);
      await fetchPoaPeriods();
      alert('Vigencia POA creada exitosamente');
    } catch (err: any) {
      alert(
        'Error al crear vigencia POA: ' +
          (err.message || 'Error desconocido')
      );
    }
  };

  const handleAssignSupervisor = async () => {
    if (!selectedPoaId || !selectedSupervisorId) {
      alert('Selecciona una vigencia y un supervisor');
      return;
    }

    try {
      await apiClient.patch(`/poa-periods/${selectedPoaId}/assign-supervisor`, {
        supervisorId: selectedSupervisorId,
      });
      setSelectedPoaId(null);
      setSelectedSupervisorId('');
      await fetchPoaPeriods();
      alert('Supervisor asignado exitosamente');
    } catch (err: any) {
      alert(
        'Error al asignar supervisor: ' +
          (err.message || 'Error desconocido')
      );
    }
  };

  const handleApplyTemplate = async () => {
    if (!selectedTemplateId || !selectedPoaForApply) {
      alert('Selecciona plantilla y vigencia');
      return;
    }

    const poa = poaPeriods.find((p) => p.id === selectedPoaForApply);
    if (!poa) {
      alert('Vigencia no encontrada');
      return;
    }

    try {
      await apiClient.post(
        `/agreements/${agreementId}/apply-template/${selectedTemplateId}?year=${poa.year}`,
        {}
      );
      await fetchPoaPeriods();
      await fetchActivities(poa.id);
      setSelectedPoaForActivities(poa.id);
      alert('Plantilla aplicada exitosamente');
    } catch (err: any) {
      alert(
        'Error al aplicar plantilla: ' + (err.message || 'Error desconocido')
      );
    }
  };

  const handleActivityEdit = (
    id: string,
    field: 'progress' | 'status',
    value: string | number
  ) => {
    setActivityEdits((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSaveActivity = async (id: string) => {
    const edit = activityEdits[id];
    if (!edit) return;

    try {
      await apiClient.patch(`/agreement-activities/${id}`, {
        progress: Number(edit.progress),
        status: edit.status,
      });
      if (selectedPoaForActivities) {
        await fetchActivities(selectedPoaForActivities);
      }
      alert('Actividad actualizada');
    } catch (err: any) {
      alert('Error al actualizar actividad: ' + (err.message || 'Error desconocido'));
    }
  };

  if (authLoading || loading) {
    return <div className="p-8 text-center">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <div className="p-8 text-center">No autorizado</div>;
  }

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!agreement) {
    return (
      <div className="p-8 text-center">Convenio no encontrado</div>
    );
  }

  const startYear = new Date(agreement.startDate).getFullYear();
  const endYear = new Date(agreement.endDate).getFullYear();
  const canEditActivities =
    user?.role === 'ADMIN' ||
    user?.role === 'SUPERVISOR_POA' ||
    user?.role === 'COORDINATOR';
  const groupedActivities = activities.reduce<Record<string, AgreementActivity[]>>(
    (acc, activity) => {
      const key = activity.program?.name || 'Sin programa';
      acc[key] = acc[key] || [];
      acc[key].push(activity);
      return acc;
    },
    {}
  );

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Link href="/agreements" className="mb-4 text-primary-600 hover:underline">
        ← Volver a Convenios
      </Link>

      {/* Detalles del Convenio */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {agreement.agreementNumber}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Municipio</p>
            <p className="text-lg font-medium">{agreement.municipality.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Departamento</p>
            <p className="text-lg font-medium">{agreement.municipality.department}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Vigencia</p>
            <p className="text-lg font-medium">
              {startYear} - {endYear}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Estado</p>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                agreement.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-800'
                  : agreement.status === 'INACTIVE'
                  ? 'bg-gray-100 text-gray-800'
                  : agreement.status === 'SUSPENDED'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {agreement.status}
            </span>
          </div>
        </div>

        {agreement.description && (
          <div className="mt-4">
            <p className="text-sm text-gray-600">Descripción</p>
            <p className="text-gray-900">{agreement.description}</p>
          </div>
        )}
      </div>

      {/* Vigencias POA */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Vigencias POA</h2>
          {(user?.role === 'ADMIN' || user?.role === 'COORDINATOR') && (
            <button
              onClick={() => setShowCreatePoa(!showCreatePoa)}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              {showCreatePoa ? 'Cancelar' : '+ Crear Vigencia'}
            </button>
          )}
        </div>

        {showCreatePoa && (
          <form
            onSubmit={handleCreatePoaPeriod}
            className="mb-6 bg-white p-4 rounded-lg shadow-md border border-gray-200"
          >
            <div className="flex gap-4 items-end">
              <div>
                <label className="block text-sm font-medium mb-1">Año</label>
                <input
                  type="number"
                  value={newPoaYear}
                  onChange={(e) => setNewPoaYear(parseInt(e.target.value))}
                  required
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Crear
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Asignar Supervisor */}
        {(user?.role === 'ADMIN' || user?.role === 'COORDINATOR') && (
          <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-bold mb-3">Asignar Supervisor</h3>
            <div className="flex gap-2">
              <select
                value={selectedPoaId || ''}
                onChange={(e) => setSelectedPoaId(e.target.value || null)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecciona vigencia...</option>
                {poaPeriods.map((poa) => (
                  <option key={poa.id} value={poa.id}>
                    POA {poa.year} {poa.supervisor ? '✓ ' + poa.supervisor.firstName : ''}
                  </option>
                ))}
              </select>
              <select
                value={selectedSupervisorId}
                onChange={(e) => setSelectedSupervisorId(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecciona supervisor...</option>
                {supervisors.map((sup) => (
                  <option key={sup.id} value={sup.id}>
                    {sup.firstName} {sup.lastName}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAssignSupervisor}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Asignar
              </button>
            </div>
          </div>
        )}

        {/* Lista de Vigencias */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Año
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Supervisor
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Notas
                </th>
              </tr>
            </thead>
            <tbody>
              {poaPeriods.map((poa) => (
                <tr key={poa.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm font-medium">{poa.year}</td>
                  <td className="px-6 py-3 text-sm">
                    {poa.supervisor ? (
                      <div>
                        <p className="font-medium">
                          {poa.supervisor.firstName} {poa.supervisor.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{poa.supervisor.email}</p>
                      </div>
                    ) : (
                      <span className="text-gray-500 italic">No asignado</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        poa.status === 'DRAFT'
                          ? 'bg-gray-100 text-gray-800'
                          : poa.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-800'
                          : poa.status === 'SUBMITTED'
                          ? 'bg-yellow-100 text-yellow-800'
                          : poa.status === 'APPROVED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {poa.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {poa.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {poaPeriods.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No hay vigencias POA creadas
            </div>
          )}
        </div>
      </div>

      {/* Aplicar Plantilla */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Aplicar Plantilla POA</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">Vigencia</label>
            <select
              value={selectedPoaForApply}
              onChange={(e) => setSelectedPoaForApply(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Selecciona vigencia...</option>
              {poaPeriods.map((poa) => (
                <option key={poa.id} value={poa.id}>
                  POA {poa.year}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Plantilla</label>
            <select
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Selecciona plantilla...</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button
              onClick={handleApplyTemplate}
              className="w-full px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Aplicar Plantilla
            </button>
          </div>
        </div>
      </div>

      {/* Actividades del POA */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Actividades del POA</h2>
          <select
            value={selectedPoaForActivities}
            onChange={(e) => setSelectedPoaForActivities(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Selecciona vigencia...</option>
            {poaPeriods.map((poa) => (
              <option key={poa.id} value={poa.id}>
                POA {poa.year}
              </option>
            ))}
          </select>
        </div>

        {loadingActivities ? (
          <div className="p-6 text-center text-gray-500">Cargando actividades...</div>
        ) : !selectedPoaForActivities ? (
          <div className="p-6 text-center text-gray-500">Selecciona una vigencia para ver actividades</div>
        ) : activities.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No hay actividades registradas</div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedActivities).map(([programName, programActivities]) => (
              <div key={programName} className="border rounded-lg">
                <div className="px-4 py-2 bg-gray-100 border-b">
                  <h3 className="font-semibold text-gray-900">{programName}</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white border-b">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-semibold">Actividad</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold">Meta</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold">Unidad</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold">Avance</th>
                        <th className="px-4 py-2 text-left text-sm font-semibold">Estado</th>
                        {canEditActivities && (
                          <th className="px-4 py-2 text-right text-sm font-semibold">Acciones</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {programActivities.map((activity) => (
                        <tr key={activity.id} className="border-t">
                          <td className="px-4 py-2 text-sm">
                            <p className="font-medium text-gray-900">{activity.name}</p>
                            {activity.description && (
                              <p className="text-xs text-gray-500">{activity.description}</p>
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm">{activity.meta ?? '-'}</td>
                          <td className="px-4 py-2 text-sm">{activity.unit || '-'}</td>
                          <td className="px-4 py-2 text-sm">
                            {canEditActivities ? (
                              <input
                                type="number"
                                min={0}
                                max={100}
                                value={activityEdits[activity.id]?.progress ?? activity.progress ?? 0}
                                onChange={(e) =>
                                  handleActivityEdit(
                                    activity.id,
                                    'progress',
                                    Number(e.target.value)
                                  )
                                }
                                className="w-20 px-2 py-1 border border-gray-300 rounded"
                              />
                            ) : (
                              `${activity.progress ?? 0}%`
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            {canEditActivities ? (
                              <select
                                value={activityEdits[activity.id]?.status ?? activity.status}
                                onChange={(e) =>
                                  handleActivityEdit(activity.id, 'status', e.target.value)
                                }
                                className="px-2 py-1 border border-gray-300 rounded"
                              >
                                <option value="PENDING">PENDING</option>
                                <option value="IN_PROGRESS">IN_PROGRESS</option>
                                <option value="COMPLETED">COMPLETED</option>
                              </select>
                            ) : (
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  activity.status === 'COMPLETED'
                                    ? 'bg-green-100 text-green-800'
                                    : activity.status === 'IN_PROGRESS'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {activity.status}
                              </span>
                            )}
                          </td>
                          {canEditActivities && (
                            <td className="px-4 py-2 text-right text-sm">
                              <button
                                onClick={() => handleSaveActivity(activity.id)}
                                className="text-primary-600 hover:text-primary-800"
                              >
                                Guardar
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
