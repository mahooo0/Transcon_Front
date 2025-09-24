import { FilterBar } from '@/components/common/FilterBar';
import PageHeader from '@/components/common/PageHeader';
import { DataTable } from '@/components/tables/DataTable';
import { columns, filterFields } from '@/data/drivers';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetDrivers } from '@/hooks/drivers/useGetDrivers';
import { useDeleteDriver } from '@/hooks/drivers/useDeleteDriver';
import { DriversFilterParams, Driver } from '@/services/drivers/types';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';
import { StatusBadge } from '@/components/tables/StatusBadge';

export default function DriversPage() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [pagination, setPagination] = useState({ page: 1, limit: 20 });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    driverId: string | null;
    driverInfo: string;
  }>({
    isOpen: false,
    driverId: null,
    driverInfo: '',
  });
  const navigate = useNavigate();

  // Параметры для API
  const apiParams: DriversFilterParams = useMemo(() => {
    const params: DriversFilterParams = {
      page: pagination.page,
      limit: pagination.limit,
    };
    if (filters.status) params.status = filters.status;
    if (filters.contractStatus) params.contractStatus = filters.contractStatus;
    if (filters.search) params.search = filters.search;
    return params;
  }, [filters, pagination]);

  // Получение данных с API
  const { data: driversResponse, isLoading, error } = useGetDrivers(apiParams);
  const deleteDriverMutation = useDeleteDriver();

  const driversData = driversResponse?.data || [];
  const meta = driversResponse;

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Сброс на первую страницу при фильтрации
  };

  const handleExportXLSX = () => {
    console.log('Экспорт в XLSX');
  };

  const handleExportPDF = () => {
    console.log('Экспорт в PDF');
  };

  const statusConfig = {
    ON_BASE: { label: 'НА БАЗЕ', color: 'blue' as const },
    IN_ROUTE: { label: 'В РЕЙСЕ', color: 'green' as const },
    ON_LEAVE: { label: 'В ОТПУСКЕ', color: 'yellow' as const },
    INACTIVE: { label: 'НЕАКТИВЕН', color: 'red' as const },
  };

  const contractStatusConfig = {
    active: { label: 'АКТИВЕН', color: 'green' as const },
    expired: { label: 'ИСТЕК', color: 'red' as const },
    pending: { label: 'ОЖИДАНИЕ', color: 'yellow' as const },
  };

  const handleAddDriver = () => {
    navigate('/drivers/new');
  };

  const handleDeleteDriver = (driver: Driver) => {
    setDeleteModal({
      isOpen: true,
      driverId: driver.id,
      driverInfo: `${driver.firstName} ${driver.lastName} - ${driver.phone}`,
    });
  };

  const confirmDelete = () => {
    if (deleteModal.driverId) {
      deleteDriverMutation.mutate(deleteModal.driverId, {
        onSuccess: () => {
          setDeleteModal({
            isOpen: false,
            driverId: null,
            driverInfo: '',
          });
        },
      });
    }
  };

  const cancelDelete = () => {
    setDeleteModal({
      isOpen: false,
      driverId: null,
      driverInfo: '',
    });
  };

  // Обновленные колонки с кастомным рендерингом
  const updatedColumns = columns.map((column) => {
    if (column.key === 'name') {
      return {
        ...column,
        render: (_value: unknown, row: Driver) => (
          <span className="font-medium">
            {row.firstName} {row.lastName}
          </span>
        ),
      };
    }
    if (column.key === 'dailyRate') {
      return {
        ...column,
        render: (_value: unknown, row: Driver) => (
          <span className="text-sm">
            {row.dailyRate} {row.currency}
          </span>
        ),
      };
    }
    if (column.key === 'contractEndDate') {
      return {
        ...column,
        render: (value: string) => (
          <span className="text-sm">
            {new Date(value).toLocaleDateString()}
          </span>
        ),
      };
    }
    if (column.key === 'contractStatus') {
      return {
        ...column,
        render: (value: string) => (
          <StatusBadge status={value} config={contractStatusConfig} />
        ),
      };
    }
    if (column.key === 'daysUntilExpiration') {
      return {
        ...column,
        render: (value: number) => (
          <span
            className={`text-sm font-medium ${
              value < 30
                ? 'text-red-600'
                : value < 90
                  ? 'text-yellow-600'
                  : 'text-green-600'
            }`}
          >
            {value} дней
          </span>
        ),
      };
    }
    return column;
  });

  const getTableActions = () => {
    return [
      {
        key: 'edit',
        label: 'Редактировать водителя',
        onClick: (driver: Driver) => {
          navigate(`/drivers/edit/${driver.id}`);
        },
      },
      {
        key: 'delete',
        label: 'Удалить водителя',
        onClick: (driver: Driver) => {
          handleDeleteDriver(driver);
        },
        variant: 'danger' as const,
      },
    ];
  };
  return (
    <>
      <PageHeader title="Водители" onAdd={handleAddDriver} />

      <FilterBar
        filters={filterFields}
        values={filters}
        onChange={handleFilterChange}
      />

      {isLoading ? (
        <div className="bg-gradient-to-r from-white to-slate-50 rounded-2xl shadow-lg shadow-slate-200/20 border border-slate-200/60 backdrop-blur-sm p-8">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg text-slate-600">
              Загрузка данных...
            </span>
          </div>
        </div>
      ) : error ? (
        <div className="bg-gradient-to-r from-white to-slate-50 rounded-2xl shadow-lg shadow-slate-200/20 border border-slate-200/60 backdrop-blur-sm p-8">
          <div className="flex justify-center items-center">
            <span className="text-lg text-red-600">Ошибка загрузки данных</span>
          </div>
        </div>
      ) : (driversData as Driver[]).length === 0 ? (
        <div className="bg-gradient-to-r from-white to-slate-50 rounded-2xl shadow-lg shadow-slate-200/20 border border-slate-200/60 backdrop-blur-sm p-8">
          <div className="flex justify-center items-center">
            <span className="text-lg text-slate-600">
              Нет данных для отображения
            </span>
          </div>
        </div>
      ) : (
        <DataTable
          columns={updatedColumns}
          data={driversData as Driver[]}
          actions={getTableActions()}
          statusConfig={statusConfig}
          onExportXLSX={handleExportXLSX}
          onExportPDF={handleExportPDF}
          pagination={{
            current: meta?.page || 1,
            total: meta?.totalPages || 1,
            pageSize: meta?.limit || 20,
            onPageChange: (page) =>
              setPagination((prev) => ({ ...prev, page })),
            onPageSizeChange: (size) =>
              setPagination((prev) => ({ ...prev, limit: size, page: 1 })),
          }}
        />
      )}

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Подтверждение удаления"
        description={`Вы уверены, что хотите удалить водителя ${deleteModal.driverInfo}? Это действие нельзя отменить.`}
        isLoading={deleteDriverMutation.isPending}
      />
    </>
  );
}
