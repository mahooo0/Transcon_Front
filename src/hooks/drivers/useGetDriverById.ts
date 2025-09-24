import { useQuery } from '@tanstack/react-query';
import DriversService from '@/services/drivers';

export const useGetDriverById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['driver', id],
    queryFn: () => DriversService.getDriverById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
