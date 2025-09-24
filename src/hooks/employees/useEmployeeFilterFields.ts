import { FilterField } from '@/types';
import { useGetUniquePositions } from './useGetEmployees';

export const useEmployeeFilterFields = (): FilterField[] => {
  const { data: positionsData } = useGetUniquePositions();

  const positions = positionsData?.data || [];

  const filterFields: FilterField[] = [
    {
      key: 'search',
      label: 'Поиск',
      type: 'text' as const,
      placeholder: 'Поиск по имени, должности, телефону, логину',
    },
    {
      key: 'role',
      label: 'Роль',
      type: 'select' as const,
      options: [
        { value: '', label: 'Все роли' },
        { value: 'SUPER_ADMIN', label: 'Супер Администратор' },
        { value: 'ADMIN', label: 'Администратор' },
        { value: 'SUPER_EMPLOYEE', label: 'Супер Сотрудник' },
        { value: 'EMPLOYEE', label: 'Сотрудник' },
      ],
    },
    {
      key: 'position',
      label: 'Должность',
      type: 'select' as const,
      options: [
        { value: '', label: 'Все должности' },
        ...positions.map((pos) => ({ value: pos, label: pos })),
      ],
    },
    {
      key: 'sortBy',
      label: 'Сортировка',
      type: 'select' as const,
      options: [
        { value: 'firstName', label: 'По имени' },
        { value: 'lastName', label: 'По фамилии' },
        { value: 'position', label: 'По должности' },
        { value: 'createdAt', label: 'По дате создания' },
        { value: 'updatedAt', label: 'По дате изменения' },
      ],
    },
  ];

  return filterFields;
};
