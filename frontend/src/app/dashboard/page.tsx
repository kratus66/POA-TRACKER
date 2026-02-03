'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import KPICard from '@/components/dashboard/KPICard';
import StatusChart from '@/components/dashboard/StatusChart';
import ProgramChart from '@/components/dashboard/ProgramChart';
import MunicipalityRankingTable from '@/components/dashboard/MunicipalityRankingTable';
import CommitmentsPanel from '@/components/dashboard/CommitmentsPanel';
import {
  DashboardKPIs,
  StatusDistribution,
  ProgramBreakdown,
  MunicipalityRanking,
  CommitmentsPanel as CommitmentsPanelType,
} from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function DashboardPage() {
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [statusData, setStatusData] = useState<StatusDistribution[]>([]);
  const [programData, setProgramData] = useState<ProgramBreakdown[]>([]);
  const [municipalityData, setMunicipalityData] = useState<MunicipalityRanking[]>([]);
  const [commitmentsData, setCommitmentsData] = useState<CommitmentsPanelType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtros
  const [year, setYear] = useState(new Date().getFullYear());
  const [semester, setSemester] = useState(Math.ceil((new Date().getMonth() + 1) / 6));

  useEffect(() => {
    fetchDashboardData();
  }, [year, semester]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const params = { year, semester };

      const [kpisRes, statusRes, programRes, municipalityRes, commitmentsRes] = await Promise.all([
        axios.get(`${API_URL}/dashboard/kpis`, { headers, params }),
        axios.get(`${API_URL}/dashboard/status-distribution`, { headers, params }),
        axios.get(`${API_URL}/dashboard/by-program`, { headers, params }),
        axios.get(`${API_URL}/dashboard/municipality-ranking`, { headers, params }),
        axios.get(`${API_URL}/dashboard/commitments-panel`, { headers, params }),
      ]);

      setKpis(kpisRes.data);
      setStatusData(statusRes.data);
      setProgramData(programRes.data);
      setMunicipalityData(municipalityRes.data);
      setCommitmentsData(commitmentsRes.data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar datos del dashboard');
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard POA</h1>
          <p className="text-gray-600 mt-2">Análisis y métricas de cumplimiento</p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                {[2024, 2025, 2026].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semestre</label>
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>Semestre 1</option>
                <option value={2}>Semestre 2</option>
              </select>
            </div>
            <button
              onClick={fetchDashboardData}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Actualizar
            </button>
          </div>
        </div>

        {/* KPIs */}
        {kpis && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <KPICard
              title="Total Actividades"
              value={kpis.totalActivities}
              icon="📊"
              color="blue"
            />
            <KPICard
              title="Cumplimiento"
              value={`${kpis.compliancePercentage.toFixed(1)}%`}
              icon="✅"
              color="green"
            />
            <KPICard
              title="Pendientes"
              value={kpis.pendingActivities}
              icon="⏳"
              color="orange"
            />
            <KPICard
              title="Compromisos Abiertos"
              value={kpis.openCommitments}
              icon="📝"
              color="purple"
            />
          </div>
        )}

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <StatusChart data={statusData} />
          <ProgramChart data={programData} />
        </div>

        {/* Compromisos Panel */}
        {commitmentsData && (
          <div className="mb-6">
            <CommitmentsPanel data={commitmentsData} />
          </div>
        )}

        {/* Ranking Municipios */}
        <MunicipalityRankingTable data={municipalityData} maxRows={15} />
      </div>
    </div>
  );
}
