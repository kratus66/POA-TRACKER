'use client';

import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { apiClient } from '@/lib/api';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  rejectionReason?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar autenticación al montar (solo una vez)
  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        // Intentar recuperar user del localStorage primero
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('access_token');
        
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setError(null);
        }
        // NO intentar verificar con backend si no hay token
      } catch (err: any) {
        setUser(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []); // Array vacío para ejecutar solo una vez al montar

  const checkAuth = useCallback(async () => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') {
      return;
    }

    try {
      // Intentar recuperar user del localStorage primero
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('access_token');
      
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setError(null);
      } else {
        // Si no hay datos en localStorage, intentar verificar con el backend
        const userData = await apiClient.get('/auth/me');
        setUser(userData);
        setError(null);
      }
    } catch (err: any) {
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.post('/auth/login', { email, password });
      
      // Guardar token en localStorage
      if (result.access_token && typeof window !== 'undefined') {
        localStorage.setItem('access_token', result.access_token);
      }
      
      // Guardar datos del usuario
      if (result.user) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(result.user));
        }
        setUser(result.user);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al iniciar sesión';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (firstName: string, lastName: string, email: string, password: string, role: string) => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.post('/auth/register', {
        firstName,
        lastName,
        email,
        password,
        role,
      });
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al registrarse';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await apiClient.post('/auth/logout', {});
      setUser(null);
      setError(null);
      
      // Limpiar localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    } catch (err: any) {
      console.error('Error al cerrar sesión:', err);
      // Limpiar localStorage incluso si hay error
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    checkAuth,
    error,
  }), [user, loading, error]); // Solo estados, NO funciones

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}
