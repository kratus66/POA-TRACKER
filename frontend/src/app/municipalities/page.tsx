'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api';
import Link from 'next/link';

interface Municipality {
  id: string;
  code: string;
  name: string;
  department: string;
  active: boolean;
  createdAt: string;
}

interface ApiResponse {
  data: Municipality[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export default function Municipalities() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newMunicipality, setNewMunicipality] = useState({
    code: '',
    name: '',
    department: '',
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
    fetchMunicipalities();
  }, [page, search, selectedDepartment]);

  const fetchDepartments = async () => {
    try {
      const response = await apiClient.get('/municipalities/departments');
      setDepartments(response);
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  const fetchMunicipalities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedDepartment) params.append('department', selectedDepartment);
      params.append('page', page.toString());
      params.append('limit', '10');

      const response = await apiClient.get(`/municipalities?${params.toString()}`);
      const data = response as ApiResponse;
      setMunicipalities(data.data);
      setTotalPages(data.pagination.pages);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar municipios');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMunicipality = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/municipalities', newMunicipality);
      setNewMunicipality({ code: '', name: '', department: '' });
      setShowCreateForm(false);
      setPage(1);
      await fetchMunicipalities();
      alert('Municipio creado exitosamente');
    } catch (err: any) {
      alert('Error al crear municipio: ' + (err.message || 'Error desconocido'));
    }
  };

  if (authLoading || (isAuthenticated && loading)) {
    return <div className="p-8 text-center">Cargando...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Municipios</h1>
        <p className="text-gray-600">Gestiona los municipios del sistema</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Crear Municipio */}
      {user?.role === 'ADMIN' && (
        <div className="mb-6">
          {!showCreateForm ? (
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              + Crear Municipio
            </button>
          ) : (
            <form
              onSubmit={handleCreateMunicipality}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
            >
              <h2 className="text-xl font-bold mb-4">Nuevo Municipio</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Código DANE"
                  value={newMunicipality.code}
                  onChange={(e) =>
                    setNewMunicipality({
                      ...newMunicipality,
                      code: e.target.value,
                    })
                  }
                  required
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
                />
                <input
                  type="text"
                  placeholder="Nombre"
                  value={newMunicipality.name}
                  onChange={(e) =>
                    setNewMunicipality({
                      ...newMunicipality,
                      name: e.target.value,
                    })
                  }
                  required
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
                />
                <input
                  type="text"
                  placeholder="Departamento"
                  value={newMunicipality.department}
                  onChange={(e) =>
                    setNewMunicipality({
                      ...newMunicipality,
                      department: e.target.value,
                    })
                  }
                  required
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

      {/* Filtros */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Buscar por nombre o código..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500"
        />
        <select
          value={selectedDepartment}
          onChange={(e) => {
            setSelectedDepartment(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500"
        >
          <option value="">Todos los departamentos</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla de Municipios */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Código
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Departamento
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {municipalities.map((municipality) => (
              <tr key={municipality.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-sm">{municipality.code}</td>
                <td className="px-6 py-3 text-sm font-medium">{municipality.name}</td>
                <td className="px-6 py-3 text-sm">{municipality.department}</td>
                <td className="px-6 py-3 text-sm">
                  <Link
                    href={`/agreements?municipality=${municipality.id}`}
                    className="text-primary-600 hover:underline"
                  >
                    Ver Convenios
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {municipalities.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No hay municipios para mostrar
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
  );
}
