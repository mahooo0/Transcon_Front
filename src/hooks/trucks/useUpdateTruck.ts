import TrucksService from '@/services/trucks';
import { CreateTruckDto } from '@/services/trucks/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateTruck = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      truckData,
    }: {
      id: string;
      truckData: CreateTruckDto;
    }) => {
      const response = await TrucksService.updateTruck(id, truckData);
      return response;
    },
    onSettled: async (_, __, variables) => {
      // Инвалидируем кэш для списка грузовиков и конкретного грузовика
      await queryClient.invalidateQueries({ queryKey: ['trucks'] });
      await queryClient.invalidateQueries({
        queryKey: ['truck', variables.id],
      });
    },
    mutationKey: ['updateTruck'],
  });
};
