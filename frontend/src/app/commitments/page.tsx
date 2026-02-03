'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Commitment, CommitmentStatus, ResponsibleRole } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const statusColors = {
  OPEN: 'bg-yellow-100 text-yellow-800',
  CLOSED: 'bg-green-100 text-green-800',
  OVERDUE: 'bg-red-100 text-red-800',
};

const statusLabels = {
  OPEN: 'Abierto',
  CLOSED: 'Cerrado',
  OVERDUE: 'Vencido',
};

const roleLabels = {
  MUNICIPAL_TEAM: 'Equipo Municipal',
  PROGRAM_COORDINATOR: 'Coordinador de Programa',
  REGIONAL_MANAGER: 'Coordinador Regional',
};

export default function CommitmentsPage() {
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterRole, setFilterRole] = useState<string>('');

  useEffect(() => {
    fetchCommitments();
  }, [filterStatus, filterRole]);

  const fetchCommitments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params: any = {};
      if (filterStatus) params.status = filterStatus;
      if (filterRole) params.responsibleRole = filterRole;

      const response = await axios.get(`${API_URL}/commitments`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setCommitments(response.data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar compromisos');
      console.error('Error fetching commitments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async (id: string) => {
    if (!confirm('¿Estás seguro de cerrar este compromiso?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/commitments/${id}/close`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCommitments();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al cerrar compromiso');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando compromisos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Compromisos</h1>
            <p className="text-gray-600 mt-2">Gestión de compromisos derivados de actividades</p>
          </div>
          <Link
            href="/commitments/new"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            + Nuevo Compromiso
          </Link>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                <option value="OPEN">Abiertos</option>
                <option value="CLOSED">Cerrados</option>
                <option value="OVERDUE">Vencidos</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                <option value="MUNICIPAL_TEAM">Equipo Municipal</option>
                <option value="PROGRAM_COORDINATOR">Coordinador de Programa</option>
                <option value="REGIONAL_MANAGER">Coordinador Regional</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Compromisos List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {commitments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No se encontraron compromisos
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Título
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Responsable
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Límite
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Creado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {commitments.map((commitment) => (
                    <tr key={commitment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{commitment.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {commitment.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex text-xs font-semibold px-2 py-1 rounded-full ${statusColors[commitment.status]}`}>
                          {statusLabels[commitment.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {roleLabels[commitment.responsibleRole]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(commitment.dueDate).toLocaleDateString('es-CO')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(commitment.createdAt).toLocaleDateString('es-CO')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/commitments/${commitment.id}`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Ver
                        </Link>
                        {commitment.status === CommitmentStatus.OPEN && (
                          <button
                            onClick={() => handleClose(commitment.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Cerrar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
