'use client';

import React, { useState, useRef } from 'react';
import { DocumentType } from '@/lib/types';

interface EvidenceUploadProps {
  reviewId: string;
  activityId: string;
  onUploadSuccess?: (evidence: any) => void;
  onError?: (error: string) => void;
}

export const EvidenceUpload: React.FC<EvidenceUploadProps> = ({
  reviewId,
  activityId,
  onUploadSuccess,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validar tamaño
    if (file.size > 50 * 1024 * 1024) {
      onError?.('Archivo muy grande (máximo 50 MB)');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('reviewId', reviewId);
      formData.append('activityId', activityId);
      if (description) {
        formData.append('description', description);
      }

      const response = await fetch('/api/evidences/upload', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al subir el archivo');
      }

      const evidence = await response.json();
      onUploadSuccess?.(evidence);
      setDescription('');
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${isLoading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isLoading}
        />

        <div className="flex flex-col items-center gap-3">
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              <p className="text-sm text-gray-600">Subiendo archivo...</p>
            </>
          ) : (
            <>
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                />
              </svg>
              <div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-500 hover:text-blue-700 font-medium"
                >
                  Haz clic para seleccionar un archivo
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  o arrastra y suelta aquí
                </p>
              </div>
              <p className="text-xs text-gray-400">
                PDF, Imagen, Excel, Word, Video, Audio (máx. 50 MB)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Descripción opcional */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción (opcional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ej: Comprobante de actividad realizada..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
          rows={3}
        />
      </div>
    </div>
  );
};
