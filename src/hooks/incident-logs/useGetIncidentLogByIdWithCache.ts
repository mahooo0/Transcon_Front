import { useQuery, useQueryClient } from '@tanstack/react-query';
import IncidentLogsService from '@/services/incident-logs';
import { useMemo } from 'react';
import { IncidentLog } from '@/services/incident-logs/types';

export const useGetIncidentLogByIdWithCache = (id: string | undefined) => {
  const queryClient = useQueryClient();

  // Пытаемся найти данные в кэше
  const cachedData = useMemo(() => {
    if (!id) return null;

    // Получаем все кэшированные данные записей журнала
    const cachedQueries = queryClient.getQueriesData({
      queryKey: ['incident-logs'],
    });

    // Ищем нужную запись в кэше
    for (const [, data] of cachedQueries) {
      if (data && typeof data === 'object' && 'data' in data) {
        const response = data as { data?: { data?: { id: string }[] } };
        if (response.data?.data && Array.isArray(response.data.data)) {
          const foundLog = response.data.data.find((log) => log.id === id);
          if (foundLog) {
            return foundLog;
          }
        }
      }
    }
    return null;
  }, [id, queryClient]);

  // Основной запрос
  const query = useQuery({
    queryKey: ['incident-log', id],
    queryFn: () => IncidentLogsService.getIncidentLogById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Если данные есть в кэше, используем их как initialData
    initialData: cachedData
      ? { success: true, message: '', data: cachedData as IncidentLog   }
      : undefined,
    // Если данные есть в кэше, считаем их свежими
    initialDataUpdatedAt: cachedData ? Date.now() : undefined,
  });

  return {
    ...query,
    // Возвращаем данные из API или из кэша
    data:
      query.data ||
      (cachedData
        ? { success: true, message: '', data: cachedData as IncidentLog }
        : undefined),
    // Если есть кэшированные данные, не показываем loading
    isLoading: query.isLoading && !cachedData,
    // Если есть кэшированные данные, не показываем error
    error: query.error && !cachedData ? query.error : null,
  };
};
