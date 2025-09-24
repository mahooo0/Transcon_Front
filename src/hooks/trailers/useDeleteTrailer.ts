import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import TrailerService from '@/services/trailers';

interface DeleteTrailerModalState {
  isOpen: boolean;
  trailerId: string | null;
  trailerName: string | null;
}

export const useDeleteTrailer = () => {
  const queryClient = useQueryClient();
  const [modalState, setModalState] = useState<DeleteTrailerModalState>({
    isOpen: false,
    trailerId: null,
    trailerName: null,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await TrailerService.deleteTrailer(id);
    },
    onSuccess: () => {
      toast.success('Прицеп успешно удален');
      // Инвалидируем кэш списка прицепов
      queryClient.invalidateQueries({ queryKey: ['trailers'] });
      closeModal();
    },
    onError: (error) => {
      console.error('Error deleting trailer:', error);
      toast.error('Ошибка при удалении прицепа');
    },
    mutationKey: ['deleteTrailer'],
  });

  const openModal = (trailerId: string, trailerName: string) => {
    setModalState({
      isOpen: true,
      trailerId,
      trailerName,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      trailerId: null,
      trailerName: null,
    });
  };

  const confirmDelete = () => {
    if (modalState.trailerId) {
      deleteMutation.mutate(modalState.trailerId);
    }
  };

  return {
    // Состояние модального окна
    isModalOpen: modalState.isOpen,
    trailerToDelete: {
      id: modalState.trailerId,
      name: modalState.trailerName,
    },

    // Состояние удаления
    isDeleting: deleteMutation.isPending,

    // Методы управления
    openDeleteModal: openModal,
    closeDeleteModal: closeModal,
    confirmDelete,
  };
};
