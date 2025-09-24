import { FilterBar } from '@/components/common/FilterBar';
import PageHeader from '@/components/common/PageHeader';
import { DataTable } from '@/components/tables/DataTable';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';
import { columns, filterFields } from '@/data/extraTransport';
import { useGetExtraTransport } from '@/hooks/extraTransport/use-api-extra-transposrt';
import { useDeleteExtraTransportModal } from '@/hooks/extraTransport/useDeleteExtraTransport';
import { useTableExport } from '@/hooks/useTableExport';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface TransportItem {
  id: string;
  registrationNumber: string;
  name: string;
  type: string;
  insuranceFrom: string;
  insuranceTo: string;
  technicalInspectionFrom: string;
  technicalInspectionTo: string;
  notes: string;
  photos: string[];
}

interface FilterParams {
  search?: string;
  type?: string;
  page?: number;
  limit?: number;
}

// Конфигурация колонок для экспорта
const exportColumns = [
  { key: 'registrationNumber', label: 'Номер', width: 20 },
  { key: 'name', label: 'Название', width: 25 },
  { key: 'type', label: 'Марка', width: 20 },
  { key: 'insuranceTo', label: 'Страховка до', width: 15 },
  { key: 'technicalInspectionTo', label: 'Техосмотр до', width: 15 },
  { key: 'notes', label: 'Примечания', width: 30 },
];

export default function AdditionalTransport() {
  const [filters, setFilters] = useState<FilterParams>({
    page: 1,
    limit: 10,
  });
  const navigate = useNavigate();

  const { data: extraTransport } = useGetExtraTransport(filters);
  const {
    isDeleteModalOpen,
    itemToDelete,
    openDeleteModal,
    closeDeleteModal,
    handleDeleteConfirm,
    isDeleting,
  } = useDeleteExtraTransportModal();

  // Используем хук для экспорта
  const { handleExportXLSX, handleExportPDF } = useTableExport({
    data: extraTransport?.data || [],
    columns: exportColumns,
    filename: 'additional-transport',
    title: 'Дополнительный транспорт',
    totalRecords: extraTransport?.meta?.total || 0,
  });

  console.log('extraTransport', extraTransport);
  console.log('filters', filters);

  const handleFilterChange = useCallback((key: string, value: string) => {
    console.log('Filter changed:', { key, value });
    setFilters((prev) => {
      const newFilters = { ...prev };
      if (value) {
        (newFilters as Record<string, string>)[key] = value;
      } else {
        delete (newFilters as Record<string, string>)[key];
      }
      // Сбрасываем страницу при изменении фильтров
      newFilters.page = 1;
      return newFilters;
    });
  }, []);

  const statusConfig = {
    'В РЕЙСЕ': { label: 'В РЕЙСЕ', color: 'green' as const },
    'На базе': { label: 'На базе', color: 'yellow' as const },
    'В ремонте': { label: 'В ремонте', color: 'red' as const },
  };

  const handleAddExtraTransport = () => {
    navigate('/transport/extra/new');
  };

  const getTableActions = () => {
    return [
      {
        key: 'edit',
        label: 'Редактировать транспорт',
        variant: 'primary' as const,
        onClick: (item: TransportItem) => {
          navigate(`/transport/extra/edit/${item.id}`);
        },
      },
      {
        key: 'delete',
        label: 'Удалить транспорт',
        variant: 'danger' as const,
        onClick: (item: TransportItem) => {
          openDeleteModal(item.id, item.name);
        },
      },
    ];
  };

  const handlePageChange = (page: number) => {
    console.log('Page changed to:', page);
    setFilters((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size: number) => {
    console.log('Page size changed to:', size);
    setFilters((prev) => ({ ...prev, limit: size, page: 1 }));
  };

  return (
    <div>
      <PageHeader
        title="Дополнительный транспорт"
        onAdd={handleAddExtraTransport}
      />

      <FilterBar
        filters={filterFields}
        values={filters}
        onChange={handleFilterChange}
      />
      <DataTable
        columns={columns}
        data={extraTransport?.data || []}
        actions={getTableActions()}
        statusConfig={statusConfig}
        dateStatusConfig={true}
        onExportXLSX={handleExportXLSX}
        onExportPDF={handleExportPDF}
        pagination={{
          current: filters.page || 1,
          total: extraTransport?.meta?.totalPages || 1,
          pageSize: filters.limit || 10,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange,
        }}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        title="Удалить дополнительный транспорт"
        description={`Вы уверены, что хотите удалить транспорт "${itemToDelete?.name}"? Это действие нельзя отменить.`}
        isLoading={isDeleting}
      />
    </div>
  );
}
