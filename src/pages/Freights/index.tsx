import { FilterBar } from '@/components/common/FilterBar';
import PageHeader from '@/components/common/PageHeader';
import { DataTable } from '@/components/tables/DataTable';
import { StatusBadge } from '@/components/tables/StatusBadge';
import { filterFields, columns } from '@/data/freights';
import { StatusConfig, TableAction } from '@/types';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetFreights } from '@/hooks/freights/useGetFreights';
import { useDeleteFreight } from '@/hooks/freights/useDeleteFreight';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';
import { useTableExport } from '@/hooks/useTableExport';
import { ExportColumn } from '@/helpers/exports';
import {
  FreightFilterParams,
  Driver,
  Truck,
  Trailer,
  Freight,
} from '@/services/freights';

export default function Freights() {
  const navigate = useNavigate();
  const deleteFreightMutation = useDeleteFreight();

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    freightId: string | null;
    freightInfo: string;
  }>({
    isOpen: false,
    freightId: null,
    freightInfo: '',
  });

  const handleAddFreight = () => {
    navigate('/freights/new');
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleDeleteFreight = (freight: Freight) => {
    setDeleteModal({
      isOpen: true,
      freightId: freight.id,
      freightInfo: `Груз ${freight.loadingCode} - ${freight.countries}`,
    });
  };

  const confirmDelete = () => {
    if (deleteModal.freightId) {
      deleteFreightMutation.mutate(deleteModal.freightId, {
        onSuccess: () => {
          setDeleteModal({
            isOpen: false,
            freightId: null,
            freightInfo: '',
          });
        },
      });
    }
  };

  const cancelDelete = () => {
    setDeleteModal({
      isOpen: false,
      freightId: null,
      freightInfo: '',
    });
  };

  // Конфигурация статусов для грузов
  const statusConfig: StatusConfig = useMemo(
    () => ({
      PLANNED: {
        label: 'ЗАПЛАНИРОВАНО',
        color: 'green',
      },
      IN_ROUTE: {
        label: 'В ДОРОГЕ',
        color: 'yellow',
      },
      DELAYED: {
        label: 'ОПОЗДАНИЕ',
        color: 'red',
      },
    }),
    []
  );

  // Конфигурация статусов оплаты
  const paymentStatusConfig: StatusConfig = useMemo(
    () => ({
      PAID: {
        label: 'ОПЛАЧЕНО',
        color: 'green',
      },
      PENDING: {
        label: 'В ОЖИДАНИИ',
        color: 'yellow',
      },
      PARTIAL: {
        label: 'НЕ ПОЛНАЯ',
        color: 'gray',
      },
      OVERDUE: {
        label: 'ОПОЗДАНИЕ',
        color: 'red',
      },
    }),
    []
  );

  const [filters, setFilters] = useState<Record<string, string>>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
  });

  // Преобразование фильтров в параметры API
  const apiParams: FreightFilterParams = useMemo(() => {
    const params: FreightFilterParams = {
      page: pagination.page,
      limit: pagination.limit,
    };

    // Добавляем фильтры если они есть
    if (filters.status) params.status = filters.status;
    if (filters.driverId) params.driverId = parseInt(filters.driverId);
    if (filters.truckId) params.truckId = parseInt(filters.truckId);
    if (filters.trailerId) params.trailerId = parseInt(filters.trailerId);
    if (filters.contractorString)
      params.contractorString = filters.contractorString;
    if (filters.countryFrom) params.countryFrom = filters.countryFrom;
    if (filters.countryTo) params.countryTo = filters.countryTo;
    if (filters.search) params.search = filters.search;
    if (filters.dateFrom) params.dateFrom = filters.dateFrom;
    if (filters.dateTo) params.dateTo = filters.dateTo;

    return params;
  }, [filters, pagination]);

  // API запрос для получения грузов
  const {
    data: freightsResponse,
    isLoading,
    error,
  } = useGetFreights(apiParams);

  const freightsData = useMemo(
    () => freightsResponse?.data?.data || [],
    [freightsResponse?.data?.data]
  );
  const meta = freightsResponse?.data?.meta;

  // Конфигурация колонок для экспорта
  const exportColumns: ExportColumn[] = [
    { key: 'id', label: 'ID', width: 15 },
    { key: 'loadingDate', label: 'Дата загрузки', width: 20 },
    { key: 'unloadingDate', label: 'Дата выгрузки', width: 20 },
    { key: 'status', label: 'Статус', width: 15 },
    { key: 'driver.firstName', label: 'Имя водителя', width: 15 },
    { key: 'driver.lastName', label: 'Фамилия водителя', width: 15 },
    { key: 'driver.phone', label: 'Телефон водителя', width: 20 },
    { key: 'truck.registrationNumber', label: 'Номер тягача', width: 15 },
    { key: 'truck.brand', label: 'Марка тягача', width: 15 },
    { key: 'truck.model', label: 'Модель тягача', width: 15 },
    { key: 'trailer.registrationNumber', label: 'Номер прицепа', width: 15 },
    { key: 'trailer.vinNumber', label: 'VIN прицепа', width: 20 },
    { key: 'countries', label: 'Страны маршрута', width: 15 },
    { key: 'kilometers', label: 'Километры', width: 12 },
    { key: 'ratePerKm', label: 'Ставка за км', width: 12 },
    { key: 'totalAmount', label: 'Общая сумма', width: 15 },
    { key: 'contractorString', label: 'Контрагент', width: 25 },
    { key: 'logist', label: 'Логист', width: 15 },
    { key: 'paymentStatus', label: 'Статус оплаты', width: 15 },
    { key: 'expectedPaymentDate', label: 'Дата ожидаемой оплаты', width: 20 },
    { key: 'loadingCode', label: 'Код загрузки', width: 15 },
    { key: 'unloadingCode', label: 'Код выгрузки', width: 15 },
    { key: 'general', label: 'Примечания', width: 30 },
  ];

  // Обработка данных для экспорта
  const processedDataForExport = useMemo(() => {
    return freightsData.map((freight) => ({
      ...freight,
      // Форматируем статусы для читаемости
      status:
        statusConfig[freight.status as keyof typeof statusConfig]?.label ||
        freight.status,
      paymentStatus:
        paymentStatusConfig[
          freight.paymentStatus as keyof typeof paymentStatusConfig
        ]?.label || freight.paymentStatus,
      // Форматируем даты
      loadingDate: freight.loadingDate
        ? new Date(freight.loadingDate).toLocaleDateString('ru-RU')
        : '',
      unloadingDate: freight.unloadingDate
        ? new Date(freight.unloadingDate).toLocaleDateString('ru-RU')
        : '',
      expectedPaymentDate: freight.expectedPaymentDate
        ? new Date(freight.expectedPaymentDate).toLocaleDateString('ru-RU')
        : '',
      // Форматируем суммы
      totalAmount: freight.totalAmount
        ? `${freight.totalAmount} ${freight.currency}`
        : '',
      ratePerKm: freight.ratePerKm
        ? `${freight.ratePerKm} ${freight.currency}/км`
        : '',
    }));
  }, [freightsData, statusConfig, paymentStatusConfig]);

  // Формируем заголовок с информацией о фильтрах
  const getExportTitle = () => {
    const activeFilters = Object.entries(filters)
      .filter(([, value]) => value && value.trim() !== '')
      .map(([key, value]) => {
        const filterField = filterFields.find((f) => f.key === key);
        return `${filterField?.label || key}: ${value}`;
      });

    let title = 'Отчет по грузам';
    if (activeFilters.length > 0) {
      title += ` (Фильтры: ${activeFilters.join(', ')})`;
    }
    return title;
  };

  // Хук для экспорта
  const { handleExportXLSX, handleExportPDF } = useTableExport({
    data: processedDataForExport,
    columns: exportColumns,
    filename: 'freights',
    title: getExportTitle(),
    totalRecords: meta?.total || freightsData.length,
  });

  // Действия для таблицы
  const getTableActions = (): TableAction[] => [
    {
      key: 'view',
      label: 'Просмотр',
      onClick: (row) => navigate(`/freights/view/${row.id}`),
    },
    {
      key: 'edit',
      label: 'Редактировать',
      onClick: (row) => navigate(`/freights/edit/${row.id}`),
    },
    {
      key: 'delete',
      label: 'Удалить',
      onClick: (row) => handleDeleteFreight(row),
      variant: 'danger',
    },
  ];

  // Обновленные колонки с кастомным рендерингом
  const updatedColumns = columns.map((column) => {
    if (column.key === 'status') {
      return {
        ...column,
        render: (value: string) => (
          <StatusBadge status={value} config={statusConfig} />
        ),
      };
    }
    if (column.key === 'paymentStatus') {
      return {
        ...column,
        render: (value: string) => (
          <StatusBadge status={value} config={paymentStatusConfig} />
        ),
      };
    }
    if (column.key === 'driver') {
      return {
        ...column,
        render: (value: Driver) => (
          <span className="text-sm">
            {value?.firstName} {value?.lastName}
          </span>
        ),
      };
    }
    if (column.key === 'truck') {
      return {
        ...column,
        render: (value: Truck) => (
          <span className="text-sm">{value?.registrationNumber}</span>
        ),
      };
    }
    if (column.key === 'trailer') {
      return {
        ...column,
        render: (value: Trailer) => (
          <span className="underline text-blue-600 cursor-pointer hover:text-blue-800 text-sm">
            {value?.registrationNumber}
          </span>
        ),
      };
    }
    if (column.key === 'loadingDate') {
      return {
        ...column,
        render: (_value: string, row: Freight) => (
          <span className="text-sm">
            {row.loadingDate} - {row.unloadingDate}
          </span>
        ),
      };
    }
    if (column.key === 'countries') {
      return {
        ...column,
        render: (value: string) => <span className="text-sm">{value}</span>,
      };
    }
    if (column.key === 'amount') {
      return {
        ...column,
        render: (value: string, row: Freight) => (
          <span className="text-sm">
            {value} {row.currency}
          </span>
        ),
      };
    }
    return column;
  });

  return (
    <div>
      <PageHeader title="Грузы" onAdd={handleAddFreight} />

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
      ) : (
        <DataTable
          columns={updatedColumns}
          data={freightsData}
          actions={getTableActions()}
          statusConfig={statusConfig}
          dateStatusConfig={false}
          onExportXLSX={handleExportXLSX}
          onExportPDF={handleExportPDF}
          className="w-screen"
          pagination={{
            current: meta?.page || pagination.page,
            total: meta?.totalPages || 1,
            pageSize: meta?.limit || pagination.limit,
            onPageChange: (page) =>
              setPagination((prev) => ({ ...prev, page })),
            onPageSizeChange: (size) =>
              setPagination((prev) => ({ ...prev, limit: size, page: 1 })),
          }}
        />
      )}

      {/* Модальное окно подтверждения удаления */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Подтверждение удаления"
        description={`Вы уверены, что хотите удалить ${deleteModal.freightInfo}? Это действие нельзя отменить.`}
        isLoading={deleteFreightMutation.isPending}
      />
    </div>
  );
}
