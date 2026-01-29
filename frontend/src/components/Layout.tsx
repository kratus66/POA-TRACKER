'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated, user, loading } = useAuth();

  // Si está cargando, mostrar pantalla de carga
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

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return null; // El middleware/router manejará la redirección
  }

  // Si está pendiente de aprobación, mostrar mensaje
  if (user?.status === 'PENDING') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow">
          <div className="text-6xl mb-4">⏳</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Cuenta Pendiente de Aprobación
          </h1>
          <p className="text-gray-600 mb-6">
            Tu cuenta está siendo revisada por un administrador. Recibirás un email cuando sea aprobada.
          </p>
          <button
            onClick={() => {
              router.push('/');
            }}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  // Si fue rechazado
  if (user?.status === 'REJECTED') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-red-900 mb-2">
            Cuenta Rechazada
          </h1>
          <p className="text-gray-600 mb-2">
            Tu solicitud de registro ha sido rechazada.
          </p>
          {user.rejectionReason && (
            <p className="text-gray-600 mb-6 italic">
              Motivo: {user.rejectionReason}
            </p>
          )}
          <button
            onClick={() => router.push('/login')}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
          >
            Volver a Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Topbar */}
        <Topbar setSidebarOpen={setSidebarOpen} />

        {/* Page Content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
