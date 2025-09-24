import { useMutation, useQueryClient } from '@tanstack/react-query';
import DriversService, { CreateDriverDto } from '@/services/drivers';
import toast from 'react-hot-toast';

export const useCreateDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (driver: CreateDriverDto) =>
      DriversService.createDriver(driver),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      toast.success('Водитель успешно создан');
    },
    onError: (error) => {
      console.error('Error creating driver:', error);
      toast.error('Ошибка при создании водителя');
    },
  });
};
