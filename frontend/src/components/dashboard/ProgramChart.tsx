'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ProgramBreakdown } from '@/lib/types';

interface ProgramChartProps {
  data: ProgramBreakdown[];
}

export default function ProgramChart({ data }: ProgramChartProps) {
  const chartData = data.map(item => ({
    name: item.programName,
    Total: item.totalActivities,
    Cumplimiento: item.cumplimiento,
    percentage: item.compliancePercentage,
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Cumplimiento por Programa</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Total" fill="#3b82f6" />
          <Bar dataKey="Cumplimiento" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
