import { useMutation, useQueryClient } from '@tanstack/react-query';
import PaymentsService from '@/services/payments';
import { CreatePaymentDto } from '@/services/payments/types';
import toast from 'react-hot-toast';

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      freightId,
      payment,
    }: {
      freightId: string;
      payment: CreatePaymentDto;
    }) => {
      console.log('Hook - FreightId:', freightId);
      console.log('Hook - Payment:', payment);
      return PaymentsService.createPayment(freightId, payment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success('Платеж успешно создан');
    },
    onError: (error) => {
      console.error('Error creating payment:', error);
      toast.error('Ошибка при создании платежа');
    },
  });
};
