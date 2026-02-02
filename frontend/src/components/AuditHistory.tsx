'use client';

import React, { useState, useEffect } from 'react';

interface AuditEntry {
  id: string;
  action: string;
  entityType: string;
  oldData?: Record<string, any>;
  newData?: Record<string, any>;
  changes?: Record<string, any>;
  user?: { id: string; email: string };
  reason?: string;
  createdAt: string;
  success: boolean;
}

interface AuditHistoryProps {
  entityType: string;
  entityId: string;
  limit?: number;
}

export const AuditHistory: React.FC<AuditHistoryProps> = ({
  entityType,
  entityId,
  limit = 20,
}) => {
  const [audits, setAudits] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchAuditHistory();
  }, [entityType, entityId]);

  const fetchAuditHistory = async () => {
    try {
      const response = await fetch(
        `/api/audits/entity/${entityType}/${entityId}?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) throw new Error('Error al cargar auditoría');

      const data = await response.json();
      setAudits(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: string): string => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'UPDATE':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'DELETE':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'CLOSE':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'REOPEN':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const getActionIcon = (action: string): string => {
    switch (action) {
      case 'CREATE':
        return '✚';
      case 'UPDATE':
        return '✎';
      case 'DELETE':
        return '✕';
      case 'CLOSE':
        return '◉';
      case 'REOPEN':
        return '↻';
      default:
        return '○';
    }
  };

  const renderChanges = (changes?: Record<string, any>) => {
    if (!changes) return null;

    return (
      <div className="space-y-2">
        {Object.entries(changes).map(([field, change]: [string, any]) => (
          <div key={field} className="text-sm">
            <span className="font-medium text-gray-700">{field}:</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                {String(change.old || '(vacío)')}
              </span>
              <span className="text-gray-400">→</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                {String(change.new || '(vacío)')}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Cargando historial...</div>;
  }

  if (audits.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay cambios registrados
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-700 mb-4">
        Historial de cambios ({audits.length})
      </div>

      {audits.map((audit) => (
        <div
          key={audit.id}
          className={`border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow ${getActionColor(audit.action)}`}
          onClick={() =>
            setExpandedId(expandedId === audit.id ? null : audit.id)
          }
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-grow">
              {/* Icono de acción */}
              <div className="text-xl font-bold mt-1">{getActionIcon(audit.action)}</div>

              {/* Información */}
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{audit.action}</span>
                  <span className="text-xs opacity-75">
                    {new Date(audit.createdAt).toLocaleString('es-CO')}
                  </span>
                </div>
                {audit.user && (
                  <p className="text-xs opacity-75 mt-1">Por: {audit.user.email}</p>
                )}
                {audit.reason && (
                  <p className="text-xs mt-1 italic">{audit.reason}</p>
                )}
              </div>
            </div>

            {/* Status */}
            {!audit.success && (
              <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">
                Error
              </span>
            )}
          </div>

          {/* Detalles expandibles */}
          {expandedId === audit.id && audit.changes && (
            <div className="mt-4 pt-4 border-t border-current border-opacity-20">
              {renderChanges(audit.changes)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
