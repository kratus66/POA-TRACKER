'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';

interface ActivityTrackingRecord {
  id: string;
  validationId: string;
  status: string;
  observation: string;
  quantitativeValue: number;
  quantitativeUnit: string;
  reviewerId: string;
  trackingDate: string;
  isVerified: boolean;
}

export default function ActivityTrackingPage() {
  const [trackings, setTrackings] = useState<ActivityTrackingRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [filteredTrackings, setFilteredTrackings] = useState<
    ActivityTrackingRecord[]
  >([]);
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    reviewer: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ActivityTrackingRecord>>({});
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTrackings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [trackings, filters]);

  const fetchTrackings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:4000/activity-tracking', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTrackings(data);
      }
    } catch (error) {
      console.error('Error fetching trackings:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = trackings;

    if (filters.status) {
      filtered = filtered.filter((t) => t.status === filters.status);
    }

    if (filters.startDate) {
      filtered = filtered.filter(
        (t) => new Date(t.trackingDate) >= new Date(filters.startDate),
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(
        (t) => new Date(t.trackingDate) <= new Date(filters.endDate),
      );
    }

    setFilteredTrackings(filtered);
  };

  const handleEdit = (tracking: ActivityTrackingRecord) => {
    setEditingId(tracking.id);
    setFormData(tracking);
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `http://localhost:4000/activity-tracking/${editingId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      if (response.ok) {
        fetchTrackings();
        setEditingId(null);
        setFormData({});
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error saving tracking:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(
          `http://localhost:4000/activity-tracking/${id}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          fetchTrackings();
        }
      } catch (error) {
        console.error('Error deleting tracking:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      CUMPLE: 'bg-green-100 text-green-800',
      NO_CUMPLE: 'bg-red-100 text-red-800',
      NO_APLICA: 'bg-gray-100 text-gray-800',
      PENDIENTE: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                📊 Seguimiento de Actividades
              </h1>
              <p className="mt-2 text-gray-600">
                Registra y controla el seguimiento de cada actividad del POA
              </p>
            </div>
            <button
              onClick={() => {
                setShowForm(true);
                setFormData({});
                setEditingId(null);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              ➕ Nuevo Registro
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Filtros</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos</option>
                  <option value="CUMPLE">✅ Cumple</option>
                  <option value="NO_CUMPLE">❌ No Cumple</option>
                  <option value="NO_APLICA">N/A No Aplica</option>
                  <option value="PENDIENTE">⏳ Pendiente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Desde
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    setFilters({ ...filters, startDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hasta
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    setFilters({ ...filters, endDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mostrar
                </label>
                <div className="flex items-center pt-2 text-sm text-gray-600">
                  Total: {filteredTrackings.length} registros
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                Cargando registros...
              </div>
            ) : filteredTrackings.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No hay registros de seguimiento
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor Cuantitativo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Observación
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTrackings.map((tracking) => (
                      <tr key={tracking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(tracking.trackingDate).toLocaleDateString(
                            'es-CO',
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(tracking.status)}`}
                          >
                            {tracking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {tracking.quantitativeValue
                            ? `${tracking.quantitativeValue} ${tracking.quantitativeUnit || ''}`
                            : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {tracking.observation}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(tracking)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleDelete(tracking.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            🗑️ Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Modal Form */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6">
                <h2 className="text-2xl font-bold mb-4">
                  {editingId ? 'Editar Registro' : 'Nuevo Registro de Seguimiento'}
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estado *
                      </label>
                      <select
                        value={formData.status || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="">Selecciona estado</option>
                        <option value="CUMPLE">✅ Cumple</option>
                        <option value="NO_CUMPLE">❌ No Cumple</option>
                        <option value="NO_APLICA">N/A No Aplica</option>
                        <option value="PENDIENTE">⏳ Pendiente</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha *
                      </label>
                      <input
                        type="date"
                        value={
                          formData.trackingDate
                            ? new Date(formData.trackingDate)
                                .toISOString()
                                .split('T')[0]
                            : ''
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            trackingDate: new Date(e.target.value).toISOString(),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Valor Cuantitativo
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.quantitativeValue || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            quantitativeValue: parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Ej: 150.5"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unidad
                      </label>
                      <select
                        value={formData.quantitativeUnit || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            quantitativeUnit: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="">Selecciona unidad</option>
                        <option value="kg">Kilogramos (kg)</option>
                        <option value="%">Porcentaje (%)</option>
                        <option value="unidades">Unidades</option>
                        <option value="horas">Horas</option>
                        <option value="días">Días</option>
                        <option value="COP">Pesos (COP)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Observación
                    </label>
                    <textarea
                      value={formData.observation || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          observation: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows={4}
                      placeholder="Detalles adicionales del seguimiento..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end mt-6">
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setFormData({});
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    💾 Guardar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
