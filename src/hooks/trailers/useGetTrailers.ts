import { useQuery } from '@tanstack/react-query';
import TrailerService, { TrailerFilterParams } from '@/services/trailers';

export const useGetTrailers = (params?: TrailerFilterParams) => {
  return useQuery({
    queryKey: ['trailers', params],
    queryFn: () => TrailerService.getAllTrailers(params),
  });
};
