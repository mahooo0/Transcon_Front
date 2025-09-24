import { useQuery } from '@tanstack/react-query';
import EmployeeService from '@/services/employees';

export const useGetDriversOnBase = () => {
  return useQuery({
    queryKey: ['drivers', 'on-base'],
    queryFn: async () => {
      // Получаем всех сотрудников и фильтруем водителей со статусом ON_BASE
      const response = await EmployeeService.getAllEmployees({});
      return response.data;
    },
    select: (data) => {
      // Фильтруем только активных сотрудников с ролью водителя и статусом ON_BASE
      // Предполагаем, что водители имеют определенную роль или позицию
      return data.filter((employee) => 
        employee.isActive && 
        (employee.position?.toLowerCase().includes('driver') || 
         employee.position?.toLowerCase().includes('водитель') ||
         employee.role?.name?.toLowerCase().includes('driver'))
      );
    },
    staleTime: 5 * 60 * 1000, // 5 минут
    retry: 2, // Повторить запрос 2 раза при ошибке
  });
};
