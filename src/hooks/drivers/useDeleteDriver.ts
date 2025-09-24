import { useMutation, useQueryClient } from '@tanstack/react-query';
import DriversService from '@/services/drivers';
import toast from 'react-hot-toast';

export const useDeleteDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => DriversService.deleteDriver(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      toast.success('Водитель успешно удален');
    },
    onError: (error) => {
      console.error('Error deleting driver:', error);
      toast.error('Ошибка при удалении водителя');
    },
  });
};
