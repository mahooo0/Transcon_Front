import TrailerService from '@/services/trailers';
import { CreateTrailerDto } from '@/services/trailers/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateTrailer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (trailerData: CreateTrailerDto) => {
      const response = await TrailerService.createTrailer(trailerData);
      return response;
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['trailers'] });
    },
    mutationKey: ['createTrailer'],
  });
};
