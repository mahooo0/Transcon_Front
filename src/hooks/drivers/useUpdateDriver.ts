import { useMutation, useQueryClient } from '@tanstack/react-query';
import DriversService, { CreateDriverDto } from '@/services/drivers';
import toast from 'react-hot-toast';

export const useUpdateDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateDriverDto }) =>
      DriversService.updateDriver(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      queryClient.invalidateQueries({ queryKey: ['driver'] });
      toast.success('Водитель успешно обновлен');
    },
    onError: (error) => {
      console.error('Error updating driver:', error);
      toast.error('Ошибка при обновлении водителя');
    },
  });
};
