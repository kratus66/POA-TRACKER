'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import {
  Commitment,
  CommitmentStatus,
  CommitmentResponsibleRole,
} from '@/lib/types';

const statusColors = {
  OPEN: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  CLOSED: 'bg-green-100 text-green-800 border-green-300',
  OVERDUE: 'bg-red-100 text-red-800 border-red-300',
};

const statusLabels = {
  OPEN: 'Abierto',
  CLOSED: 'Cerrado',
  OVERDUE: 'Vencido',
};

const roleLabels: Record<CommitmentResponsibleRole, string> = {
  MUNICIPAL_TEAM: 'Equipo Municipal',
  PROGRAM_COORDINATOR: 'Coordinador de Programa',
  REGIONAL_MANAGER: 'Coordinador Regional',
};

export default function CommitmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [commitment, setCommitment] = useState<Commitment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const displayStatus = useMemo(() => {
    if (!commitment) return 'OPEN';
    const dueDate = new Date(commitment.dueDate);
    const isOverdue = commitment.status === CommitmentStatus.OPEN && dueDate < new Date();
    return isOverdue ? 'OVERDUE' : commitment.status;
  }, [commitment]);

  useEffect(() => {
    if (id) {
      fetchCommitment();
    }
  }, [id]);

  const fetchCommitment = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/commitments/${id}`);
      setCommitment(response);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar compromiso');
      console.error('Error fetching commitment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async () => {
    if (!confirm('¿Estás seguro de cerrar este compromiso?')) return;

    try {
      await apiClient.patch(`/commitments/${id}/close`, {});
      fetchCommitment();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al cerrar compromiso');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando compromiso...</p>
        </div>
      </div>
    );
  }

  if (error || !commitment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-800">{error || 'Compromiso no encontrado'}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <button
              onClick={() => router.back()}
              className="text-blue-600 hover:text-blue-800 mb-4"
            >
              ← Volver a Compromisos
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Compromiso</h1>
          </div>
          <div className={`px-4 py-2 rounded-lg border-2 font-semibold ${statusColors[displayStatus]}`}>
            {statusLabels[displayStatus]}
          </div>
        </div>

        {/* Main Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Descripción</h3>
              <p className="text-gray-900">{commitment.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Responsable</h3>
                <p className="text-gray-900">{roleLabels[commitment.responsibleRole]}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Fecha Límite</h3>
                <p className="text-gray-900">
                  {new Date(commitment.dueDate).toLocaleDateString('es-CO', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Fecha de Creación</h3>
                <p className="text-gray-900">
                  {new Date(commitment.createdAt).toLocaleDateString('es-CO')}
                </p>
              </div>
              {commitment.closedAt && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Fecha de Cierre</h3>
                  <p className="text-gray-900">
                    {new Date(commitment.closedAt).toLocaleDateString('es-CO')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Revisión Asociada</h3>
            {commitment.review ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Año:</span> {commitment.review.year}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Semestre:</span> {commitment.review.semester}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Estado:</span> {commitment.review.status}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">ID: {commitment.reviewCycleId}</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Actividad Relacionada</h3>
            {commitment.agreementActivity ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  {commitment.agreementActivity.description || commitment.agreementActivity.name}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">ID: {commitment.agreementActivityId}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        {commitment.status === CommitmentStatus.OPEN && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Acciones</h3>
            <button
              onClick={handleClose}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              ✓ Marcar como Cerrado
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Al cerrar este compromiso se marcará como cumplido y no podrá ser reabierto.
            </p>
          </div>
        )}

        {commitment.status === CommitmentStatus.CLOSED && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <p className="text-green-800 font-medium">
              ✓ Este compromiso ha sido cerrado exitosamente
            </p>
            {commitment.closedAt && (
              <p className="text-green-600 text-sm mt-2">
                Fecha de cierre: {new Date(commitment.closedAt).toLocaleDateString('es-CO')}
              </p>
            )}
          </div>
        )}

        {displayStatus === 'OVERDUE' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800 font-medium">
              ⚠ Este compromiso está vencido
            </p>
            <p className="text-red-600 text-sm mt-2">
              Fecha límite: {new Date(commitment.dueDate).toLocaleDateString('es-CO')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
