'use client';

import { CommitmentsPanel as CommitmentsPanelType } from '@/lib/types';

interface CommitmentsPanelProps {
  data: CommitmentsPanelType;
}

export default function CommitmentsPanel({ data }: CommitmentsPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Panel de Compromisos</h3>
      
      <div className="space-y-6">
        {/* Semestre Actual */}
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-3">Semestre Actual</h4>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-blue-700">{data.currentSemester.total}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
              <p className="text-sm text-gray-600">Abiertos</p>
              <p className="text-2xl font-bold text-yellow-700">{data.currentSemester.open}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
              <p className="text-sm text-gray-600">Cerrados</p>
              <p className="text-2xl font-bold text-green-700">{data.currentSemester.closed}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
              <p className="text-sm text-gray-600">Vencidos</p>
              <p className="text-2xl font-bold text-red-700">{data.currentSemester.overdue}</p>
            </div>
          </div>
        </div>

        {/* Semestre Anterior (Arrastre) */}
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-3">Semestre Anterior (Arrastre)</h4>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-400">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-700">{data.previousSemester.total}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-400">
              <p className="text-sm text-gray-600">Abiertos</p>
              <p className="text-2xl font-bold text-gray-700">{data.previousSemester.open}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-400">
              <p className="text-sm text-gray-600">Cerrados</p>
              <p className="text-2xl font-bold text-gray-700">{data.previousSemester.closed}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-400">
              <p className="text-sm text-gray-600">Vencidos</p>
              <p className="text-2xl font-bold text-gray-700">{data.previousSemester.overdue}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
