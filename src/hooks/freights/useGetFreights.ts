import { useQuery } from '@tanstack/react-query';
import FreightService, { FreightFilterParams } from '@/services/freights';

export const useGetFreights = (params?: FreightFilterParams) => {
  return useQuery({
    queryKey: ['freights', params],
    queryFn: () => FreightService.getAllFreights(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
