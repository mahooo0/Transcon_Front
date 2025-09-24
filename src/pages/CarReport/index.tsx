import React, { useState } from 'react';
import { DataTable } from '@/components/tables/DataTable';
import PageHeader from '@/components/common/PageHeader';
import { FilterBar } from '@/components/common/FilterBar';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { FinanceCharts } from '@/components/charts/FinanceCharts';
import { useGetTruckFinancials } from '@/hooks/trucks/useGetTruckFinancials';
import { TruckFinancials } from '@/services/trucks/financials-types';
import { StatusBadge } from '@/components/tables/StatusBadge';
import { useTableExport } from '@/hooks/useTableExport';
import { ExportColumn } from '@/helpers/exports';

// Интерфейсы теперь импортируются из services

interface ChartData {
  day: string;
  lightBlue: number;
  darkBlue: number;
}

interface TableColumn {
  key: string;
  label: string;
  width?: string;
}

interface FilterField {
  key: string;
  label: string;
  type: 'text' | 'date' | 'select';
  placeholder: string;
  options?: { value: string; label: string }[];
}

// Данные теперь получаются из API

// Данные для графиков
const incomeData: ChartData[] = [
  { day: 'Mon', lightBlue: 60, darkBlue: 40 },
  { day: 'Tue', lightBlue: 50, darkBlue: 50 },
  { day: 'Wed', lightBlue: 70, darkBlue: 30 },
  { day: 'Thu', lightBlue: 20, darkBlue: 80 },
  { day: 'Fri', lightBlue: 50, darkBlue: 50 },
  { day: 'Sat', lightBlue: 60, darkBlue: 40 },
];

const expensesData: ChartData[] = [
  { day: 'Mon', lightBlue: 70, darkBlue: 30 },
  { day: 'Tue', lightBlue: 60, darkBlue: 40 },
  { day: 'Wed', lightBlue: 80, darkBlue: 20 },
  { day: 'Thu', lightBlue: 20, darkBlue: 80 },
  { day: 'Fri', lightBlue: 60, darkBlue: 40 },
  { day: 'Sat', lightBlue: 70, darkBlue: 30 },
];

const profitData: ChartData[] = [
  { day: 'Mon', lightBlue: 60, darkBlue: 40 },
  { day: 'Tue', lightBlue: 50, darkBlue: 50 },
  { day: 'Wed', lightBlue: 70, darkBlue: 30 },
  { day: 'Thu', lightBlue: 20, darkBlue: 80 },
  { day: 'Fri', lightBlue: 60, darkBlue: 40 },
  { day: 'Sat', lightBlue: 70, darkBlue: 30 },
];

