import React, { useState, useMemo } from 'react';
import { FinanceCharts } from '@/components/charts/FinanceCharts';
import { DataTable } from '@/components/tables/DataTable';
import { FilterBar } from '@/components/common/FilterBar';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useGetFreightFinancials } from '@/hooks/freight-financials/useGetFreightFinancials';
import {
  FreightFinancialsFilterParams,
  FreightFinancial,
} from '@/services/freight-financials/types';
import { useTableExport } from '@/hooks/useTableExport';
import { ExportColumn } from '@/helpers/exports';

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

// Получаем текущий месяц и год по умолчанию
const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1; // getMonth() возвращает 0-11
const currentYear = currentDate.getFullYear();

interface FilterField {
  key: string;
  label: string;
  type: 'text' | 'date' | 'select';
  placeholder: string;
  options?: { value: string; label: string }[];
}

// Поля фильтрации
const filterFields: FilterField[] = [
  {
    key: 'month',
    label: 'Месяц',
    type: 'select',
    placeholder: 'Месяц',
    options: [
      { value: '1', label: 'Январь' },
      { value: '2', label: 'Февраль' },
      { value: '3', label: 'Март' },
      { value: '4', label: 'Апрель' },
      { value: '5', label: 'Май' },
      { value: '6', label: 'Июнь' },
      { value: '7', label: 'Июль' },
      { value: '8', label: 'Август' },
      { value: '9', label: 'Сентябрь' },
      { value: '10', label: 'Октябрь' },
      { value: '11', label: 'Ноябрь' },
      { value: '12', label: 'Декабрь' },
    ],
  },
  {
    key: 'year',
    label: 'Год',
    type: 'select',
    placeholder: 'Год',
    options: [
      { value: '2024', label: '2024' },
      { value: '2025', label: '2025' },
      { value: '2026', label: '2026' },
    ],
  },
];

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

