'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';

interface KPI {
  cumple: number;
  noCumple: number;
  noAplica: number;
  pendiente: number;
  total: number;
  cumplePercentage: number;
  noCumplePercentage: number;
  noAplicaPercentage: number;
  pendientePercentage: number;
}

interface ReportData {
  kpis: KPI;
  totalReviews: number;
  totalValidations: number;
}

export default function ReportsPage() {
  const [semester, setSemester] = useState(1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [report, setReport] = useState<ReportData | null>(null);
  const [municipalityReport, setMunicipalityReport] = useState<any>(null);
  const [selectedView, setSelectedView] = useState<'global' | 'municipality' | 'agreement'>('global');
  const [loading, setLoading] = useState(false);
  const [municipalities, setMunicipalities] = useState<any[]>([]);
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('');

  useEffect(() => {
    fetchReports();
  }, [semester, year]);

  useEffect(() => {
    if (selectedMunicipality && selectedView === 'municipality') {
      fetchMunicipalityReport();
    }
  }, [selectedMunicipality]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');

      // Fetch Global Report
      const globalResponse = await fetch(
        `http://localhost:4000/reports/summary?semester=${semester}&year=${year}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (globalResponse.ok) {
        const data = await globalResponse.json();
        setReport(data);
      }

      // Fetch Municipalities
      const municipalitiesResponse = await fetch(
        'http://localhost:4000/municipalities',
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (municipalitiesResponse.ok) {
        const data = await municipalitiesResponse.json();
        setMunicipalities(data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMunicipalityReport = async () => {
    if (!selectedMunicipality) return;

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `http://localhost:4000/reports/municipality/${selectedMunicipality}?semester=${semester}&year=${year}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setMunicipalityReport(data);
      }
    } catch (error) {
      console.error('Error fetching municipality report:', error);
    }
  };

  const renderKPICards = (kpis: KPI) => {
    const cards = [
      {
        title: '✅ Cumple',
        value: kpis.cumple,
        percentage: kpis.cumplePercentage,
        color: 'bg-green-50 border-green-200',
        textColor: 'text-green-700',
        barColor: 'bg-green-500',
      },
      {
        title: '❌ No Cumple',
        value: kpis.noCumple,
        percentage: kpis.noCumplePercentage,
        color: 'bg-red-50 border-red-200',
        textColor: 'text-red-700',
        barColor: 'bg-red-500',
      },
      {
        title: 'N/A No Aplica',
        value: kpis.noAplica,
        percentage: kpis.noAplicaPercentage,
        color: 'bg-gray-50 border-gray-200',
        textColor: 'text-gray-700',
        barColor: 'bg-gray-500',
      },
      {
        title: '⏳ Pendiente',
        value: kpis.pendiente,
        percentage: kpis.pendientePercentage,
        color: 'bg-yellow-50 border-yellow-200',
        textColor: 'text-yellow-700',
        barColor: 'bg-yellow-500',
      },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, idx) => (
          <div key={idx} className={`${card.color} border rounded-lg p-6`}>
            <h3 className={`${card.textColor} font-semibold mb-2`}>
              {card.title}
            </h3>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {card.value}
            </div>
            <div className="flex items-center justify-between">
              <span className={`${card.textColor} text-sm`}>
                {card.percentage.toFixed(1)}%
              </span>
            </div>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div
                className={`${card.barColor} h-2 rounded-full`}
                style={{ width: `${card.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSummaryCard = (kpis: KPI, totalReviews: number, totalValidations: number) => {
    const complianceRate = kpis.total > 0 ? ((kpis.cumple / kpis.total) * 100).toFixed(1) : 0;

    return (
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Resumen General</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-gray-600 text-sm mb-2">Total de Revisiones</p>
            <p className="text-4xl font-bold text-blue-600">{totalReviews}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-2">Total de Validaciones</p>
            <p className="text-4xl font-bold text-purple-600">{totalValidations}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-2">Tasa de Cumplimiento</p>
            <p className="text-4xl font-bold text-green-600">{complianceRate}%</p>
          </div>
        </div>
      </div>
    );
  };

  const renderChartBar = (label: string, value: number, max: number, color: string) => {
    const percentage = (value / max) * 100;
    return (
      <div key={label} className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm font-semibold text-gray-900">{value}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`${color} h-3 rounded-full transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              📊 Reportes y Estadísticas
            </h1>
            <p className="mt-2 text-gray-600">
              Visualiza el cumplimiento del POA por semestre
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Filtros</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Semestre
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1">1º Semestre (Enero - Junio)</option>
                  <option value="2">2º Semestre (Julio - Diciembre)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Año
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[2024, 2025, 2026, 2027].map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vista
                </label>
                <select
                  value={selectedView}
                  onChange={(e) =>
                    setSelectedView(
                      e.target.value as 'global' | 'municipality' | 'agreement',
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="global">Vista Global</option>
                  <option value="municipality">Por Municipio</option>
                </select>
              </div>

              {selectedView === 'municipality' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Municipio
                  </label>
                  <select
                    value={selectedMunicipality}
                    onChange={(e) => setSelectedMunicipality(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecciona municipio</option>
                    {municipalities.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Cargando reportes...
            </div>
          ) : selectedView === 'global' && report ? (
            <>
              {renderKPICards(report.kpis)}
              {renderSummaryCard(report.kpis, report.totalReviews, report.totalValidations)}
            </>
          ) : selectedView === 'municipality' && municipalityReport ? (
            <>
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Reporte del Municipio
                </h2>
                {renderKPICards(municipalityReport.kpis)}
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500">
                Selecciona los filtros para ver el reporte
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
