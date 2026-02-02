'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';

interface ActivityValidation {
  id: string;
  activityId: string;
  activityDescription: string;
  program: string;
  status: 'CUMPLE' | 'NO_CUMPLE' | 'NO_APLICA' | 'PENDIENTE';
  observations: string;
  quantitativeValue: number | null;
  quantitativeUnit: string | null;
  trackingDate: string;
}

interface Review {
  id: string;
  agreementId: string;
  poaPeriodId: string;
  status: string;
  semester: number;
  year: number;
  validations: ActivityValidation[];
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingValidation, setEditingValidation] = useState<string | null>(
    null,
  );
  const [formData, setFormData] = useState<Partial<ActivityValidation>>({});
  const [semester, setSemester] = useState<number | string>('');
  const [year, setYear] = useState<number | string>(new Date().getFullYear());

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:4000/reviews', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectReview = (review: Review) => {
    setSelectedReview(review);
    setSemester(review.semester);
    setYear(review.year);
  };

  const handleEditValidation = (validation: ActivityValidation) => {
    setEditingValidation(validation.id);
    setFormData(validation);
  };

  const handleSaveValidation = async () => {
    if (!editingValidation) return;

    setSaving(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:4000/validations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          validations: [
            {
              id: editingValidation,
              status: formData.status,
              observations: formData.observations,
              evidence: formData.quantitativeValue?.toString(),
            },
          ],
        }),
      });

      if (response.ok) {
        setEditingValidation(null);
        setFormData({});
        fetchReviews();
      }
    } catch (error) {
      console.error('Error saving validation:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCloseReview = async () => {
    if (!selectedReview) return;

    if (
      !confirm(
        '¿Estás seguro de que deseas cerrar esta revisión? No podrá editarse después.',
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `http://localhost:4000/reviews/${selectedReview.id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: 'CLOSED' }),
        },
      );

      if (response.ok) {
        fetchReviews();
        setSelectedReview(null);
      }
    } catch (error) {
      console.error('Error closing review:', error);
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

  const getReviewStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-purple-100 text-purple-800',
      CLOSED: 'bg-green-100 text-green-800',
      REOPENED: 'bg-orange-100 text-orange-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              📋 Revisiones Semestrales
            </h1>
            <p className="mt-2 text-gray-600">
              Valida el cumplimiento de actividades del POA por semestre
            </p>
          </div>

          {!selectedReview ? (
            // Reviews List
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.length === 0 ? (
                <div className="col-span-full text-center py-12 bg-white rounded-lg">
                  <p className="text-gray-500 text-lg">
                    No hay revisiones disponibles
                  </p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer"
                    onClick={() => handleSelectReview(review)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Semestre {review.semester} - {review.year}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Convenio: {review.agreementId.substring(0, 8)}...
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${getReviewStatusColor(review.status)}`}
                      >
                        {review.status}
                      </span>
                    </div>

                    <div className="border-t pt-4">
                      <div className="text-sm">
                        <p className="text-gray-600">
                          <span className="font-medium">Actividades:</span>{' '}
                          {review.validations?.length || 0}
                        </p>
                        <p className="text-gray-600 mt-2">
                          <span className="font-medium">Última actualización:</span>{' '}
                          {new Date(review.validations?.[0]?.trackingDate || Date.now()).toLocaleDateString(
                            'es-CO',
                          )}
                        </p>
                      </div>
                    </div>

                    <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium">
                      Abrir Revisión →
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : (
            // Review Detail
            <div>
              {/* Breadcrumb */}
              <button
                onClick={() => setSelectedReview(null)}
                className="text-blue-600 hover:text-blue-900 mb-6 flex items-center"
              >
                ← Volver a revisiones
              </button>

              {/* Review Header */}
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Revisión Semestral - Semestre {selectedReview.semester}/{selectedReview.year}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Convenio: {selectedReview.agreementId}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${getReviewStatusColor(selectedReview.status)}`}
                  >
                    {selectedReview.status}
                  </span>
                </div>

                <div className="flex gap-4 mt-6">
                  {selectedReview.status !== 'CLOSED' && (
                    <button
                      onClick={handleCloseReview}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                      🔒 Cerrar Revisión
                    </button>
                  )}
                </div>
              </div>

              {/* Validations Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Programa
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Descripción
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Valor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Observación
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedReview.validations?.map((validation) => (
                        <tr key={validation.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                            {validation.program}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {validation.activityDescription}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editingValidation === validation.id ? (
                              <select
                                value={formData.status || ''}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    status: e.target.value as any,
                                  })
                                }
                                className="px-3 py-1 border border-gray-300 rounded text-sm"
                              >
                                <option value="CUMPLE">✅ Cumple</option>
                                <option value="NO_CUMPLE">❌ No Cumple</option>
                                <option value="NO_APLICA">N/A No Aplica</option>
                                <option value="PENDIENTE">⏳ Pendiente</option>
                              </select>
                            ) : (
                              <span
                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(validation.status)}`}
                              >
                                {validation.status}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {editingValidation === validation.id ? (
                              <div className="flex gap-2">
                                <input
                                  type="number"
                                  value={formData.quantitativeValue || ''}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      quantitativeValue: parseFloat(e.target.value),
                                    })
                                  }
                                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                  placeholder="Valor"
                                />
                                <input
                                  type="text"
                                  value={formData.quantitativeUnit || ''}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      quantitativeUnit: e.target.value,
                                    })
                                  }
                                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                                  placeholder="Unidad"
                                />
                              </div>
                            ) : (
                              validation.quantitativeValue
                                ? `${validation.quantitativeValue} ${validation.quantitativeUnit || ''}`
                                : '-'
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {editingValidation === validation.id ? (
                              <input
                                type="text"
                                value={formData.observations || ''}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    observations: e.target.value,
                                  })
                                }
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                placeholder="Observación"
                              />
                            ) : (
                              <span className="truncate block max-w-xs">
                                {validation.observations || '-'}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                            {editingValidation === validation.id ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={handleSaveValidation}
                                  disabled={saving}
                                  className="text-green-600 hover:text-green-900 disabled:text-gray-400"
                                >
                                  ✓ Guardar
                                </button>
                                <button
                                  onClick={() => setEditingValidation(null)}
                                  className="text-gray-600 hover:text-gray-900"
                                >
                                  ✕ Cancelar
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleEditValidation(validation)}
                                disabled={selectedReview.status === 'CLOSED'}
                                className="text-blue-600 hover:text-blue-900 disabled:text-gray-400"
                              >
                                ✏️ Editar
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
