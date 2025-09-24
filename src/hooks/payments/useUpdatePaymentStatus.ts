import { useMutation, useQueryClient } from '@tanstack/react-query';
import PaymentsService from '@/services/payments';
import toast from 'react-hot-toast';

export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      paymentId,
      status,
    }: {
      paymentId: string;
      status: 'PENDING' | 'PAID' | 'PARTIAL' | 'OVERDUE' | 'CANCELLED';
    }) => PaymentsService.updatePaymentStatus(paymentId, status),
    onSuccess: () => {
      // Инвалидируем кэш платежей и фрахтов для обновления данных
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['freights'] });
      toast.success('Статус платежа успешно обновлен');
    },
    onError: (error) => {
      console.error('Ошибка при обновлении статуса платежа:', error);
      toast.error('Ошибка при обновлении статуса платежа');
    },
  });
};
