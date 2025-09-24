import { useQuery } from '@tanstack/react-query';
import DriversService from '@/services/drivers';
import { DriversFilterParams } from '@/services/drivers/types';

export const useGetDrivers = (params?: DriversFilterParams) => {
  return useQuery({
    queryKey: ['drivers', params],
    queryFn: () => DriversService.getDrivers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
