import { useQuery } from '@tanstack/react-query';
import TrailerService from '@/services/trailers';

export const useGetTrailerById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['trailer', id],
    queryFn: () => TrailerService.getTrailerById(id!),
    enabled: !!id, // Запрос выполняется только если ID существует
  });
};
