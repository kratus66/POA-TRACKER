'use client';

import { useState, useEffect, useCallback } from 'react';
import Layout from '@/components/Layout';

interface Agreement {
  id: string;
  code: string;
  municipality: { name: string };
}

interface POAPeriod {
  id: string;
  year: number;
  status: string;
  agreement: Agreement;
  notes?: string;
  createdAt: string;
}

export default function POAsPage() {
  const [poas, setPoas] = useState<POAPeriod[]>([]);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    agreementId: '',
    year: new Date().getFullYear(),
    notes: '',
  });

  const fetchPOAs = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('No autenticado');
        return;
      }

      const response = await fetch('http://localhost:4000/poa-periods', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar POAs');
      }

      const data = await response.json();
      // El backend retorna { data: [...], pagination: {...} }
      setPoas(Array.isArray(data.data) ? data.data : []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setPoas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAgreements = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await fetch('http://localhost:4000/agreements', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // El backend retorna { data: [...], pagination: {...} }
        const agreementList = Array.isArray(data.data) ? data.data : [];
        setAgreements(agreementList);
      }
    } catch (err) {
      console.error('Error al cargar convenios:', err);
    }
  }, []);

  useEffect(() => {
    fetchPOAs();
    fetchAgreements();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      
      if (!formData.agreementId) {
        setError('Debes seleccionar un convenio');
        return;
      }

      const response = await fetch('http://localhost:4000/poa-periods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          agreementId: formData.agreementId,
          year: formData.year,
          notes: formData.notes || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear POA');
      }

      setFormData({
        agreementId: '',
        year: new Date().getFullYear(),
        notes: '',
      });
      setShowForm(false);
      setError(null);
      fetchPOAs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear POA');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro que desea eliminar este POA?')) return;

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:4000/poa-periods/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar POA');
      }

      setError(null);
      fetchPOAs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar POA');
    }
  };

  const filteredPoas = poas.filter(poa =>
    poa.agreement?.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    poa.agreement?.municipality?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    poa.year.toString().includes(searchTerm)
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vigencias POA</h1>
            <p className="mt-1 text-sm text-gray-600">Gestión de períodos POA por convenio</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
          >
            + Crear Vigencia
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Crear Nueva Vigencia POA</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Convenio *</label>
                <select
                  value={formData.agreementId}
                  onChange={(e) => setFormData({ ...formData, agreementId: e.target.value })}
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 border p-2"
                >
                  <option value="">Seleccionar convenio...</option>
                  {agreements.map((agreement) => (
                    <option key={agreement.id} value={agreement.id}>
                      {agreement.code} - {agreement.municipality?.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Año *</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 border p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Notas</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 border p-2"
                  rows={3}
                  placeholder="Notas adicionales..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-lg shadow p-4">
          <input
            type="text"
            placeholder="Buscar por código de convenio, municipio o año..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredPoas.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No hay vigencias POA registradas</p>
              <p className="text-sm mt-1">Crea la primera vigencia usando el botón "Crear Vigencia"</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Código Convenio</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Municipio</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Año</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Creada</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredPoas.map((poa) => (
                    <tr key={poa.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{poa.agreement?.code}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{poa.agreement?.municipality?.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{poa.year}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                          {poa.status || 'Activo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(poa.createdAt).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleDelete(poa.id)}
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
