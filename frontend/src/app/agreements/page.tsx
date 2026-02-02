'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api';
import Layout from '@/components/Layout';
import Link from 'next/link';

interface Municipality {
  id: string;
  code: string;
  name: string;
  department: string | { id: string; name: string };
  departmentId?: string;
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

interface ApiResponse {
  data: Agreement[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

interface MunicipalityApiResponse {
  data: Municipality[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export default function Agreements() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [filteredMunicipalities, setFilteredMunicipalities] = useState<Municipality[]>([]);
  const [departments, setDepartments] = useState<Array<{id: string; name: string}>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState(
    searchParams.get('municipality') || ''
  );
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formDepartmentId, setFormDepartmentId] = useState('');
  const [newAgreement, setNewAgreement] = useState({
    agreementNumber: '',
    startDate: '',
    endDate: '',
    status: 'ACTIVE',
    description: '',
    municipalityId: '',
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchAgreements();
  }, [page, selectedMunicipality, selectedDepartment, selectedStatus]);

  const fetchDepartments = async () => {
    try {
      const response = await apiClient.get('/municipalities/departments');
      console.log('Departments response:', response);
      setDepartments(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error('Error fetching departments:', err);
      setError(`Error al cargar departamentos: ${err}`);
      setDepartments([]);
    }
  };

  const fetchMunicipalitiesByDepartment = async (departmentId: string) => {
    try {
      const response = await apiClient.get(`/municipalities?departmentId=${departmentId}&limit=500`);
      console.log('Municipalities for dept:', response);
      const data = response as MunicipalityApiResponse;
      const munList = data.data || data;
      console.log('Municipios del departamento:', munList.length);
      setFilteredMunicipalities(munList);
    } catch (err) {
      console.error('Error fetching municipalities by department:', err);
      setFilteredMunicipalities([]);
    }
  };

  // Ya no necesitamos fetchMunicipalities ni filteredMunicipalitiesForForm
  // Ahora cargamos municipios on-demand cuando se selecciona un departamento

  const fetchAgreements = async () => {
    try {
      setLoading(true);
      // Intentar sin parámetros primero para diagnosticar
      const response = await apiClient.get('/agreements');
      console.log('Agreements response:', response);
      const data = response as ApiResponse;
      setAgreements(Array.isArray(data) ? data : (data.data || []));
      setTotalPages(data.pagination?.pages || 1);
      setError(null);
    } catch (err: any) {
      console.error('Agreements error:', err);
      setError(err.message || 'Error al cargar convenios');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAgreement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/agreements', newAgreement);
      setNewAgreement({
        agreementNumber: '',
        startDate: '',
        endDate: '',
        status: 'ACTIVE',
        description: '',
        municipalityId: '',
      });
      setFormDepartmentId('');
      setShowCreateForm(false);
      setPage(1);
      await fetchAgreements();
      alert('Convenio creado exitosamente');
    } catch (err: any) {
      alert('Error al crear convenio: ' + (err.message || 'Error desconocido'));
    }
  };

  // Ya no necesitamos esta función de filtrado
  // Los municipios se cargan dinámicamente por departamento

  if (authLoading || (isAuthenticated && loading)) {
    return <div className="p-8 text-center">Cargando...</div>;
  }

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Convenios</h1>
        <p className="text-gray-600">Gestiona los convenios y vigencias POA</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Crear Convenio */}
      {(user?.role === 'ADMIN' || user?.role === 'COORDINATOR') && (
        <div className="mb-6">
          {!showCreateForm ? (
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              + Crear Convenio
            </button>
          ) : (
            <form
              onSubmit={handleCreateAgreement}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
            >
              <h2 className="text-xl font-bold mb-4">Nuevo Convenio</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Número de convenio"
                  value={newAgreement.agreementNumber}
                  onChange={(e) =>
                    setNewAgreement({
                      ...newAgreement,
                      agreementNumber: e.target.value,
                    })
                  }
                  required
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
                />
                <select
                  value={formDepartmentId}
                  onChange={(e) => {
                    const deptId = e.target.value;
                    setFormDepartmentId(deptId);
                    setNewAgreement({
                      ...newAgreement,
                      municipalityId: '', // Limpiar municipio cuando cambia departamento
                    });
                    // Cargar municipios del departamento seleccionado
                    if (deptId) {
                      fetchMunicipalitiesByDepartment(deptId);
                    } else {
                      setFilteredMunicipalities([]);
                    }
                  }}
                  required
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
                >
                  <option value="">Selecciona departamento</option>
                  {departments.map((dept: any) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name || dept}
                    </option>
                  ))}
                </select>
                <select
                  value={newAgreement.municipalityId}
                  onChange={(e) =>
                    setNewAgreement({
                      ...newAgreement,
                      municipalityId: e.target.value,
                    })
                  }
                  required
                  disabled={!formDepartmentId}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 disabled:bg-gray-100"
                >
                  <option value="">
                    {formDepartmentId ? `Selecciona municipio (${filteredMunicipalities.length} disponibles)` : 'Primero selecciona departamento'}
                  </option>
                  {filteredMunicipalities.map((mun) => (
                    <option key={mun.id} value={mun.id}>
                      {mun.name}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={newAgreement.startDate}
                  onChange={(e) =>
                    setNewAgreement({
                      ...newAgreement,
                      startDate: e.target.value,
                    })
                  }
                  required
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
                />
                <input
                  type="date"
                  value={newAgreement.endDate}
                  onChange={(e) =>
                    setNewAgreement({
                      ...newAgreement,
                      endDate: e.target.value,
                    })
                  }
                  required
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
                />
              </div>
              <div className="mb-4">
                <textarea
                  placeholder="Descripción"
                  value={newAgreement.description}
                  onChange={(e) =>
                    setNewAgreement({
                      ...newAgreement,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
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

      {/* Filtros */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          value={selectedMunicipality}
          onChange={(e) => {
            setSelectedMunicipality(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500"
        >
          <option value="">Todos los municipios</option>
          {municipalities.map((mun) => (
            <option key={mun.id} value={mun.id}>
              {mun.name}
            </option>
          ))}
        </select>
        <select
          value={selectedDepartment}
          onChange={(e) => {
            setSelectedDepartment(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500"
        >
          <option value="">Todos los departamentos</option>
          {departments.map((dept: any) => (
            <option key={dept.id} value={dept.id}>
              {dept.name || dept}
            </option>
          ))}
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500"
        >
          <option value="">Todos los estados</option>
          <option value="ACTIVE">Activo</option>
          <option value="INACTIVE">Inactivo</option>
          <option value="SUSPENDED">Suspendido</option>
          <option value="EXPIRED">Expirado</option>
        </select>
      </div>

      {/* Tabla de Convenios */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Número
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Municipio
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Vigencia
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {agreements.map((agreement) => {
              const startYear = new Date(agreement.startDate).getFullYear();
              const endYear = new Date(agreement.endDate).getFullYear();
              return (
                <tr key={agreement.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm font-medium">
                    {agreement.agreementNumber}
                  </td>
                  <td className="px-6 py-3 text-sm">{agreement.municipality.name}</td>
                  <td className="px-6 py-3 text-sm">
                    {startYear}-{endYear}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <Link
                      href={`/agreements/${agreement.id}`}
                      className="text-primary-600 hover:underline"
                    >
                      Ver Vigencias
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {agreements.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No hay convenios para mostrar
          </div>
        )}
      </div>

      {/* Paginación */}
      <div className="mt-6 flex justify-center gap-2">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Anterior
        </button>
        <span className="px-4 py-2">
          Página {page} de {totalPages}
        </span>
        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Siguiente
        </button>
      </div>
    </div>
    </Layout>
  );
}
