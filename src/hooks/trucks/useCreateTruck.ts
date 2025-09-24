import TrucksService from '@/services/trucks';
import { CreateTruckDto } from '@/services/trucks/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateTruck = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employeeData: CreateTruckDto) => {
      const response = await TrucksService.createTruck(employeeData);
      return response;
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['trucks'] });
    },
    mutationKey: ['createTruck'],
  });
};