// Поля фильтрации для грузовиков
const filterFields: FilterField[] = [
  {
    key: 'registrationNumber',
    label: 'Регистрационный номер',
    type: 'text',
    placeholder: 'Поиск по номеру',
  },
  {
    key: 'brand',
    label: 'Марка',
    type: 'text',
    placeholder: 'Поиск по марке',
  },
  {
    key: 'model',
    label: 'Модель',
    type: 'text',
    placeholder: 'Поиск по модели',
  },
  {
    key: 'status',
    label: 'Статус',
    type: 'select',
    placeholder: 'Статус',
    options: [
      { value: 'ON_BASE', label: 'На базе' },
      { value: 'IN_ROUTE', label: 'В пути' },
      { value: 'IN_REPAIR', label: 'В ремонте' },
      { value: 'INACTIVE', label: 'Неактивный' },
    ],
  },
];

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200"
      >
        <h2 className="text-lg font-semibold text-purple-800">{title}</h2>
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-purple-600" />
        ) : (
          <ChevronRight className="w-5 h-5 text-purple-600" />
        )}
      </button>

      {isOpen && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default function CarReport() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [isChartsOpen, setIsChartsOpen] = useState(true);

  // Получаем данные финансов грузовиков
  const {
    data: trucksFinancialsResponse,
    isLoading,
    error,
  } = useGetTruckFinancials();

  console.log(
    'CarReport - trucksFinancialsResponse:',
    trucksFinancialsResponse
  );
  console.log('CarReport - isLoading:', isLoading);
  console.log('CarReport - error:', error);

  const trucksData: TruckFinancials[] = trucksFinancialsResponse ?? [];
  console.log('CarReport - trucksData:', trucksData);
  console.log('CarReport - trucksData length:', trucksData.length);

  // Определение колонок для экспорта
  const exportColumns: ExportColumn[] = [
    { key: 'registrationNumber', label: 'Регистрационный номер', width: 20 },
    { key: 'brand', label: 'Марка', width: 15 },
    { key: 'model', label: 'Модель', width: 15 },
    { key: 'status', label: 'Статус', width: 12 },
    { key: 'totalFreights', label: 'Всего рейсов', width: 12 },
    { key: 'totalRevenue', label: 'Общий доход', width: 15 },
    { key: 'totalDriverSalary', label: 'Зарплата водителя', width: 15 },
    { key: 'totalIncidentsCost', label: 'Стоимость инцидентов', width: 18 },
    { key: 'totalProfit', label: 'Общая прибыль', width: 15 },
    {
      key: 'averageProfitPerFreight',
      label: 'Средняя прибыль за рейс',
      width: 20,
    },
  ];

  // Определение колонок для таблицы грузовиков
  const tableColumns: TableColumn[] = [
    {
      key: 'registrationNumber',
      label: 'Регистрационный номер',
      width: '180px',
    },
    { key: 'brand', label: 'Марка', width: '120px' },
    { key: 'model', label: 'Модель', width: '120px' },
    { key: 'status', label: 'Статус', width: '120px' },
    { key: 'totalFreights', label: 'Всего рейсов', width: '120px' },
    { key: 'totalRevenue', label: 'Общий доход', width: '150px' },
    { key: 'totalDriverSalary', label: 'Зарплата водителя', width: '150px' },
    {
      key: 'totalIncidentsCost',
      label: 'Стоимость инцидентов',
      width: '150px',
    },
    { key: 'totalProfit', label: 'Общая прибыль', width: '150px' },
    {
      key: 'averageProfitPerFreight',
      label: 'Средняя прибыль за рейс',
      width: '180px',
    },
  ];

  // Функции экспорта теперь предоставляются хуком useTableExport

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Фильтрация данных
  const filteredData = trucksData.filter((truck: TruckFinancials) => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      const fieldValue =
        truck[key as keyof TruckFinancials]?.toString().toLowerCase() || '';
      return fieldValue.includes(value.toLowerCase());
    });
  });

  // Форматирование данных для экспорта
  const formattedDataForExport = filteredData.map((truck) => ({
    ...truck,
    status:
      {
        ON_BASE: 'На базе',
        IN_ROUTE: 'В пути',
        IN_REPAIR: 'В ремонте',
        INACTIVE: 'Неактивный',
      }[truck.status] || truck.status,
    totalRevenue: `${truck.totalRevenue.toLocaleString()} ₽`,
    totalDriverSalary: `${truck.totalDriverSalary.toLocaleString()} ₽`,
    totalIncidentsCost: `${truck.totalIncidentsCost.toLocaleString()} ₽`,
    totalProfit: `${truck.totalProfit.toLocaleString()} ₽`,
    averageProfitPerFreight: `${truck.averageProfitPerFreight.toLocaleString()} ₽`,
  }));

  // Логика экспорта
  const { handleExportXLSX, handleExportPDF } = useTableExport({
    data: formattedDataForExport,
    columns: exportColumns,
    filename: 'car-report',
    title: 'Отчет по автомобилям',
    totalRecords: filteredData.length,
  });

  // Обновленные колонки с кастомным рендерингом
  const updatedColumns = tableColumns.map((column) => {
    if (column.key === 'status') {
      return {
        ...column,
        render: (value: string) => {
          const statusConfig = {
            ON_BASE: { label: 'На базе', color: 'green' as const },
            IN_ROUTE: { label: 'В пути', color: 'blue' as const },
            IN_REPAIR: { label: 'В ремонте', color: 'yellow' as const },
            INACTIVE: { label: 'Неактивный', color: 'gray' as const },
          };
          return <StatusBadge status={value} config={statusConfig} />;
        },
      };
    }
    if (
      column.key === 'totalRevenue' ||
      column.key === 'totalDriverSalary' ||
      column.key === 'totalIncidentsCost'
    ) {
      return {
        ...column,
        render: (value: number) => (
          <span className="font-medium">{value.toLocaleString()} ₽</span>
        ),
      };
    }
    if (column.key === 'totalProfit') {
      return {
        ...column,
        render: (value: number) => (
          <span
            className={`font-medium ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}
          >
            {value.toLocaleString()} ₽
          </span>
        ),
      };
    }
    if (column.key === 'averageProfitPerFreight') {
      return {
        ...column,
        render: (value: number) => (
          <span
            className={`font-medium ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}
          >
            {value.toLocaleString()} ₽
          </span>
        ),
      };
    }
    if (column.key === 'totalFreights') {
      return {
        ...column,
        render: (value: number) => <span className="font-medium">{value}</span>,
      };
    }
    return column;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader title="Отчет по автомобилям" />

        {/* Charts in Single Accordion */}
        <div className="mb-8">
          <AccordionItem
            title="📊 Финансовые показатели по дням недели"
            isOpen={isChartsOpen}
            onToggle={() => setIsChartsOpen(!isChartsOpen)}
          >
            <div className="bg-gray-50 rounded-xl">
              <FinanceCharts
                incomeData={incomeData}
                expensesData={expensesData}
                profitData={profitData}
              />
            </div>
          </AccordionItem>
        </div>

        <div className="mb-6">
          <FilterBar
            filters={filterFields}
            values={filters}
            onChange={handleFilterChange}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Загрузка данных...</span>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-8">
              <span className="text-red-600">
                Ошибка при загрузке данных: {error.message}
              </span>
            </div>
          ) : !trucksData || trucksData.length === 0 ? (
            <div className="flex justify-center items-center py-8">
              <span className="text-gray-600">Нет данных для отображения</span>
            </div>
          ) : (
            <DataTable
              columns={updatedColumns}
              data={filteredData}
              actions={[]}
              statusConfig={{}}
              dateStatusConfig={false}
              onExportXLSX={handleExportXLSX}
              onExportPDF={handleExportPDF}
              pagination={{
                current: 1,
                total: filteredData.length,
                pageSize: 10,
                onPageChange: (page) => console.log('Страница:', page),
                onPageSizeChange: (size) =>
                  console.log('Размер страницы:', size),
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
