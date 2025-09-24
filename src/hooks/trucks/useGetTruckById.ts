import { useQuery } from '@tanstack/react-query';
import TrucksService from '@/services/trucks';

export const useGetTruckById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['truck', id],
    queryFn: () => TrucksService.getTruckById(id!),
    enabled: !!id, // Запрос выполняется только если ID существует
  });
};
