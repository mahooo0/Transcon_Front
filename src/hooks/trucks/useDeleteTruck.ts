import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import TrucksService from '@/services/trucks';

interface DeleteTruckModalState {
  isOpen: boolean;
  truckId: string | null;
  truckName: string | null;
}

export const useDeleteTruck = () => {
  const queryClient = useQueryClient();
  const [modalState, setModalState] = useState<DeleteTruckModalState>({
    isOpen: false,
    truckId: null,
    truckName: null,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await TrucksService.deleteTruck(id);
    },
    onSuccess: () => {
      toast.success('Грузовик успешно удален');
      // Инвалидируем кэш списка грузовиков
      queryClient.invalidateQueries({ queryKey: ['trucks'] });
      closeModal();
    },
    onError: (error) => {
      console.error('Error deleting truck:', error);
      toast.error('Ошибка при удалении грузовика');
    },
    mutationKey: ['deleteTruck'],
  });

  const openModal = (truckId: string, truckName: string) => {
    setModalState({
      isOpen: true,
      truckId,
      truckName,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      truckId: null,
      truckName: null,
    });
  };

  const confirmDelete = () => {
    if (modalState.truckId) {
      deleteMutation.mutate(modalState.truckId);
    }
  };

  return {
    // Состояние модального окна
    isModalOpen: modalState.isOpen,
    truckToDelete: {
      id: modalState.truckId,
      name: modalState.truckName,
    },

    // Состояние удаления
    isDeleting: deleteMutation.isPending,

    // Методы управления
    openDeleteModal: openModal,
    closeDeleteModal: closeModal,
    confirmDelete,
  };
};
