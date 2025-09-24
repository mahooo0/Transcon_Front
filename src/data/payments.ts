import { FilterField, TableColumn } from '@/types';

const filterFields: FilterField[] = [
  {
    key: 'month',
    label: 'Месяц',
    type: 'text',
    placeholder: 'Месяц',
  },
  {
    key: 'year',
    label: 'Год',
    type: 'text',
    placeholder: 'Год',
  },
  {
    key: 'status',
    label: 'Статус',
    type: 'select',
    placeholder: 'Статус',
    options: [
      { value: 'PENDING', label: 'В ожидании' },
      { value: 'PAID', label: 'Оплачено' },
      { value: 'PARTIAL', label: 'Частично оплачено' },
      { value: 'OVERDUE', label: 'Просрочено' },
      { value: 'CANCELLED', label: 'Отменено' },
    ],
  },
  {
    key: 'freightId',
    label: 'Фрахт',
    type: 'text',
    placeholder: 'ID фрахта',
  },
  {
    key: 'driverId',
    label: 'Водитель',
    type: 'text',
    placeholder: 'ID водителя',
  },
  {
    key: 'search',
    label: 'Поиск',
    type: 'text',
    placeholder: 'Поиск',
  },
];

const columns: TableColumn[] = [
  { key: 'freightNumber', label: 'Номер фрахта', width: '200px' },
  { key: 'driver', label: 'Водитель', width: '150px' },
  { key: 'totalAmount', label: 'Общая сумма', width: '120px' },
  { key: 'paidAmount', label: 'Оплачено', width: '120px' },
  { key: 'remainingAmount', label: 'Остаток', width: '120px' },
  { key: 'status', label: 'Статус', width: '120px' },
  { key: 'expectedPaymentDate', label: 'Ожидаемая дата', width: '150px' },
  { key: 'paymentAmount', label: 'Сумма платежа', width: '120px' },
  { key: 'paymentStatus', label: 'Статус платежа', width: '120px' },
];

export { filterFields, columns };
