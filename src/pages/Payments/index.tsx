import { FilterBar } from '@/components/common/FilterBar';
import PageHeader from '@/components/common/PageHeader';
import { PaymentForm } from '@/components/forms/PaymentForm';
import { filterFields, columns } from '@/data/payments';
import { TableAction } from '@/types';
import { PaymentFormData } from '@/schemas/payment';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetPayments } from '@/hooks/payments/useGetPayments';
import { useUpdatePaymentStatus } from '@/hooks/payments/useUpdatePaymentStatus';
import {
  PaymentsFilterParams,
  FreightPayment,
} from '@/services/payments/types';
import { useTableExport } from '@/hooks/useTableExport';
import { ExportColumn } from '@/helpers/exports';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataTable } from '@/components/tables/DataTable';
import { StatusBadge } from '@/components/tables/StatusBadge';

export default function Payments() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [editingPayment, setEditingPayment] = useState<FreightPayment | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);

  // Преобразуем фильтры в параметры API
  const apiParams: PaymentsFilterParams = useMemo(() => {
    const params: PaymentsFilterParams = {};
    if (filters.month) params.month = parseInt(filters.month);
    if (filters.year) params.year = parseInt(filters.year);
    if (filters.status) params.status = filters.status;
    if (filters.freightId) params.freightId = filters.freightId;
    if (filters.driverId) params.driverId = filters.driverId;
    if (filters.search) params.search = filters.search;
    return params;
  }, [filters]);

  // Получаем данные из API
  const {
    data: paymentsResponse,
    isLoading,
    error,
  } = useGetPayments(apiParams);

  // Хук для обновления статуса платежа
  const updatePaymentStatusMutation = useUpdatePaymentStatus();

  const paymentsData = useMemo(
    () => (paymentsResponse as unknown as FreightPayment[]) || [],
    [paymentsResponse]
  );

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Обработка изменения статуса платежа
  const handlePaymentStatusChange = (paymentId: string, newStatus: string) => {
    console.log('Изменение статуса платежа:', { paymentId, newStatus });
    updatePaymentStatusMutation.mutate({
      paymentId,
      status: newStatus as
        | 'PENDING'
        | 'PAID'
        | 'PARTIAL'
        | 'OVERDUE'
        | 'CANCELLED',
    });
  };

  // Конфигурация статусов
  const statusConfig = useMemo(
    () => ({
      PENDING: { label: 'В ожидании', color: 'yellow' as const },
      PAID: { label: 'Оплачено', color: 'green' as const },
      PARTIAL: { label: 'Частично оплачено', color: 'blue' as const },
      OVERDUE: { label: 'Просрочено', color: 'red' as const },
      CANCELLED: { label: 'Отменено', color: 'gray' as const },
    }),
    []
  );

  // Конфигурация колонок для экспорта
  const exportColumns: ExportColumn[] = [
    { key: 'id', label: 'ID', width: 15 },
    { key: 'freightNumber', label: 'Номер фрахта', width: 20 },
    { key: 'driver.firstName', label: 'Имя водителя', width: 15 },
    { key: 'driver.lastName', label: 'Фамилия водителя', width: 15 },
    { key: 'driver.phone', label: 'Телефон водителя', width: 20 },
    { key: 'driver.email', label: 'Email водителя', width: 25 },
    { key: 'totalAmount', label: 'Общая сумма', width: 15 },
    { key: 'paidAmount', label: 'Оплачено', width: 15 },
    { key: 'remainingAmount', label: 'Остаток', width: 15 },
    { key: 'status', label: 'Статус', width: 15 },
    {
      key: 'payments.0.expectedPaymentDate',
      label: 'Ожидаемая дата оплаты',
      width: 20,
    },
    {
      key: 'payments.0.actualPaymentDate',
      label: 'Фактическая дата оплаты',
      width: 20,
    },
    { key: 'payments.0.amount', label: 'Сумма платежа', width: 15 },
    { key: 'payments.0.currency', label: 'Валюта', width: 10 },
    { key: 'payments.0.status', label: 'Статус платежа', width: 15 },
    { key: 'payments.0.notes', label: 'Примечания к платежу', width: 30 },
    { key: 'freight.loadingCode', label: 'Код загрузки', width: 15 },
    { key: 'freight.countries', label: 'Страны маршрута', width: 15 },
    { key: 'freight.contractorString', label: 'Контрагент', width: 25 },
    { key: 'createdAt', label: 'Дата создания', width: 20 },
    { key: 'updatedAt', label: 'Дата обновления', width: 20 },
  ];

  // Действия для таблицы
  const getTableActions = (): TableAction[] => [
    {
      key: 'view',
      label: 'Просмотр',
      onClick: (row) => console.log('Просмотр платежа:', row),
    },
    {
      key: 'pay',
      label: 'Оплатить',
      onClick: (row) => navigate(`/payments/create/${row.freightId}`),
      variant: 'success',
    },
    {
      key: 'edit',
      label: 'Редактировать',
      onClick: (row) => {
        setEditingPayment(row);
        setIsEditing(true);
      },
    },
  ];

  // Обработка данных для экспорта
  const processedDataForExport = useMemo(() => {
    return paymentsData.map((payment: FreightPayment) => ({
      ...payment,
      // Форматируем статусы для читаемости
      status:
        statusConfig[payment.status as keyof typeof statusConfig]?.label ||
        payment.status,
      'payments.0.status': payment.payments[0]
        ? statusConfig[payment.payments[0].status as keyof typeof statusConfig]
            ?.label || payment.payments[0].status
        : '',
      // Форматируем даты
      'payments.0.expectedPaymentDate': payment.payments[0]?.expectedPaymentDate
        ? new Date(payment.payments[0].expectedPaymentDate).toLocaleDateString(
            'ru-RU'
          )
        : '',
      'payments.0.actualPaymentDate': payment.payments[0]?.actualPaymentDate
        ? new Date(payment.payments[0].actualPaymentDate).toLocaleDateString(
            'ru-RU'
          )
        : '',
      createdAt: payment.payments[0]?.createdAt
        ? new Date(payment.payments[0].createdAt).toLocaleDateString('ru-RU')
        : '',
      updatedAt: payment.payments[0]?.updatedAt
        ? new Date(payment.payments[0].updatedAt).toLocaleDateString('ru-RU')
        : '',
      // Форматируем суммы
      totalAmount: payment.totalAmount
        ? `${payment.totalAmount} ${payment.payments[0]?.currency || ''}`
        : '',
      paidAmount: payment.paidAmount
        ? `${payment.paidAmount} ${payment.payments[0]?.currency || ''}`
        : '',
      remainingAmount: payment.remainingAmount
        ? `${payment.remainingAmount} ${payment.payments[0]?.currency || ''}`
        : '',
      'payments.0.amount': payment.payments[0]?.amount
        ? `${payment.payments[0].amount} ${payment.payments[0].currency}`
        : '',
    }));
  }, [paymentsData, statusConfig]);

  // Формируем заголовок с информацией о фильтрах
  const getExportTitle = () => {
    const activeFilters = Object.entries(filters)
      .filter(([, value]) => value && value.trim() !== '')
      .map(([key, value]) => {
        const filterField = filterFields.find((f) => f.key === key);
        return `${filterField?.label || key}: ${value}`;
      });

    let title = 'Отчет по платежам';
    if (activeFilters.length > 0) {
      title += ` (Фильтры: ${activeFilters.join(', ')})`;
    }
    return title;
  };

  // Хук для экспорта
  const { handleExportXLSX, handleExportPDF } = useTableExport({
    data: processedDataForExport,
    columns: exportColumns,
    filename: 'payments',
    title: getExportTitle(),
    totalRecords: paymentsData.length,
  });

  // Функция обработки отправки формы оплаты
  const handlePaymentSubmit = (data: PaymentFormData) => {
    // TODO: Implement payment update logic
    console.log('Payment data:', data);
    setIsEditing(false);
    setEditingPayment(null);
  };

  // Функция отмены редактирования
  const handlePaymentCancel = () => {
    setIsEditing(false);
    setEditingPayment(null);
  };

  // Кастомные колонки для отображения данных
  const updatedColumns = columns.map((column) => {
    if (column.key === 'driver') {
      return {
        ...column,
        render: (_value: unknown, row: FreightPayment) => (
          <div className="text-sm">
            <div className="font-medium">
              {row.driver.firstName} {row.driver.lastName}
            </div>
            <div className="text-gray-500 text-xs">{row.driver.phone}</div>
          </div>
        ),
      };
    }
    if (column.key === 'status') {
      return {
        ...column,
        render: (value: string) => (
          <StatusBadge status={value} config={statusConfig} />
        ),
      };
    }
    if (column.key === 'expectedPaymentDate') {
      return {
        ...column,
        render: (_value: unknown, row: FreightPayment) => (
          <div className="text-sm">
            {row.payments.length > 0 ? (
              <span className="font-medium">
                {new Date(
                  row.payments[0].expectedPaymentDate
                ).toLocaleDateString()}
              </span>
            ) : (
              <span className="text-gray-500">-</span>
            )}
          </div>
        ),
      };
    }
    if (column.key === 'paymentAmount') {
      return {
        ...column,
        render: (_value: unknown, row: FreightPayment) => (
          <div className="text-sm">
            {row.payments.length > 0 ? (
              <span className="font-medium">
                {row.payments[0].amount} {row.payments[0].currency}
              </span>
            ) : (
              <span className="text-gray-500">-</span>
            )}
          </div>
        ),
      };
    }
    if (column.key === 'paymentStatus') {
      return {
        ...column,
        render: (_value: unknown, row: FreightPayment) => (
          <div className="text-sm">
            {row.payments.length > 0 ? (
              <Select
                value={row.payments[0].status}
                onValueChange={(value) =>
                  handlePaymentStatusChange(row.payments[0].id, value)
                }
                disabled={updatePaymentStatusMutation.isPending}
              >
                <SelectTrigger className="w-[140px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      В ожидании
                    </div>
                  </SelectItem>
                  <SelectItem value="PAID">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Оплачено
                    </div>
                  </SelectItem>
                  <SelectItem value="PARTIAL">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Частично оплачено
                    </div>
                  </SelectItem>
                  <SelectItem value="OVERDUE">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Просрочено
                    </div>
                  </SelectItem>
                  <SelectItem value="CANCELLED">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      Отменено
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <span className="text-gray-500">-</span>
            )}
          </div>
        ),
      };
    }
    if (
      column.key === 'totalAmount' ||
      column.key === 'paidAmount' ||
      column.key === 'remainingAmount'
    ) {
      return {
        ...column,
        render: (value: string | number) => (
          <span className="text-sm font-medium">{value}</span>
        ),
      };
    }
    if (column.key === 'freightNumber') {
      return {
        ...column,
        render: (value: string) => (
          <span className="text-sm font-medium">{value}</span>
        ),
      };
    }
    return column;
  });

  // Если редактируем платеж, показываем форму
  if (isEditing && editingPayment) {
    const initialData = {
      amount: editingPayment.payments[0]?.amount || '',
      paidAmount: editingPayment.payments[0]?.paidAmount || '',
      expectedPaymentDate:
        editingPayment.payments[0]?.expectedPaymentDate || '',
      actualPaymentDate: editingPayment.payments[0]?.actualPaymentDate || '',
      currency: editingPayment.payments[0]?.currency || '',
      notes: editingPayment.payments[0]?.notes || '',
    };

    return (
      <PaymentForm
        onSubmit={handlePaymentSubmit}
        onCancel={handlePaymentCancel}
        initialData={initialData}
        isLoading={false}
      />
    );
  }

  return (
    <div>
      <PageHeader title="Оплаты" />

      <FilterBar
        filters={filterFields}
        values={filters}
        onChange={handleFilterChange}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Загрузка данных...</div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">Ошибка загрузки данных</div>
        </div>
      ) : paymentsData.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">
            Нет данных для отображения
          </div>
        </div>
      ) : (
        <DataTable
          columns={updatedColumns}
          data={paymentsData}
          actions={getTableActions()}
          statusConfig={statusConfig}
          dateStatusConfig={false}
          onExportXLSX={handleExportXLSX}
          onExportPDF={handleExportPDF}
          pagination={{
            current: 1,
            total: 1,
            pageSize: 20,
            onPageChange: (page) => console.log('Страница:', page),
            onPageSizeChange: (size) => console.log('Размер страницы:', size),
          }}
        />
      )}
    </div>
  );
}
