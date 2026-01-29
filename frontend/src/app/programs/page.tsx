'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api';
import Link from 'next/link';

interface Program {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt: string;
}

interface ApiResponse {
  data: Program[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export default function Programs() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProgram, setNewProgram] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    fetchPrograms();
  }, [page, search]);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      params.append('page', page.toString());
      params.append('limit', '10');

      const response = await apiClient.get(`/programs?${params.toString()}`);
      const data = response as ApiResponse;
      setPrograms(data.data);
      setTotalPages(data.pagination.pages);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar programas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/programs', newProgram);
      setNewProgram({ name: '', description: '' });
      setShowCreateForm(false);
      setPage(1);
      await fetchPrograms();
      alert('Programa creado exitosamente');
    } catch (err: any) {
      alert('Error al crear programa: ' + (err.message || 'Error desconocido'));
    }
  };

  const handleDeactivate = async (id: string) => {
    if (!confirm('¿Desactivar este programa?')) return;
    try {
      await apiClient.delete(`/programs/${id}`);
      await fetchPrograms();
    } catch (err: any) {
      alert('Error al desactivar programa: ' + (err.message || 'Error desconocido'));
    }
  };

  if (authLoading || (isAuthenticated && loading)) {
    return <div className="p-8 text-center">Cargando...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Programas</h1>
        <p className="text-gray-600">Catálogo de programas POA</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar programa..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
        />
        {(user?.role === 'ADMIN' || user?.role === 'SUPERVISOR_POA') && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            {showCreateForm ? 'Cancelar' : '+ Crear Programa'}
          </button>
        )}
      </div>
      {showCreateForm && (
        <form
          onSubmit={handleCreateProgram}
          className="mb-6 bg-white p-6 rounded-lg shadow-md border border-gray-200"
        >
          <h2 className="text-xl font-bold mb-4">Nuevo Programa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Nombre del programa"
              value={newProgram.name}
              onChange={(e) =>
                setNewProgram({ ...newProgram, name: e.target.value })
              }
              required
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500"
            />
            <input
              type="text"
              placeholder="Descripción (opcional)"
              value={newProgram.description}
              onChange={(e) =>
                setNewProgram({ ...newProgram, description: e.target.value })
              }
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

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Programa
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {programs.map((program) => (
              <tr key={program.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-sm font-medium">
                  {program.name}
                </td>
                <td className="px-6 py-3 text-sm text-gray-600">
                  {program.description || '-'}
                </td>
                <td className="px-6 py-3 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      program.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {program.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-3 text-right text-sm">
                  {(user?.role === 'ADMIN' || user?.role === 'SUPERVISOR_POA') && (
                    <button
                      onClick={() => handleDeactivate(program.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Desactivar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {programs.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No hay programas registrados
          </div>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className={`px-4 py-2 rounded $${
              page === 1
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            Anterior
          </button>
          <span className="px-4 py-2 text-gray-700">
            Página {page} de {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className={`px-4 py-2 rounded ${
              page === totalPages
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            Siguiente
          </button>
        </div>
      )}

      <div className="mt-6">
        <Link href="/agreements" className="text-primary-600 hover:underline">
          ← Volver a Convenios
        </Link>
      </div>
    </div>
  );
}
