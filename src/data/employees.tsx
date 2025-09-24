import { ExportColumn } from '@/helpers/exports';
import { Employee } from '@/services/employees/types';
import { TableColumn } from '@/types';

export const columns: TableColumn[] = [
  {
    key: 'fullName',
    label: 'Имя Фамилия',
    render: (_, row: Employee) => `${row.firstName} ${row.lastName}`,
  },
  {
    key: 'position',
    label: 'Должность',
  },
  {
    key: 'phone',
    label: 'Телефон',
  },
  {
    key: 'login',
    label: 'Логин',
  },
  {
    key: 'notes',
    label: 'Примечания',
    render: (_, row: Employee) => {
      const notes = row.notes || {};
      console.log(notes);
      return (
        <>
          {/* //TODO: Change to LANG SYSTEM */}
          {Object.keys(notes).length === 0 && (
            <p className="text-sm">Нет примечаний</p>
          )}
          {notes.ru && <div>{notes.ru}</div>}
        </>
      );
    },
  },
  {
    key: 'role',
    label: 'Роль',
    render: (_, row: Employee) => {
      const roleLabels: Record<string, string> = {
        SUPER_ADMIN: 'Супер Администратор',
        ADMIN: 'Администратор',
        SUPER_EMPLOYEE: 'Супер Сотрудник',
        EMPLOYEE: 'Сотрудник',
      };
      return roleLabels[row.role.name] || row.role.name;
    },
  },
  {
    key: 'isActive',
    label: 'Статус',
    render: (value: boolean) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}
      >
        {value ? 'Активный' : 'Неактивный'}
      </span>
    ),
  },
  {
    key: 'createdAt',
    label: 'Создан',
    render: (value: string) => new Date(value).toLocaleDateString('ru-RU'),
  },
];

export const exportColumns: ExportColumn[] = [
  {
    key: 'fullName',
    label: 'Имя Фамилия',
  },
  {
    key: 'position',
    label: 'Должность',
  },
  {
    key: 'phone',
    label: 'Телефон',
  },
  {
    key: 'login',
    label: 'Логин',
  },
  {
    key: 'role',
    label: 'Роль',
  },
  {
    key: 'isActive',
    label: 'Статус',
  },
  {
    key: 'createdAt',
    label: 'Создан',
  },
];
