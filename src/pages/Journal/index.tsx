import { FilterBar } from '@/components/common/FilterBar';
import PageHeader from '@/components/common/PageHeader';
import { DataTable } from '@/components/tables/DataTable';
import { StatusBadge } from '@/components/tables/StatusBadge';
import { filterFields, columns } from '@/data/journal';
import { StatusConfig, TableAction } from '@/types';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetIncidentLogs } from '@/hooks/incident-logs/useGetIncidentLogs';
import { useGetFreights } from '@/hooks/freights/useGetFreights';
import { useTableExport } from '@/hooks/useTableExport';
import { ExportColumn } from '@/helpers/exports';
import {
  IncidentLogsFilterParams,
  IncidentLog,
} from '@/services/incident-logs/types';

export default function Journal() {
  const navigate = useNavigate();

  const handleAddEntry = () => {
    navigate('/journal/new');
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Конфигурация типов для журнала
  const typeConfig: StatusConfig = useMemo(
    () => ({
      FUEL: {
        label: 'ТОПЛИВО',
        color: 'green',
      },
      FINE: {
        label: 'ШТРАФ',
        color: 'red',
      },
      REPAIR: {
        label: 'РЕМОНТ',
        color: 'red',
      },
      ADDITIONAL: {
        label: 'ДОПОЛНИТЕЛЬНО',
        color: 'blue',
      },
      ROAD: {
        label: 'ДОРОГИ',
        color: 'gray',
      },
    }),
    []
  );

  // Конфигурация финансовой нагрузки
  const financialBurdenConfig: StatusConfig = useMemo(
    () => ({
      ON_DRIVER: {
        label: 'НА ВОДИТЕЛЕ',
        color: 'red',
      },
      ON_COMPANY: {
        label: 'НА КОМПАНИИ',
        color: 'green',
      },
    }),
    []
  );

  const [filters, setFilters] = useState<Record<string, string>>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
  });

  // Загружаем список фрахтов для селекта
  const { data: freightsResponse } = useGetFreights({ limit: 1000 }); // Загружаем много фрахтов для селекта

  const freightsData = useMemo(
    () => freightsResponse?.data?.data || [],
    [freightsResponse?.data?.data]
  );

  // Преобразование фильтров в параметры API
  const apiParams: IncidentLogsFilterParams = useMemo(() => {
    const params: IncidentLogsFilterParams = {
      page: pagination.page,
      limit: pagination.limit,
    };

    // Добавляем фильтры если они есть
    if (filters.incidentType) params.incidentType = filters.incidentType;
    if (filters.financialBurden)
      params.financialBurden = filters.financialBurden;
    if (filters.freightId) params.freightId = filters.freightId;
    if (filters.currency) params.currency = filters.currency;
    if (filters.search) params.search = filters.search;

    return params;
  }, [filters, pagination]);

  // API запрос для получения incident logs
  const {
    data: incidentLogsResponse,
    isLoading,
    error,
  } = useGetIncidentLogs(apiParams);

  const incidentLogsData = useMemo(
    () => incidentLogsResponse?.data?.data || [],
    [incidentLogsResponse?.data?.data]
  );
  const meta = incidentLogsResponse?.data?.meta;

  // Конфигурация колонок для экспорта
  const exportColumns: ExportColumn[] = [
    { key: 'id', label: 'ID', width: 15 },
    { key: 'freight.loadingCode', label: 'Код загрузки', width: 15 },
    { key: 'freight.countries', label: 'Страны маршрута', width: 15 },
    { key: 'freight.contractorString', label: 'Контрагент', width: 25 },
    { key: 'incidentDate', label: 'Дата происшествия', width: 20 },
    { key: 'incidentType', label: 'Тип инцидента', width: 15 },
    { key: 'description', label: 'Описание', width: 30 },
    { key: 'financialBurden', label: 'Финансовая нагрузка', width: 20 },
    { key: 'amount', label: 'Сумма', width: 15 },
    { key: 'currency', label: 'Валюта', width: 10 },
    { key: 'createdByUser.firstName', label: 'Имя создателя', width: 15 },
    { key: 'createdByUser.lastName', label: 'Фамилия создателя', width: 15 },
    { key: 'createdByUser.email', label: 'Email создателя', width: 25 },
    { key: 'notes', label: 'Примечания', width: 30 },
    { key: 'createdAt', label: 'Дата создания', width: 20 },
    { key: 'updatedAt', label: 'Дата обновления', width: 20 },
  ];

  // Обновляем фильтры с опциями фрахтов
  const updatedFilterFields = useMemo(() => {
    return filterFields.map((field) => {
      if (field.key === 'freightId') {
        return {
          ...field,
          options: freightsData.map((freight) => ({
            value: freight.id,
            label: `${freight.loadingCode} - ${freight.countries}`,
          })),
        };
      }
      return field;
    });
  }, [freightsData]);

  // Действия для таблицы
  const getTableActions = (): TableAction[] => [
    {
      key: 'view',
      label: 'Просмотр',
      onClick: (row) => navigate(`/journal/view/${row.id}`),
    },
    {
      key: 'edit',
      label: 'Редактировать',
      onClick: (row) => navigate(`/journal/edit/${row.id}`),
    },
  ];

  // Обработка данных для экспорта
  const processedDataForExport = useMemo(() => {
    return incidentLogsData.map((log) => ({
      ...log,
      // Форматируем статусы для читаемости
      incidentType:
        typeConfig[log.incidentType as keyof typeof typeConfig]?.label ||
        log.incidentType,
      financialBurden:
        financialBurdenConfig[
          log.financialBurden as keyof typeof financialBurdenConfig
        ]?.label || log.financialBurden,
      // Форматируем даты
      incidentDate: log.incidentDate
        ? new Date(log.incidentDate).toLocaleDateString('ru-RU')
        : '',
      createdAt: log.createdAt
        ? new Date(log.createdAt).toLocaleDateString('ru-RU')
        : '',
      updatedAt: log.updatedAt
        ? new Date(log.updatedAt).toLocaleDateString('ru-RU')
        : '',
      // Форматируем суммы
      amount: log.amount ? `${log.amount} ${log.currency}` : '',
    }));
  }, [incidentLogsData, typeConfig, financialBurdenConfig]);

  // Формируем заголовок с информацией о фильтрах
  const getExportTitle = () => {
    const activeFilters = Object.entries(filters)
      .filter(([, value]) => value && value.trim() !== '')
      .map(([key, value]) => {
        const filterField = filterFields.find((f) => f.key === key);
        return `${filterField?.label || key}: ${value}`;
      });

    let title = 'Отчет по журналу инцидентов';
    if (activeFilters.length > 0) {
      title += ` (Фильтры: ${activeFilters.join(', ')})`;
    }
    return title;
  };

  // Хук для экспорта
  const { handleExportXLSX, handleExportPDF } = useTableExport({
    data: processedDataForExport,
    columns: exportColumns,
    filename: 'journal',
    title: getExportTitle(),
    totalRecords: meta?.total || incidentLogsData.length,
  });

  // Обновленные колонки с кастомным рендерингом
  const updatedColumns = columns.map((column) => {
    if (column.key === 'incidentType') {
      return {
        ...column,
        render: (value: string) => (
          <StatusBadge status={value} config={typeConfig} />
        ),
      };
    }
    if (column.key === 'financialBurden') {
      return {
        ...column,
        render: (value: string) => (
          <StatusBadge status={value} config={financialBurdenConfig} />
        ),
      };
    }
    if (column.key === 'freight') {
      return {
        ...column,
        render: (_value: string, row: IncidentLog) => (
          <span className="text-sm">
            {row.freight.loadingCode} - {row.freight.countries}
          </span>
        ),
      };
    }
    if (column.key === 'amount') {
      return {
        ...column,
        render: (value: string, row: IncidentLog) => (
          <span className="text-sm">
            {value} {row.currency}
          </span>
        ),
      };
    }
    if (column.key === 'createdByUser') {
      return {
        ...column,
        render: (_value: string, row: IncidentLog) => (
          <span className="text-sm">
            {row.createdByUser.firstName} {row.createdByUser.lastName}
          </span>
        ),
      };
    }
    if (column.key === 'notes') {
      return {
        ...column,
        render: (value: string) => <span className="text-sm">{value}</span>,
      };
    }
    return column;
  });

  return (
    <div>
      <PageHeader title="Журнал" onAdd={handleAddEntry} />

      <FilterBar
        filters={updatedFilterFields}
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
          data={incidentLogsData}
          actions={getTableActions()}
          statusConfig={typeConfig}
          dateStatusConfig={false}
          onExportXLSX={handleExportXLSX}
          onExportPDF={handleExportPDF}
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
    </div>
  );
}
