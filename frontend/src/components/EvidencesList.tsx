'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface Evidence {
  id: string;
  fileName: string;
  fileUrl: string;
  documentType: string;
  fileSize: string;
  description?: string;
  uploadedByUserId: string;
  createdAt: string;
}

interface EvidencesListProps {
  reviewId: string;
  activityId?: string;
  onDelete?: (evidenceId: string) => void;
}

export const EvidencesList: React.FC<EvidencesListProps> = ({
  reviewId,
  activityId,
  onDelete,
}) => {
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');

  const fetchEvidences = useCallback(async () => {
    try {
      const url = activityId
        ? `/api/evidences/review-activity/${reviewId}/${activityId}`
        : `/api/evidences/by-review/${reviewId}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Error al cargar evidencias');

      const data = await response.json();
      setEvidences(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [reviewId, activityId]);

  useEffect(() => {
    fetchEvidences();
  }, [reviewId, activityId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (evidenceId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta evidencia?')) return;

    try {
      const response = await fetch(`/api/evidences/${evidenceId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Error al eliminar');

      setEvidences(evidences.filter((e) => e.id !== evidenceId));
      onDelete?.(evidenceId);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filteredEvidences = filter
    ? evidences.filter((e) => e.documentType.toLowerCase().includes(filter.toLowerCase()))
    : evidences;

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Cargando evidencias...</div>;
  }

  if (evidences.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay evidencias cargadas
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtro por tipo */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('')}
          className={`px-3 py-1 rounded text-sm ${
            !filter ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Todos ({evidences.length})
        </button>
        {['PDF', 'IMAGE', 'EXCEL', 'WORD', 'VIDEO', 'AUDIO'].map((type) => {
          const count = evidences.filter((e) => e.documentType === type).length;
          if (count === 0) return null;
          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 rounded text-sm ${
                filter === type ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {type} ({count})
            </button>
          );
        })}
      </div>

      {/* Lista de evidencias */}
      <div className="grid gap-3">
        {filteredEvidences.map((evidence) => (
          <div
            key={evidence.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Icono por tipo */}
              <div className="flex-shrink-0">
                {getDocumentIcon(evidence.documentType)}
              </div>

              {/* Información */}
              <div className="flex-grow min-w-0">
                <a
                  href={evidence.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium truncate block"
                >
                  {evidence.fileName}
                </a>
                <p className="text-sm text-gray-600 mt-1">
                  {evidence.documentType} • {evidence.fileSize}
                </p>
                {evidence.description && (
                  <p className="text-sm text-gray-700 mt-2">{evidence.description}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(evidence.createdAt).toLocaleDateString('es-CO')}
                </p>
              </div>

              {/* Acciones */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => handleDelete(evidence.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function getDocumentIcon(documentType: string) {
  const iconClass = 'w-6 h-6';

  switch (documentType) {
    case 'PDF':
      return (
        <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center text-red-600 font-bold">
          PDF
        </div>
      );
    case 'IMAGE':
      return (
        <svg className={`${iconClass} text-green-600`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7l-2.5-2.5a2 2 0 00-3 0L5 12V5z" />
        </svg>
      );
    case 'EXCEL':
      return (
        <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center text-green-600 font-bold text-xs">
          XLS
        </div>
      );
    case 'WORD':
      return (
        <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center text-blue-600 font-bold text-xs">
          DOC
        </div>
      );
    case 'VIDEO':
      return (
        <svg className={`${iconClass} text-purple-600`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm13.5-1a.5.5 0 00-.5.5v7a.5.5 0 00.5.5h.5a.5.5 0 00.5-.5v-7a.5.5 0 00-.5-.5h-.5z" />
        </svg>
      );
    case 'AUDIO':
      return (
        <svg className={`${iconClass} text-orange-600`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 18a9 9 0 100-18 9 9 0 000 18zM9 4a1 1 0 011 1v4a1 1 0 11-2 0V5a1 1 0 011-1z" />
        </svg>
      );
    default:
      return (
        <svg className={`${iconClass} text-gray-600`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0113 2.586V4h3a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
        </svg>
      );
  }
}
