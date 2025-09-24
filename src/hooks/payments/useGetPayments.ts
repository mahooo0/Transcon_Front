import { useQuery } from '@tanstack/react-query';
import PaymentsService from '@/services/payments';
import { PaymentsFilterParams } from '@/services/payments/types';

export const useGetPayments = (params?: PaymentsFilterParams) => {
  return useQuery({
    queryKey: ['payments', params],
    queryFn: () => PaymentsService.getPayments(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
