import { useQuery } from '@tanstack/react-query';
import FreightService from '@/services/freights';

export const useGetFreightById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['freight', id],
    queryFn: () => FreightService.getFreightById(id!),
    enabled: !!id, // Запрос выполняется только если id существует
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
