import { FilterField, TableColumn } from '@/types';

const filterFields: FilterField[] = [
  {
    key: 'freightId',
    label: 'Фрахт',
    type: 'select',
    placeholder: 'Выберите фрахт',
    options: [], // Будет заполнено динамически
  },
  {
    key: 'incidentType',
    label: 'Тип инцидента',
    type: 'select',
    placeholder: 'Тип инцидента',
    options: [
      { value: 'FINE', label: 'ШТРАФ' },
      { value: 'REPAIR', label: 'РЕМОНТ' },
      { value: 'ADDITIONAL', label: 'ДОПОЛНИТЕЛЬНО' },
      { value: 'FUEL', label: 'ТОПЛИВО' },
      { value: 'ROAD', label: 'ДОРОГИ' },
    ],
  },
  {
    key: 'financialBurden',
    label: 'Финансовая нагрузка',
    type: 'select',
    placeholder: 'Финансовая нагрузка',
    options: [
      { value: 'ON_DRIVER', label: 'На водителе' },
      { value: 'ON_COMPANY', label: 'На компании' },
      { value: 'ADDITIONAL', label: 'Дополнительно' },
    ],
  },
  {
    key: 'currency',
    label: 'Валюта',
    type: 'select',
    placeholder: 'Валюта',
    options: [
      { value: 'PLN', label: 'PLN' },
      { value: 'EUR', label: 'EUR' },
    ],
  },
  {
    key: 'search',
    label: 'Поиск',
    type: 'text',
    placeholder: 'Поиск',
  },
];

const columns: TableColumn[] = [
  { key: 'freight', label: 'Фрахт', width: '200px' },
  { key: 'incidentDate', label: 'Дата происшествия', width: '150px' },
  { key: 'incidentType', label: 'Тип инцидента', width: '120px' },
  { key: 'description', label: 'Описание', width: '200px' },
  { key: 'financialBurden', label: 'Финансовая нагрузка', width: '150px' },
  { key: 'amount', label: 'Сумма', width: '100px' },
  { key: 'createdByUser', label: 'Создал', width: '150px' },
  { key: 'notes', label: 'Примечания', width: '200px' },
];

export { filterFields, columns };
