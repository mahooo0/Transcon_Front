import { useQuery } from '@tanstack/react-query';
import FreightFinancialsService from '@/services/freight-financials';
import { FreightFinancialsFilterParams } from '@/services/freight-financials/types';

export const useGetFreightFinancials = (
  params?: FreightFinancialsFilterParams
) => {
  return useQuery({
    queryKey: ['freight-financials', params],
    queryFn: () => FreightFinancialsService.getFreightFinancials(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
