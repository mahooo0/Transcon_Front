import { useQuery } from '@tanstack/react-query';
import IncidentLogsService from '@/services/incident-logs';

export const useGetIncidentLogById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['incident-log', id],
    queryFn: () => IncidentLogsService.getIncidentLogById(id!),
    enabled: !!id, // Запрос выполняется только если ID существует
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
