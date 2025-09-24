/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { FileDown } from 'lucide-react';
import { TableColumn, TableAction, StatusConfig } from '@/types';
import { StatusBadge } from '../StatusBadge';
import TablePagination from '../TablePagination';
import ActionsDropdown from '../ActionDropdown';
import { Button } from '@/components/ui/button';
import { DateStatusBadge } from '../DateStatusBadge';

interface DataTableProps {
  columns: TableColumn[];
  data: any[];
  actions?: TableAction[];
  statusConfig?: StatusConfig;
  dateStatusConfig?: boolean;
  onExportXLSX?: () => void;
  onExportPDF?: () => void;
  onRowClick?: (row: any) => void;
  pagination?: {
    current: number;
    total: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  };
  className?: string;
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  actions,
  statusConfig,
  dateStatusConfig,
  onExportXLSX,
  onExportPDF,
  onRowClick,
  pagination,
  className = 'w-full',
}) => {
  const renderCellContent = (column: TableColumn, row: any) => {
    const value = row[column.key];

    if (column.render) {
      return (
        <td className={`px-6 py-4 text-sm text-slate-900 `} key={column.key}>
          {column.render(value, row)}
        </td>
      );
    }

    if (column.key === 'status' && statusConfig) {
      return (
        <td key={column.key} className="px-6 py-4 text-sm text-slate-900">
          <StatusBadge status={value} config={statusConfig} />
        </td>
      );
    }
    if (column.key.includes('To') && dateStatusConfig) {
      return <DateStatusBadge value={value} />;
    }

    return (
      <td key={column.key} className="px-6 py-4 text-sm text-slate-900">
        {value === null ? 'Нет данных' : value}
      </td>
    );
  };

  return (
    <div className="bg-gradient-to-r from-white to-slate-50 rounded-2xl shadow-lg shadow-slate-200/20 border border-slate-200/60 backdrop-blur-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className={` ${className}`}>
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200/60">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-left text-sm font-semibold text-slate-700"
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700 w-16">
                  Действия
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/60">
            {data.map((row, index) => (
              <tr
                key={index}
                className="hover:bg-slate-50/50 transition-all duration-200"
              >
                {columns.map((column) => renderCellContent(column, row))}
                {actions && actions.length > 0 && (
                  <td className="px-6 py-4 text-right">
                    <ActionsDropdown
                      onRowClick={onRowClick}
                      actions={actions}
                      row={row}
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-slate-200/60 bg-gradient-to-r from-slate-50/50 to-white flex justify-between items-center">
        <div className="flex gap-3">
          {onExportXLSX && (
            <Button
              onClick={onExportXLSX}
              className="flex items-center gap-2 px-4 py-2.5 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105"
            >
              <FileDown size={14} />
              Export XLSX
            </Button>
          )}
          {onExportPDF && (
            <Button
              onClick={onExportPDF}
              className="flex items-center gap-2 px-4 py-2.5 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105"
            >
              <FileDown size={14} />
              Export PDF
            </Button>
          )}
        </div>

        {pagination && <TablePagination pagination={pagination} />}
      </div>
    </div>
  );
};
