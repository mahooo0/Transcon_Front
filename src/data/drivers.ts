import { FilterField, TableColumn } from '@/types';

const filterFields: FilterField[] = [
  {
    key: 'search',
    label: 'Поиск',
    type: 'text',
    placeholder: 'Поиск по имени или телефону',
  },
  {
    key: 'status',
    label: 'Статус',
    type: 'select',
    placeholder: 'Статус',
    options: [
      { value: 'ON_BASE', label: 'НА БАЗЕ' },
      { value: 'IN_ROUTE', label: 'В РЕЙСЕ' },
      { value: 'ON_LEAVE', label: 'В ОТПУСКЕ' },
      { value: 'INACTIVE', label: 'НЕАКТИВЕН' },
    ],
  },
  {
    key: 'contractStatus',
    label: 'Статус контракта',
    type: 'select',
    placeholder: 'Статус контракта',
    options: [
      { value: 'active', label: 'АКТИВЕН' },
      { value: 'expired', label: 'ИСТЕК' },
      { value: 'pending', label: 'ОЖИДАНИЕ' },
    ],
  },
];

// Table columns configuration
const columns: TableColumn[] = [
  { key: 'name', label: 'ФИО', width: '200px' },
  { key: 'phone', label: 'Телефон', width: '150px' },
  { key: 'dailyRate', label: 'Дневная ставка', width: '150px' },
  { key: 'contractEndDate', label: 'Дата окончания контракта', width: '180px' },
  { key: 'status', label: 'Статус', width: '120px' },
  { key: 'contractStatus', label: 'Статус контракта', width: '150px' },
  { key: 'daysUntilExpiration', label: 'Дней до истечения', width: '150px' },
];

export { filterFields, columns };
