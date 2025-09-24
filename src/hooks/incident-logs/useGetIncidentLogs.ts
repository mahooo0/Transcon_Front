import { useQuery } from '@tanstack/react-query';
import IncidentLogsService from '@/services/incident-logs';
import { IncidentLogsFilterParams } from '@/services/incident-logs/types';

export const useGetIncidentLogs = (params?: IncidentLogsFilterParams) => {
  return useQuery({
    queryKey: ['incident-logs', params],
    queryFn: () => IncidentLogsService.getAllIncidentLogs(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