export default function MonthlyReportPage() {
  const [isChartsOpen, setIsChartsOpen] = useState(true);
  const [filters, setFilters] = useState<Record<string, string>>({
    month: currentMonth.toString(),
    year: currentYear.toString(),
  });

  // Параметры для API
  const apiParams: FreightFinancialsFilterParams = useMemo(() => {
    const params: FreightFinancialsFilterParams = {};
    if (filters.month) params.month = parseInt(filters.month);
    if (filters.year) params.year = parseInt(filters.year);
    return params;
  }, [filters]);

  // Получение данных с API
  const {
    data: freightFinancialsResponse,
    isLoading,
    error,
  } = useGetFreightFinancials(apiParams);

  const freightFinancialsData = useMemo(
    () => (freightFinancialsResponse as unknown as FreightFinancial[]) || [],
    [freightFinancialsResponse]
  );

  // Конфигурация колонок для экспорта
  const exportColumns: ExportColumn[] = [
    { key: 'freightId', label: 'ID фрахта', width: 15 },
    { key: 'freightNumber', label: 'Номер фрахта', width: 20 },
    { key: 'origin', label: 'Откуда', width: 15 },
    { key: 'destination', label: 'Куда', width: 15 },
    { key: 'loadingDate', label: 'Дата загрузки', width: 20 },
    { key: 'unloadingDate', label: 'Дата разгрузки', width: 20 },
    { key: 'totalRevenue', label: 'Общий доход', width: 15 },
    { key: 'incidents.total', label: 'Всего инцидентов', width: 15 },
    { key: 'incidents.onCompany', label: 'Инциденты компании', width: 18 },
    { key: 'incidents.onDriver', label: 'Инциденты водителя', width: 18 },
    {
      key: 'incidents.additional',
      label: 'Дополнительные инциденты',
      width: 20,
    },
    { key: 'driver.id', label: 'ID водителя', width: 15 },
    { key: 'driver.name', label: 'Имя водителя', width: 20 },
    { key: 'driver.grossSalary', label: 'Брутто зарплата', width: 15 },
    { key: 'driver.netSalary', label: 'Чистая зарплата', width: 15 },
    {
      key: 'driver.incidentDeductions',
      label: 'Удержания за инциденты',
      width: 20,
    },
    { key: 'netProfit', label: 'Чистая прибыль', width: 15 },
  ];

  // Определение колонок для таблицы
  const tableColumns: TableColumn[] = [
    { key: 'freightNumber', label: 'Номер фрахта', width: '200px' },
    { key: 'origin', label: 'Откуда', width: '150px' },
    { key: 'destination', label: 'Куда', width: '150px' },
    { key: 'loadingDate', label: 'Дата загрузки', width: '150px' },
    { key: 'unloadingDate', label: 'Дата разгрузки', width: '150px' },
    { key: 'totalRevenue', label: 'Общий доход', width: '150px' },
    { key: 'incidents', label: 'Инциденты', width: '150px' },
    { key: 'driver', label: 'Водитель', width: '200px' },
    { key: 'netProfit', label: 'Чистая прибыль', width: '150px' },
  ];

  // Обработка данных для экспорта
  const processedDataForExport = useMemo(() => {
    return freightFinancialsData.map((financial: FreightFinancial) => ({
      ...financial,
      // Форматируем даты
      loadingDate: financial.loadingDate
        ? new Date(financial.loadingDate).toLocaleDateString('ru-RU')
        : '',
      unloadingDate: financial.unloadingDate
        ? new Date(financial.unloadingDate).toLocaleDateString('ru-RU')
        : '',
      // Форматируем суммы (без валюты, так как её нет в типе)
      totalRevenue: financial.totalRevenue
        ? financial.totalRevenue.toLocaleString()
        : '',
      netProfit: financial.netProfit
        ? financial.netProfit.toLocaleString()
        : '',
      'driver.grossSalary': financial.driver?.grossSalary
        ? financial.driver.grossSalary.toLocaleString()
        : '',
      'driver.netSalary': financial.driver?.netSalary
        ? financial.driver.netSalary.toLocaleString()
        : '',
      'driver.incidentDeductions': financial.driver?.incidentDeductions
        ? financial.driver.incidentDeductions.toLocaleString()
        : '',
    }));
  }, [freightFinancialsData]);

  // Формируем заголовок с информацией о фильтрах
  const getExportTitle = () => {
    const monthNames = [
      'Январь',
      'Февраль',
      'Март',
      'Апрель',
      'Май',
      'Июнь',
      'Июль',
      'Август',
      'Сентябрь',
      'Октябрь',
      'Ноябрь',
      'Декабрь',
    ];

    const monthName = monthNames[parseInt(filters.month) - 1] || filters.month;
    const year = filters.year;

    return `Месячный финансовый отчет - ${monthName} ${year}`;
  };

  // Хук для экспорта
  const { handleExportXLSX, handleExportPDF } = useTableExport({
    data: processedDataForExport,
    columns: exportColumns,
    filename: 'monthly-financial-report',
    title: getExportTitle(),
    totalRecords: freightFinancialsData.length,
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Обновленные колонки с кастомным рендерингом
  const updatedColumns = tableColumns.map((column) => {
    if (column.key === 'incidents') {
      return {
        ...column,
        render: (_value: unknown, row: FreightFinancial) => (
          <div className="text-sm">
            <div className="font-medium">Всего: {row.incidents.total}</div>
            <div className="text-gray-500 text-xs">
              Компания: {row.incidents.onCompany} | Водитель:{' '}
              {row.incidents.onDriver}
            </div>
          </div>
        ),
      };
    }
    if (column.key === 'driver') {
      return {
        ...column,
        render: (_value: unknown, row: FreightFinancial) => (
          <div className="text-sm">
            <div className="font-medium">{row.driver.name}</div>
            <div className="text-gray-500 text-xs">
              Зарплата: {row.driver.netSalary} | Удержания:{' '}
              {row.driver.incidentDeductions}
            </div>
          </div>
        ),
      };
    }
    if (column.key === 'totalRevenue') {
      return {
        ...column,
        render: (value: number) => (
          <span className="text-green-600 font-medium">
            {value.toLocaleString()}
          </span>
        ),
      };
    }
    if (column.key === 'netProfit') {
      return {
        ...column,
        render: (value: number) => (
          <span
            className={`font-medium ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}
          >
            {value.toLocaleString()}
          </span>
        ),
      };
    }
    if (column.key === 'loadingDate' || column.key === 'unloadingDate') {
      return {
        ...column,
        render: (value: string) => (
          <span className="text-sm">
            {new Date(value).toLocaleDateString()}
          </span>
        ),
      };
    }
    return column;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        {/* Charts in Single Accordion */}
        <div className="mb-8">
          <AccordionItem
            title="📊 Финансовые показатели по дням недели"
            isOpen={isChartsOpen}
            onToggle={() => setIsChartsOpen(!isChartsOpen)}
          >
            <div className="bg-gray-50 rounded-xl ">
              <FinanceCharts
                incomeData={incomeData}
                expensesData={expensesData}
                profitData={profitData}
              />
            </div>
          </AccordionItem>
        </div>

        {/* Financial Data Table */}
        <div className="mb-8">
          <div className="mb-6">
            <FilterBar
              filters={filterFields}
              values={filters}
              onChange={handleFilterChange}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-600">Загрузка данных...</div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-red-600">Ошибка загрузки данных</div>
            </div>
          ) : freightFinancialsData.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-600">
                Нет данных для отображения
              </div>
            </div>
          ) : (
            <DataTable
              columns={updatedColumns}
              data={freightFinancialsData}
              actions={[]}
              statusConfig={{}}
              dateStatusConfig={false}
              onExportXLSX={handleExportXLSX}
              onExportPDF={handleExportPDF}
              pagination={{
                current: 1,
                total: 1,
                pageSize: 20,
                onPageChange: (page) => console.log('Страница:', page),
                onPageSizeChange: (size) =>
                  console.log('Размер страницы:', size),
              }}
            />
          )}
        </div>

        {/* Summary Cards */}
      </div>
    </div>
  );
}
