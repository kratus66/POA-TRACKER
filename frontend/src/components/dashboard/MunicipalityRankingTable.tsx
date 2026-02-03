'use client';

import { MunicipalityRanking } from '@/lib/types';

interface MunicipalityRankingTableProps {
  data: MunicipalityRanking[];
  maxRows?: number;
}

export default function MunicipalityRankingTable({ data, maxRows = 10 }: MunicipalityRankingTableProps) {
  const displayData = data.slice(0, maxRows);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Ranking de Municipios</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Posición
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Municipio
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Actividades
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cumplimiento
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                % Cumplimiento
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayData.map((municipality, index) => (
              <tr key={municipality.municipalityId} className={index < 3 ? 'bg-blue-50' : ''}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {index > 2 && `#${index + 1}`}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {municipality.municipalityName}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                  {municipality.totalActivities}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                  {municipality.cumplimiento}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <span className={`inline-flex text-xs font-semibold px-2 py-1 rounded-full ${
                    municipality.compliancePercentage >= 80 ? 'bg-green-100 text-green-800' :
                    municipality.compliancePercentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {municipality.compliancePercentage.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
