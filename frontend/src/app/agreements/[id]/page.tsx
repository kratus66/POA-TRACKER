'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api';
import Layout from '@/components/Layout';
import Link from 'next/link';

interface Municipality {
  id: string;
  code: string;
  name: string;
  department?: {
    id: string;
    name: string;
  };
}

interface Department {
  id: string;
  name: string;
}

interface Agreement {
  id: string;
  agreementNumber: string;
  startDate: string;
  endDate: string;
  status: string;
  municipality: Municipality;
  description?: string;
  programs?: Program[];
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
  const [departments, setDepartments] = useState<Department[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [poaPeriods, setPoaPeriods] = useState<PoaPeriod[]>([]);
  const [supervisors, setSupervisors] = useState<User[]>([]);
  const [templates, setTemplates] = useState<PoaTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPoaYear, setNewPoaYear] = useState(new Date().getFullYear());
  const [newPoaNotes, setNewPoaNotes] = useState('');
  const [selectedSupervisorId, setSelectedSupervisorId] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
  const [selectedMunicipalityId, setSelectedMunicipalityId] = useState('');
  const [selectedProgramIds, setSelectedProgramIds] = useState<string[]>([]);
  const [savingAgreementSettings, setSavingAgreementSettings] = useState(false);

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
      fetchDepartments();
      fetchPrograms();
    }
  }, [agreementId]);

  useEffect(() => {
    if (selectedDepartmentId) {
      fetchMunicipalities(selectedDepartmentId);
    } else {
      setMunicipalities([]);
    }
  }, [selectedDepartmentId]);

  const fetchAgreement = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/agreements/${agreementId}`);
      setAgreement(response);
      setSelectedDepartmentId(response?.municipality?.department?.id || '');
      setSelectedMunicipalityId(response?.municipality?.id || '');
      setSelectedProgramIds((response?.programs || []).map((p: Program) => p.id));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar convenio');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await apiClient.get('/municipalities/departments');
      setDepartments(response || []);
    } catch (err) {
      console.error('Error cargando departamentos', err);
    }
  };

  const fetchMunicipalities = async (departmentId: string) => {
    try {
      const response = await apiClient.get(
        `/municipalities?departmentId=${departmentId}&page=1&limit=200`,
      );
      setMunicipalities(response?.data || []);
    } catch (err) {
      console.error('Error cargando municipios', err);
      setMunicipalities([]);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await apiClient.get('/programs/active/list');
      setPrograms(response || []);
    } catch (err) {
      console.error('Error cargando programas', err);
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
      const response = await apiClient.get('/admin/supervisors');
      setSupervisors(response || []);
    } catch (err) {
      console.error('Error fetching supervisors:', err);
      setSupervisors([]);
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

  const handleToggleProgram = (programId: string) => {
    setSelectedProgramIds((prev) =>
      prev.includes(programId)
        ? prev.filter((id) => id !== programId)
        : [...prev, programId],
    );
  };

  const handleSaveAgreementSettings = async () => {
    if (!selectedMunicipalityId) {
      alert('Selecciona un municipio');
      return;
    }

    if (!newPoaYear) {
      alert('Selecciona el año de la vigencia');
      return;
    }

    try {
      setSavingAgreementSettings(true);

      await apiClient.patch(`/agreements/${agreementId}`, {
        municipalityId: selectedMunicipalityId,
        programIds: selectedProgramIds,
      });

      try {
        await apiClient.post('/poa-periods', {
          year: newPoaYear,
          agreementId,
          notes: newPoaNotes,
          supervisorId: selectedSupervisorId || undefined,
        });
      } catch (err: any) {
        const message = err.response?.data?.message || '';
        if (!message.includes('Ya existe un POA')) {
          throw err;
        }
      }

      if (selectedTemplateId) {
        await apiClient.post(
          `/agreements/${agreementId}/apply-template/${selectedTemplateId}?year=${newPoaYear}`,
          {},
        );
      }

      await fetchAgreement();
      await fetchPoaPeriods();
      setNewPoaNotes('');
      alert('Convenio y vigencia actualizados');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al guardar la configuración');
    } finally {
      setSavingAgreementSettings(false);
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
  

  return (
    <Layout>
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
            <p className="text-lg font-medium">
              {agreement.municipality.department?.name || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Programas</p>
            <p className="text-lg font-medium">
              {agreement.programs && agreement.programs.length > 0
                ? agreement.programs.map((p) => p.name).join(', ')
                : 'Sin programas'}
            </p>
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

      {(user?.role === 'ADMIN' || user?.role === 'COORDINATOR') && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Asignar Municipio y Programas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Departamento</label>
              <select
                value={selectedDepartmentId}
                onChange={(e) => {
                  setSelectedDepartmentId(e.target.value);
                  setSelectedMunicipalityId('');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecciona departamento...</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Municipio</label>
              <select
                value={selectedMunicipalityId}
                onChange={(e) => setSelectedMunicipalityId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecciona municipio...</option>
                {municipalities.map((mun) => (
                  <option key={mun.id} value={mun.id}>
                    {mun.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Programas</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {programs.map((program) => (
                <label
                  key={program.id}
                  className="flex items-center gap-2 text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-2"
                >
                  <input
                    type="checkbox"
                    checked={selectedProgramIds.includes(program.id)}
                    onChange={() => handleToggleProgram(program.id)}
                    className="h-4 w-4"
                  />
                  <span>{program.name}</span>
                </label>
              ))}
              {programs.length === 0 && (
                <div className="text-sm text-gray-500">No hay programas activos</div>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Año de Vigencia</label>
              <input
                type="number"
                value={newPoaYear}
                onChange={(e) => setNewPoaYear(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Supervisor</label>
              <select
                value={selectedSupervisorId}
                onChange={(e) => setSelectedSupervisorId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecciona supervisor...</option>
                {supervisors.map((sup) => (
                  <option key={sup.id} value={sup.id}>
                    {sup.firstName} {sup.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Notas de la Vigencia</label>
              <textarea
                value={newPoaNotes}
                onChange={(e) => setNewPoaNotes(e.target.value)}
                placeholder="Agregar notas sobre esta vigencia POA..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={2}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Plantilla POA</label>
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
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSaveAgreementSettings}
              disabled={savingAgreementSettings}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-60"
            >
              {savingAgreementSettings ? 'Guardando...' : 'Guardar Todo'}
            </button>
          </div>
        </div>
      )}

      {/* Vigencias POA */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Vigencias POA</h2>
        </div>

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

    </div>
    </Layout>
  );
}
