import { FilterBar } from '@/components/common/FilterBar';
import PageHeader from '@/components/common/PageHeader';
import { DataTable } from '@/components/tables/DataTable';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';
import { columns, filterFields } from '@/data/trailers';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetTrailers } from '@/hooks/trailers/useGetTrailers';
import { useDeleteTrailer } from '@/hooks/trailers/useDeleteTrailer';
import { Trailer as TrailerType } from '@/services/trailers/types';
import { TrailerFilterParams } from '@/services/trailers';

interface TrailerItem {
  id: string;
  num_trailer: string;
  vin: string;
  insuranceTo: string;
  technicalInspectionTo: string;
  notes: string;
  status: string;
  // Дополнительные поля для статусов дат
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
const mapTrailerToTableItem = (trailer: TrailerType): TrailerItem => {
  const statusMap = {
    IN_ROUTE: 'В РЕЙСЕ',
    ON_BASE: 'На базе',
    IN_REPAIR: 'В ремонте',
  };

  // Отладочная информация для проверки данных
  console.log('Mapping trailer:', {
    id: trailer.id,
    registrationNumber: trailer.registrationNumber,
    notes: trailer.notes,
    notesRu: trailer.notes?.ru,
    notesPl: trailer.notes?.pl,
  });

  // Улучшенная обработка примечаний
  let notes = 'Нет примечаний';
  if (trailer.notes) {
    if (trailer.notes.ru && trailer.notes.ru.trim()) {
      notes = trailer.notes.ru.trim();
    } else if (trailer.notes.pl && trailer.notes.pl.trim()) {
      notes = trailer.notes.pl.trim();
    }
  }

  const mappedItem = {
    id: trailer.id,
    num_trailer: trailer.registrationNumber,
    vin: trailer.vinNumber,
    insuranceTo: trailer.insuranceTo,
    technicalInspectionTo: trailer.technicalInspectionTo,
    notes: notes,
    status: statusMap[trailer.status] || trailer.status,
    // Добавляем статусы дат для дополнительной обработки
    insurance_status: getDateStatus(trailer.insuranceTo),
    technical_inspection_status: getDateStatus(trailer.technicalInspectionTo),
  };

  console.log('Mapped item:', mappedItem);
  return mappedItem;
};

// Функция для маппинга UI фильтров в API параметры
const mapUIFiltersToAPI = (
  uiFilters: Record<string, string>
): TrailerFilterParams => {
  const apiParams: TrailerFilterParams = {
    page: 1,
    limit: 10,
  };

  // Теперь ключи фильтров соответствуют API параметрам
  if (uiFilters.registrationNumber) {
    apiParams.registrationNumber = uiFilters.registrationNumber;
  }
  if (uiFilters.status) {
    apiParams.status = uiFilters.status; // Значения уже в формате API (IN_ROUTE, ON_BASE, IN_REPAIR)
  }

  return apiParams;
};

export default function Trailers() {
  const [uiFilters, setUIFilters] = useState<Record<string, string>>({});
  const [debouncedFilters, setDebouncedFilters] = useState<
    Record<string, string>
  >({});
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const navigate = useNavigate();

  // Debounce для registrationNumber (500ms задержка)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(uiFilters);
    }, 500);

    return () => clearTimeout(timer);
  }, [uiFilters]);

  // Сбрасываем страницу при изменении debounced фильтров
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [debouncedFilters]);

  // Преобразуем debounced фильтры в API параметры
  const apiFilters = useMemo(() => {
    return {
      ...mapUIFiltersToAPI(debouncedFilters),
      ...pagination,
    };
  }, [debouncedFilters, pagination]);

  // Получаем данные прицепов из API с фильтрами
  const {
    data: trailersResponse,
    isLoading,
    error,
  } = useGetTrailers(apiFilters);

  // Хук для удаления прицепа
  const {
    isModalOpen,
    trailerToDelete,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
  } = useDeleteTrailer();

  // Отладочная информация
  console.log('API Filters:', apiFilters);
  console.log('UI Filters (immediate):', uiFilters);
  console.log('Debounced Filters (for API):', debouncedFilters);
  console.log('Pagination:', pagination);
  console.log('trailersResponse:', trailersResponse);

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
    // Страница будет сброшена автоматически через useEffect при изменении debouncedFilters
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
    if (!trailersResponse?.data || !Array.isArray(trailersResponse.data))
      return [];
    return trailersResponse.data.map(mapTrailerToTableItem);
  }, [trailersResponse?.data]);

  const statusConfig = {
    'В РЕЙСЕ': { label: 'В РЕЙСЕ', color: 'green' as const },
    'На базе': { label: 'На базе', color: 'yellow' as const },
    'В ремонте': { label: 'В ремонте', color: 'red' as const },
  };

  const handleAddTrailer = () => {
    navigate('/transport/trailers/new');
  };

  const getTableActions = () => {
    return [
      {
        key: 'edit',
        label: 'Редактировать прицеп',
        onClick: (item: TrailerItem) => {
          console.log('Navigating to edit trailer with ID:', item.id);
          navigate(`/transport/trailers/edit/${item.id}`);
        },
      },
      {
        key: 'delete',
        label: 'Удалить прицеп',
        onClick: (item: TrailerItem) => {
          console.log(
            'Opening delete modal for trailer:',
            item.id,
            'Number:',
            item.num_trailer
          );
          openDeleteModal(item.id, `${item.num_trailer} (VIN: ${item.vin})`);
        },
      },
    ];
  };

  // Обработка состояний загрузки и ошибок

  if (error) {
    return (
      <div>
        <PageHeader title="Прицепы" onAdd={handleAddTrailer} />
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
    trailersResponse?.data && Array.isArray(trailersResponse.data);

  if (!isLoading && !hasValidData) {
    return (
      <div>
        <PageHeader title="Прицепы" onAdd={handleAddTrailer} />
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
      <PageHeader title="Прицепы" onAdd={handleAddTrailer} />

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
          current: trailersResponse?.meta?.page || 1,
          total: trailersResponse?.meta?.totalPages || 1,
          pageSize: trailersResponse?.meta?.limit || 10,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange,
        }}
      />

      {/* Диалог подтверждения удаления */}
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Удалить прицеп"
        description={`Вы уверены, что хотите удалить прицеп "${trailerToDelete.name}"? Это действие нельзя отменить.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
