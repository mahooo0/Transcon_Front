import { useMutation, useQueryClient } from '@tanstack/react-query';
import IncidentLogsService from '@/services/incident-logs';
import { CreateIncidentLogDto } from '@/services/incident-logs/types';
import toast from 'react-hot-toast';

export const useCreateIncidentLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (incidentLog: CreateIncidentLogDto) =>
      IncidentLogsService.createIncidentLog(incidentLog),
    onSuccess: () => {
      // Инвалидируем кэш incident logs для обновления списка
      queryClient.invalidateQueries({ queryKey: ['incident-logs'] });
      toast.success('Запись журнала успешно создана');
    },
    onError: (error) => {
      console.error('Error creating incident log:', error);
      toast.error('Ошибка при создании записи журнала');
    },
  });
};
