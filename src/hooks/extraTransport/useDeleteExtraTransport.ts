import { useState } from 'react';
import { useDeleteExtraTransport } from './use-api-extra-transposrt';

export const useDeleteExtraTransportModal = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const deleteMutation = useDeleteExtraTransport();

  const openDeleteModal = (id: string, name: string) => {
    console.log('openDeleteModal called with:', { id, name });
    setItemToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    console.log('closeDeleteModal called');
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    console.log('handleDeleteConfirm called, itemToDelete:', itemToDelete);
    if (!itemToDelete) {
      console.log('No item to delete');
      return;
    }

    try {
      console.log(
        'Calling deleteMutation.mutateAsync with id:',
        itemToDelete.id
      );
      await deleteMutation.mutateAsync(itemToDelete.id);
      console.log('Delete mutation completed successfully');
      closeDeleteModal();
    } catch (error) {
      console.error('Error in handleDeleteConfirm:', error);
    }
  };

  return {
    isDeleteModalOpen,
    itemToDelete,
    openDeleteModal,
    closeDeleteModal,
    handleDeleteConfirm,
    isDeleting: deleteMutation.isPending,
  };
};
