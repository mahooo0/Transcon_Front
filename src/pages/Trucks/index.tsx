import { FilterBar } from '@/components/common/FilterBar';
import PageHeader from '@/components/common/PageHeader';
import { DataTable } from '@/components/tables/DataTable';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';
import { columns, filterFields } from '@/data/trucks';
import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetTrucks } from '@/hooks/trucks/useGetTracks';
import { useDeleteTruck } from '@/hooks/trucks/useDeleteTruck';
import { Trucks as TruckType } from '@/services/trucks/types';
import { TrucksFilterParams } from '@/services/trucks';

interface TransportItem {
  id: string;
  num_car: string;
  mark: string;
  vin: string;
  insuranceTo: string;
  technicalInspectionTo: string;
  notes: string;
  status: string;
  // Дополнительные поля для статусов дат (для будущего использования)
  insurance_status?: 'active' | 'expiring' | 'expired';
  technical_inspection_status?: 'active' | 'expiring' | 'expired';
}

// Функция для определения статуса даты
const getDateStatus = (
  dateString: string
): 'active' | 'expiring' | 'expired' => {
  if (!dateString) return 'expired';

  const date = new Date(dateString);

  // Проверяем валидность даты
  if (isNaN(date.getTime())) return 'expired';

  const today = new Date();
  // Сбрасываем время для корректного сравнения дат
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'expired';
  if (diffDays <= 30) return 'expiring';
  return 'active';
};

// Функция для маппинга данных API к формату таблицы
const mapTruckToTableItem = (truck: TruckType): TransportItem => {
  const statusMap = {
    IN_ROUTE: 'В РЕЙСЕ',
    ON_BASE: 'На базе',
    IN_REPAIR: 'В ремонте',
  };

  return {
    id: truck.id,
    num_car: truck.registrationNumber,
    mark: `${truck.brand} ${truck.model}`,
    vin: truck.vinNumber,
    insuranceTo: truck.insuranceTo,
    technicalInspectionTo: truck.technicalInspectionTo,
    notes: truck.notes?.ru || truck.notes?.pl || '',
    status: statusMap[truck.status] || truck.status,
    // Добавляем статусы дат для дополнительной обработки
    insurance_status: getDateStatus(truck.insuranceTo),
    technical_inspection_status: getDateStatus(truck.technicalInspectionTo),
  };
};

// Функция для маппинга UI фильтров в API параметры
const mapUIFiltersToAPI = (
  uiFilters: Record<string, string>
): TrucksFilterParams => {
  const apiParams: TrucksFilterParams = {
    page: 1,
    limit: 10,
  };

  // Маппинг UI ключей в API ключи
  if (uiFilters.num_car) {
    apiParams.registrationNumber = uiFilters.num_car;
  }
  if (uiFilters.mark) {
    apiParams.brand = uiFilters.mark;
  }
  if (uiFilters.status) {
    // Маппинг русских статусов в API статусы
    const statusMap: Record<string, string> = {
      'В РЕЙСЕ': 'IN_ROUTE',
      'На базе': 'ON_BASE',
      'В ремонте': 'IN_REPAIR',
    };
    apiParams.status = statusMap[uiFilters.status] || uiFilters.status;
  }

  return apiParams;
};

export default function Trucks() {
  const [uiFilters, setUIFilters] = useState<Record<string, string>>({});
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const navigate = useNavigate();

  // Преобразуем UI фильтры в API параметры
  const apiFilters = useMemo(() => {
    return {
      ...mapUIFiltersToAPI(uiFilters),
      ...pagination,
    };
  }, [uiFilters, pagination]);

  // Получаем данные грузовиков из API с фильтрами
  const { data: trucksResponse, isLoading, error } = useGetTrucks(apiFilters);

  // Хук для удаления грузовика
  const {
    isModalOpen,
    truckToDelete,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
  } = useDeleteTruck();

  // Отладочная информация для понимания структуры данных
  console.log('API Filters:', apiFilters);
  console.log('UI Filters:', uiFilters);
  console.log('Pagination:', pagination);
  console.log('trucksResponse:', trucksResponse);
  console.log('trucksResponse?.data:', trucksResponse?.data);
  console.log('trucksResponse?.meta:', trucksResponse?.meta);
  console.log(
    'Is trucksResponse.data an array:',
    Array.isArray(trucksResponse?.data)
  );

  const handleFilterChange = useCallback((key: string, value: string) => {
    console.log('Filter changed:', { key, value });
    setUIFilters((prev) => {
      const newFilters = { ...prev };
      if (value) {
        newFilters[key] = value;
      } else {
        delete newFilters[key];
      }
      return newFilters;
    });
    // Сбрасываем страницу при изменении фильтров
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    console.log('Page changed to:', page);
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    console.log('Page size changed to:', size);
    setPagination({ page: 1, limit: size });
  }, []);

  const handleExportXLSX = () => {
    console.log('Экспорт в XLSX');
  };

  const handleExportPDF = () => {
    console.log('Экспорт в PDF');
  };

  // Преобразуем данные API в формат таблицы (серверная фильтрация)
  const tableData = useMemo(() => {
    if (!trucksResponse?.data || !Array.isArray(trucksResponse.data)) return [];
    return trucksResponse.data.map(mapTruckToTableItem);
  }, [trucksResponse?.data]);

  const statusConfig = {
    'В РЕЙСЕ': { label: 'В РЕЙСЕ', color: 'green' as const },
    'На базе': { label: 'На базе', color: 'yellow' as const },
    'В ремонте': { label: 'В ремонте', color: 'red' as const },
  };

  const handleAddTruck = () => {
    navigate('/transport/trucks/new');
  };

  const getTableActions = () => {
    return [
      {
        key: 'edit',
        label: 'Редактировать грузовик',
        onClick: (item: TransportItem) => {
          console.log('Navigating to edit truck with ID:', item.id);
          navigate(`/transport/trucks/edit/${item.id}`);
        },
      },
      {
        key: 'delete',
        label: 'Удалить грузовик',
        onClick: (item: TransportItem) => {
          console.log(
            'Opening delete modal for truck:',
            item.id,
            'Number:',
            item.num_car
          );
          openDeleteModal(item.id, `${item.num_car} (${item.mark})`);
        },
      },
    ];
  };



  if (error) {
    return (
      <div>
        <PageHeader title="Грузовики" onAdd={handleAddTruck} />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">
            Ошибка при загрузке данных: {error.message}
          </div>
        </div>
      </div>
    );
  }

  // Проверяем наличие данных и их корректную структуру
  const hasValidData =
    trucksResponse?.data && Array.isArray(trucksResponse.data);

  if (!isLoading && !hasValidData) {
    return (
      <div>
        <PageHeader title="Грузовики" onAdd={handleAddTruck} />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">
            Нет данных для отображения
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Грузовики" onAdd={handleAddTruck} />

      <FilterBar
        filters={filterFields}
        values={uiFilters}
        onChange={handleFilterChange}
      />
      <DataTable
        columns={columns}
        data={tableData}
        actions={getTableActions()}
        statusConfig={statusConfig}
        dateStatusConfig={true}
        onExportXLSX={handleExportXLSX}
        onExportPDF={handleExportPDF}
        pagination={{
          current: trucksResponse?.meta?.page || 1,
          total: trucksResponse?.meta?.totalPages || 1,
          pageSize: trucksResponse?.meta?.limit || 10,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange,
        }}
      />

      {/* Диалог подтверждения удаления */}
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Удалить грузовик"
        description={`Вы уверены, что хотите удалить грузовик "${truckToDelete.name}"? Это действие нельзя отменить.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
