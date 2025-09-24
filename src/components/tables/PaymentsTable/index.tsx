import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { TableAction } from '@/types';
import { FileDown } from 'lucide-react';
import ActionsDropdown from '../ActionDropdown';
import TablePagination from '../TablePagination';

interface PaymentData {
  id: string;
  freight: string;
  counterparty: string;
  amount: string;
  currency: string;
  paymentDate: string;
  paymentStatus: string;
  dueDate: string;
  description: string;
}

interface PaymentsTableProps {
  data: PaymentData[];
  onStatusChange: (id: string, newStatus: string) => void;
  onExportXLSX: () => void;
  onExportPDF: () => void;
  actions?: TableAction[];
  pagination?: {
    current: number;
    total: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  };
}

export default function PaymentsTable({
  data,
  onStatusChange,
  onExportXLSX,
  onExportPDF,
  actions = [],
  pagination,
}: PaymentsTableProps) {
  const handleStatusChange = (id: string, newStatus: string) => {
    onStatusChange(id, newStatus);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  const formatAmount = (amount: string, currency: string) => {
    return `${amount} ${currency}`;
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'paid':
        return { text: 'Оплачено', className: 'text-green-600' };
      case 'not_paid':
        return { text: 'Не оплачено', className: 'text-red-600' };
      case 'partial':
        return { text: 'Частично', className: 'text-orange-600' };
      case 'pending':
        return { text: 'В ожидании', className: 'text-blue-600' };
      case 'overdue':
        return { text: 'Опоздание', className: 'text-red-700' };
      default:
        return { text: status, className: 'text-gray-600' };
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                ID
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Фрахт
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Контрагент
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Сумма
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Валюта
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Дата оплаты
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Статус оплаты
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Срок оплаты
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Описание
              </th>
              {actions && actions.length > 0 && (
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 w-16">
                  Действия
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{row.id}</td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {row.freight}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {row.counterparty}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {formatAmount(row.amount, row.currency)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {row.currency}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {formatDate(row.paymentDate)}
                </td>
                <td className="px-4 py-3 text-sm">
                  <Select
                    defaultValue={row.paymentStatus}
                    onValueChange={(value) => handleStatusChange(row.id, value)}
                    onOpenChange={() => {}}
                  >
                    <SelectTrigger
                      className="w-40 border-gray-300 rounded-lg !h-[30px] !max-h-[30px] !p-1"
                      size="sm"
                    >
                      <SelectValue className="!px-1 !py-1 flex items-center">
                        <span
                          className={
                            getStatusDisplay(row.paymentStatus).className
                          }
                        >
                          {getStatusDisplay(row.paymentStatus).text}
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid" className="text-green-600">
                        Оплачено
                      </SelectItem>
                      <SelectItem value="not_paid" className="text-red-600">
                        Не оплачено
                      </SelectItem>
                      <SelectItem value="partial" className="text-orange-600">
                        Частично
                      </SelectItem>
                      <SelectItem value="pending" className="text-blue-600">
                        В ожидании
                      </SelectItem>
                      <SelectItem value="overdue" className="text-red-700">
                        Опоздание
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {formatDate(row.dueDate)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {row.description}
                </td>
                {actions && actions.length > 0 && (
                  <td className="px-4 py-3 text-right">
                    <ActionsDropdown actions={actions} row={row} />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 border-t border-gray-200 flex justify-between items-center">
        <div className="flex gap-2">
          {onExportXLSX && (
            <Button
              onClick={onExportXLSX}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FileDown size={14} />
              Export XLSX
            </Button>
          )}
          {onExportPDF && (
            <Button
              onClick={onExportPDF}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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
}
