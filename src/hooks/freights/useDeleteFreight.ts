import { useMutation, useQueryClient } from '@tanstack/react-query';
import FreightService from '@/services/freights';
import toast from 'react-hot-toast';

export const useDeleteFreight = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => FreightService.deleteFreight(id),
    onSuccess: () => {
      // Инвалидируем кэш грузов для обновления списка
      queryClient.invalidateQueries({ queryKey: ['freights'] });
      toast.success('Груз успешно удален');
    },
    onError: (error) => {
      console.error('Error deleting freight:', error);
      toast.error('Ошибка при удалении груза');
    },
  });
};
