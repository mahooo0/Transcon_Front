import { useMutation, useQueryClient } from '@tanstack/react-query';
import IncidentLogsService from '@/services/incident-logs';
import { CreateIncidentLogDto } from '@/services/incident-logs/types';
import toast from 'react-hot-toast';

export const useUpdateIncidentLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateIncidentLogDto }) =>
      IncidentLogsService.updateIncidentLog(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incident-logs'] });
      queryClient.invalidateQueries({ queryKey: ['incident-log'] });
      toast.success('Запись журнала успешно обновлена');
    },
    onError: (error) => {
      console.error('Error updating incident log:', error);
      toast.error('Ошибка при обновлении записи журнала');
    },
  });
};
