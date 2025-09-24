import TrailerService from '@/services/trailers';
import { CreateTrailerDto } from '@/services/trailers/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateTrailer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      trailerData,
    }: {
      id: string;
      trailerData: CreateTrailerDto;
    }) => {
      const response = await TrailerService.updateTrailer(id, trailerData);
      return response;
    },
    onSettled: async (_, __, variables) => {
      // Инвалидируем кэш для списка прицепов и конкретного прицепа
      await queryClient.invalidateQueries({ queryKey: ['trailers'] });
      await queryClient.invalidateQueries({
        queryKey: ['trailer', variables.id],
      });
    },
    mutationKey: ['updateTrailer'],
  });
};
