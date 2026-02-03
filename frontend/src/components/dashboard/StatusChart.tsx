'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { StatusDistribution } from '@/lib/types';

interface StatusChartProps {
  data: StatusDistribution[];
}

const COLORS = {
  CUMPLE: '#10b981',
  NO_CUMPLE: '#ef4444',
  CUMPLE_PARCIALMENTE: '#f59e0b',
  PENDIENTE: '#6b7280',
};

const STATUS_LABELS = {
  CUMPLE: 'Cumple',
  NO_CUMPLE: 'No Cumple',
  CUMPLE_PARCIALMENTE: 'Cumple Parcialmente',
  PENDIENTE: 'Pendiente',
};

export default function StatusChart({ data }: StatusChartProps) {
  const chartData = data.map(item => ({
    name: STATUS_LABELS[item.status as keyof typeof STATUS_LABELS] || item.status,
    value: item.count,
    status: item.status,
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Distribución por Estado</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.status as keyof typeof COLORS] || '#6b7280'} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
