import { useQuery } from '@tanstack/react-query';
import DriversService from '@/services/drivers';

export const useGetDriversOnBase = () => {
  return useQuery({
    queryKey: ['drivers', 'on-base'],
    queryFn: () => DriversService.getDrivers({ status: 'ON_BASE' }),
    select: (data) => data.data, // Возвращаем только массив водителей
    staleTime: 5 * 60 * 1000, // 5 минут
    retry: 2, // Повторить запрос 2 раза при ошибке
  });
};
