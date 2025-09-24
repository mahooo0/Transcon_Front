import { useQuery } from '@tanstack/react-query';
import TrucksService, { TrucksFilterParams } from '@/services/trucks';

export const useGetTrucks = (params?: TrucksFilterParams) => {
  return useQuery({
    queryKey: ['trucks', params],
    queryFn: () => TrucksService.getAllTrucks(params),
  });
};
