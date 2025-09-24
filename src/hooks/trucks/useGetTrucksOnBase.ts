import { useQuery } from '@tanstack/react-query';
import TrucksService from '@/services/trucks';

export const useGetTrucksOnBase = () => {
  return useQuery({
    queryKey: ['trucks', 'on-base'],
    queryFn: () => TrucksService.getAllTrucks({ status: 'ON_BASE' }),
    select: (data) => data.data, // Возвращаем только массив грузовиков
    staleTime: 5 * 60 * 1000, // 5 минут
    retry: 2, // Повторить запрос 2 раза при ошибке
  });
};
