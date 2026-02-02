import React from 'react';

export interface EditableColumn<T> {
  key: keyof T;
  label: string;
  type?: 'text' | 'number' | 'select' | 'date';
  options?: { value: string; label: string }[];
  editable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

interface EditableTableProps<T> {
  data: T[];
  columns: EditableColumn<T>[];
  onEdit?: (item: T, index: number) => void;
  onSave?: (item: T, index: number) => Promise<void>;
  onDelete?: (item: T, index: number) => void;
  editingId?: string;
  setEditingId?: (id: string | null) => void;
  formData?: Partial<T>;
  setFormData?: (data: Partial<T>) => void;
  saving?: boolean;
  rowId?: keyof T;
}

export const EditableTable = <T extends any>({
  data,
  columns,
  onEdit,
  onSave,
  onDelete,
  editingId,
  setEditingId,
  formData,
  setFormData,
  saving,
  rowId = 'id' as keyof T,
}: EditableTableProps<T>) => {
  const handleEdit = (item: T, index: number) => {
    if (onEdit) {
      onEdit(item, index);
    }
    if (setEditingId && rowId) {
      setEditingId(item[rowId] as string);
    }
  };

  const handleSave = async (item: T, index: number) => {
    if (onSave) {
      await onSave(item, index);
    }
    if (setEditingId) {
      setEditingId(null);
    }
  };

  const renderCell = (column: EditableColumn<T>, value: any, row: T, isEditing: boolean) => {
    if (column.render && !isEditing) {
      return column.render(value, row);
    }

    if (!isEditing || !column.editable) {
      return <span>{value}</span>;
    }

    // Render edit input
    switch (column.type) {
      case 'select':
        return (
          <select
            value={formData?.[column.key] as string || ''}
            onChange={(e) =>
              setFormData && setFormData({ ...formData, [column.key]: e.target.value })
            }
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="">Selecciona</option>
            {column.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      case 'number':
        return (
          <input
            type="number"
            value={formData?.[column.key] as number || ''}
            onChange={(e) =>
              setFormData && setFormData({ ...formData, [column.key]: parseFloat(e.target.value) as any })
            }
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          />
        );
      case 'date':
        return (
          <input
            type="date"
            value={formData?.[column.key] as string || ''}
            onChange={(e) =>
              setFormData && setFormData({ ...formData, [column.key]: e.target.value as any })
            }
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          />
        );
      default:
        return (
          <input
            type="text"
            value={formData?.[column.key] as string || ''}
            onChange={(e) =>
              setFormData && setFormData({ ...formData, [column.key]: e.target.value as any })
            }
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          />
        );
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => {
            const isEditing = editingId && rowId && item[rowId] === editingId;
            return (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {renderCell(column, item[column.key], item, Boolean(isEditing))}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(formData as T, index)}
                          disabled={saving}
                          className="text-green-600 hover:text-green-900 disabled:text-gray-400"
                        >
                          ✓ Guardar
                        </button>
                        <button
                          onClick={() => setEditingId && setEditingId(null)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          ✕ Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        {onEdit && (
                          <button
                            onClick={() => handleEdit(item, index)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            ✏️ Editar
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item, index)}
                            className="text-red-600 hover:text-red-900"
                          >
                            🗑️ Eliminar
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
