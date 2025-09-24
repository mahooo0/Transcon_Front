import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ExtraTransportService from '@/services/extra-transport';
import { CreateExtraTransportDto } from '@/services/extra-transport/types';

interface ExtraTransportFilterParams {
  search?: string;
  type?: string;
  page?: number;
  limit?: number;
}

export const useGetExtraTransport = (params?: ExtraTransportFilterParams) => {
  return useQuery({
    queryKey: ['extra-transport', params],
    queryFn: async () => {
      console.log('useGetExtraTransport called with params:', params);
      const response = await ExtraTransportService.getAllExtraTransport(params);
      console.log('useGetExtraTransport response:', response);
      return response;
    },
    enabled: true,
  });
};

export const useGetExtraTransportById = (id: string) => {
  return useQuery({
    queryKey: ['extra-transport', id],
    queryFn: async () => {
      const response = await ExtraTransportService.getExtraTransportById(id);
      return response;
    },
    enabled: !!id,
  });
};

export const useCreateExtraTransport = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: CreateExtraTransportDto) => {
      console.log('useCreateExtraTransport mutationFn called with data:', data);
      const response = await ExtraTransportService.createExtraTransport(data);
      console.log('useCreateExtraTransport response:', response);
      return response;
    },
    onSuccess: (data) => {
      console.log('useCreateExtraTransport onSuccess called with:', data);
      queryClient.invalidateQueries({ queryKey: ['extra-transport'] });
      toast.success('Дополнительный транспорт успешно создан');
      navigate('/transport/extra');
    },
    onError: (error) => {
      console.error('useCreateExtraTransport onError called with:', error);
      toast.error('Ошибка при создании дополнительного транспорта');
    },
  });
};

export const useUpdateExtraTransport = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: CreateExtraTransportDto;
    }) => {
      const response = await ExtraTransportService.updateExtraTransport(
        id,
        data
      );
      return response;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['extra-transport'] });
      queryClient.invalidateQueries({ queryKey: ['extra-transport', id] });
      toast.success('Дополнительный транспорт успешно обновлен');
      navigate('/transport/extra');
    },
    onError: (error) => {
      console.error('Error updating extra transport:', error);
      toast.error('Ошибка при обновлении дополнительного транспорта');
    },
  });
};

export const useDeleteExtraTransport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('useDeleteExtraTransport mutationFn called with id:', id);
      const response = await ExtraTransportService.deleteExtraTransport(id);
      console.log('useDeleteExtraTransport response:', response);
      return response;
    },
    onSuccess: (data) => {
      console.log('useDeleteExtraTransport onSuccess called with:', data);
      queryClient.invalidateQueries({ queryKey: ['extra-transport'] });
      toast.success('Дополнительный транспорт успешно удален');
    },
    onError: (error) => {
      console.error('useDeleteExtraTransport onError called with:', error);
      toast.error('Ошибка при удалении дополнительного транспорта');
    },
    onMutate: (id) => {
      console.log('useDeleteExtraTransport onMutate called with id:', id);
    },
    onSettled: (data, error, id) => {
      console.log('useDeleteExtraTransport onSettled called with:', {
        data,
        error,
        id,
      });
    },
  });
};
