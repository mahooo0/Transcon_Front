import { useQuery } from '@tanstack/react-query';
import TrailerService from '@/services/trailers';

export const useGetTrailersOnBase = () => {
  return useQuery({
    queryKey: ['trailers', 'on-base'],
    queryFn: () => TrailerService.getAllTrailers({ status: 'ON_BASE' }),
    select: (data) => data.data, // Возвращаем только массив прицепов
    staleTime: 5 * 60 * 1000, // 5 минут
    retry: 2, // Повторить запрос 2 раза при ошибке
  });
};
