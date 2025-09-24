import { useQuery, useQueryClient } from '@tanstack/react-query';
import FreightsService, { Freight } from '@/services/freights';
import { useMemo } from 'react';

export const useGetFreightByIdWithCache = (id: string | undefined) => {
  const queryClient = useQueryClient();

  // Пытаемся найти данные в кэше
  const cachedData = useMemo(() => {
    if (!id) return null;

    // Получаем все кэшированные данные фрахтов
    const cachedQueries = queryClient.getQueriesData({
      queryKey: ['freights'],
    });

    // Ищем нужный фрахт в кэше
    for (const [, data] of cachedQueries) {
      if (data && typeof data === 'object' && 'data' in data) {
        const response = data as { data?: { data?: { id: string }[] } };
        if (response.data?.data && Array.isArray(response.data.data)) {
          const foundFreight = response.data.data.find(
            (freight) => freight.id === id
          );
          if (foundFreight) {
            return foundFreight;
          }
        }
      }
    }
    return null;
  }, [id, queryClient]);

  // Основной запрос
  const query = useQuery({
    queryKey: ['freight', id],
    queryFn: () => FreightsService.getFreightById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Если данные есть в кэше, используем их как initialData
    initialData: cachedData
      ? { success: true, message: '', data: cachedData as Freight }
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
        ? { success: true, message: '', data: cachedData as Freight }
        : undefined),
    // Если есть кэшированные данные, не показываем loading
    isLoading: query.isLoading && !cachedData,
    // Если есть кэшированные данные, не показываем error
    error: query.error && !cachedData ? query.error : null,
  };
};
