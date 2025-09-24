import React, { useState, useMemo } from 'react';
import { DataTable } from '@/components/tables/DataTable';
import PageHeader from '@/components/common/PageHeader';
import { FilterBar } from '@/components/common/FilterBar';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { FinanceCharts } from '@/components/charts/FinanceCharts';
import { useGetDriverSalaries } from '@/hooks/driver-salary/useGetDriverSalaries';
import {
  DriverSalaryFilterParams,
  DriverSalary,
} from '@/services/driver-salary/types';
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

interface FilterField {
  key: string;
  label: string;
  type: 'text' | 'date' | 'select';
  placeholder: string;
  options?: { value: string; label: string }[];
}

// Получаем текущий месяц и год по умолчанию
const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1; // getMonth() возвращает 0-11
const currentYear = currentDate.getFullYear();

// Данные для графиков
const incomeData: ChartData[] = [
  { day: 'Mon', lightBlue: 65, darkBlue: 35 },
  { day: 'Tue', lightBlue: 55, darkBlue: 45 },
  { day: 'Wed', lightBlue: 75, darkBlue: 25 },
  { day: 'Thu', lightBlue: 25, darkBlue: 75 },
  { day: 'Fri', lightBlue: 55, darkBlue: 45 },
  { day: 'Sat', lightBlue: 65, darkBlue: 35 },
];

const expensesData: ChartData[] = [
  { day: 'Mon', lightBlue: 75, darkBlue: 25 },
  { day: 'Tue', lightBlue: 65, darkBlue: 35 },
  { day: 'Wed', lightBlue: 85, darkBlue: 15 },
  { day: 'Thu', lightBlue: 25, darkBlue: 75 },
  { day: 'Fri', lightBlue: 65, darkBlue: 35 },
  { day: 'Sat', lightBlue: 75, darkBlue: 25 },
];

const profitData: ChartData[] = [
  { day: 'Mon', lightBlue: 70, darkBlue: 30 },
  { day: 'Tue', lightBlue: 60, darkBlue: 40 },
  { day: 'Wed', lightBlue: 80, darkBlue: 20 },
  { day: 'Thu', lightBlue: 30, darkBlue: 70 },
  { day: 'Fri', lightBlue: 60, darkBlue: 40 },
  { day: 'Sat', lightBlue: 70, darkBlue: 30 },
];

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

export default function EmployeeReport() {
  const [filters, setFilters] = useState<Record<string, string>>({
    month: currentMonth.toString(),
    year: currentYear.toString(),
  });
  const [isChartsOpen, setIsChartsOpen] = useState(true);

  // Параметры для API
  const apiParams: DriverSalaryFilterParams = useMemo(() => {
    const params: DriverSalaryFilterParams = {};
    if (filters.month) params.month = parseInt(filters.month);
    if (filters.year) params.year = parseInt(filters.year);
    return params;
  }, [filters]);

  // Получение данных с API
  const {
    data: driverSalariesResponse,
    isLoading,
    error,
  } = useGetDriverSalaries(apiParams);

  const driverSalariesData = useMemo(
    () => (driverSalariesResponse as unknown as DriverSalary[]) || [],
    [driverSalariesResponse]
  );

  // Конфигурация колонок для экспорта
  const exportColumns: ExportColumn[] = [
    { key: 'driverId', label: 'ID водителя', width: 15 },
    { key: 'driverName', label: 'Имя водителя', width: 20 },
    { key: 'dailyRate', label: 'Ставка за день', width: 15 },
    { key: 'workedDays', label: 'Отработанных дней', width: 18 },
    { key: 'totalDeductions', label: 'Общие удержания', width: 18 },
    { key: 'grossSalary', label: 'Валовая зарплата', width: 18 },
    { key: 'netSalary', label: 'Чистая зарплата', width: 18 },
    { key: 'currency', label: 'Валюта', width: 10 },
    { key: 'month', label: 'Месяц', width: 10 },
    { key: 'year', label: 'Год', width: 10 },
  ];

  // Определение колонок для таблицы
  const tableColumns: TableColumn[] = [
    { key: 'driverName', label: 'Водитель', width: '200px' },
    { key: 'dailyRate', label: 'Ставка за день', width: '150px' },
    { key: 'workedDays', label: 'Отработанных дней', width: '150px' },
    { key: 'totalDeductions', label: 'Удержания', width: '150px' },
    { key: 'grossSalary', label: 'Валовая зарплата', width: '150px' },
    { key: 'netSalary', label: 'Чистая зарплата', width: '150px' },
    { key: 'currency', label: 'Валюта', width: '100px' },
  ];

  // Обработка данных для экспорта
  const processedDataForExport = useMemo(() => {
    return driverSalariesData.map((salary: DriverSalary) => ({
      ...salary,
      // Форматируем суммы
      dailyRate: salary.dailyRate
        ? `${salary.dailyRate.toLocaleString()} ${salary.currency || ''}`
        : '',
      totalDeductions: salary.totalDeductions
        ? `${salary.totalDeductions.toLocaleString()} ${salary.currency || ''}`
        : '',
      grossSalary: salary.grossSalary
        ? `${salary.grossSalary.toLocaleString()} ${salary.currency || ''}`
        : '',
      netSalary: salary.netSalary
        ? `${salary.netSalary.toLocaleString()} ${salary.currency || ''}`
        : '',
    }));
  }, [driverSalariesData]);

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

    return `Отчет по сотрудникам - ${monthName} ${year}`;
  };

  // Хук для экспорта
  const { handleExportXLSX, handleExportPDF } = useTableExport({
    data: processedDataForExport,
    columns: exportColumns,
    filename: 'employee-report',
    title: getExportTitle(),
    totalRecords: driverSalariesData.length,
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Обновленные колонки с кастомным рендерингом
  const updatedColumns = tableColumns.map((column) => {
    if (column.key === 'totalDeductions') {
      return {
        ...column,
        render: (value: number) => (
          <span className="text-red-600 font-medium">
            {value.toLocaleString()}
          </span>
        ),
      };
    }
    if (column.key === 'grossSalary' || column.key === 'netSalary') {
      return {
        ...column,
        render: (value: number) => (
          <span className="text-green-600 font-medium">
            {value.toLocaleString()}
          </span>
        ),
      };
    }
    if (column.key === 'workedDays') {
      return {
        ...column,
        render: (value: number) => <span className="font-medium">{value}</span>,
      };
    }
    if (column.key === 'dailyRate') {
      return {
        ...column,
        render: (value: string) => (
          <span className="text-blue-600 font-medium">{value}</span>
        ),
      };
    }
    if (column.key === 'currency') {
      return {
        ...column,
        render: (value: string) => (
          <span className="text-gray-600 font-medium">{value}</span>
        ),
      };
    }
    return column;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader title="Отчет по сотрудникам" />

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
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-600">Загрузка данных...</div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-red-600">Ошибка загрузки данных</div>
            </div>
          ) : driverSalariesData.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-600">
                Нет данных для отображения
              </div>
            </div>
          ) : (
            <DataTable
              columns={updatedColumns}
              data={driverSalariesData}
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
      </div>
    </div>
  );
}
