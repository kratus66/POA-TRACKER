'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api';
import Layout from '@/components/Layout';

interface DashboardStats {
  totalPoas: number;
  completados: number;
  enProgreso: number;
  atrasados: number;
}

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalPoas: 0,
    completados: 0,
    enProgreso: 0,
    atrasados: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      // Cargar POAs
      const poasResponse = await apiClient.get('/poa-periods?limit=1000');
      const poas = poasResponse?.data || [];
      
      setStats({
        totalPoas: poas.length,
        completados: 0, // Por ahora
        enProgreso: poas.length,
        atrasados: 0, // Por ahora
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (!loading && isAuthenticated) {
      fetchDashboardStats();
    }
  }, [isAuthenticated, loading, router]); // Removido fetchDashboardStats de las dependencias

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bienvenido a POA Tracker
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Sistema de seguimiento de Plan Operativo Anual
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total POAs
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {loadingStats ? '...' : stats.totalPoas}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Completados
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {loadingStats ? '...' : stats.completados}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      En Progreso
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {loadingStats ? '...' : stats.enProgreso}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Atrasados
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {loadingStats ? '...' : stats.atrasados}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            ✅ ¡Sistema Listo!
          </h2>
          <p className="text-gray-600 mb-4">
            Tu sesión está activa y el sistema está funcionando correctamente.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✓ Autenticación JWT configurada</li>
            <li>✓ Cookies httpOnly habilitadas</li>
            <li>✓ Base de datos conectada</li>
            <li>✓ Sistema de roles implementado</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
