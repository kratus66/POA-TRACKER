'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { CommitmentResponsibleRole } from '@/lib/types';

export default function NewCommitmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  const preselectedReviewId = searchParams.get('reviewCycleId') || '';
  const preselectedActivityId = searchParams.get('agreementActivityId') || '';

  const [formData, setFormData] = useState({
    description: '',
    responsibleRole: CommitmentResponsibleRole.MUNICIPAL_TEAM,
    dueDate: '',
    reviewCycleId: preselectedReviewId,
    agreementActivityId: preselectedActivityId,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    if (formData.reviewCycleId) {
      fetchActivities(formData.reviewCycleId);
    }
  }, [formData.reviewCycleId]);

  const fetchReviews = async () => {
    try {
      const response = await apiClient.get('/reviews');
      setReviews(response || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const fetchActivities = async (reviewId: string) => {
    try {
      const review = await apiClient.get(`/reviews/${reviewId}`);
      const poaPeriodId = review?.poaPeriodId;
      if (!poaPeriodId) {
        setActivities([]);
        return;
      }

      const acts = await apiClient.get(`/agreement-activities/period/${poaPeriodId}`);
      setActivities(acts || []);
    } catch (err) {
      console.error('Error fetching activities:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiClient.post('/commitments', formData);
      
      router.push('/commitments');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear compromiso');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const filteredActivities = useMemo(() => {
    return activities;
  }, [activities]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Nuevo Compromiso</h1>
          <p className="text-gray-600 mt-2">Crear compromiso derivado de actividad no cumplida</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Revisión/Semestre *
            </label>
            <select
              name="reviewCycleId"
              value={formData.reviewCycleId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar revisión</option>
              {reviews.map((review) => (
                <option key={review.id} value={review.id}>
                  {review.year} - Semestre {review.semester} ({review.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Actividad Relacionada *
            </label>
            <select
              name="agreementActivityId"
              value={formData.agreementActivityId}
              onChange={handleChange}
              required
              disabled={!formData.reviewCycleId}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">Seleccionar actividad</option>
              {filteredActivities.map((activity) => (
                <option key={activity.id} value={activity.id}>
                  {activity.description || activity.name || activity.id}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción detallada del compromiso"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Responsable *
            </label>
            <select
              name="responsibleRole"
              value={formData.responsibleRole}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="MUNICIPAL_TEAM">Equipo Municipal</option>
              <option value="PROGRAM_COORDINATOR">Coordinador de Programa</option>
              <option value="REGIONAL_MANAGER">Coordinador Regional</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Límite *
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {loading ? 'Creando...' : 'Crear Compromiso'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
