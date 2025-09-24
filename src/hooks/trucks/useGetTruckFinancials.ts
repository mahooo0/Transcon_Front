import { useQuery } from '@tanstack/react-query';
import TrucksService from '@/services/trucks';

export const useGetTruckFinancials = () => {
  return useQuery({
    queryKey: ['truck-financials'],
    queryFn: async () => {
      try {
        const data = await TrucksService.getTruckFinancials();
        console.log('useGetTruckFinancials - received data:', data);
        return data;
      } catch (error) {
        console.error('useGetTruckFinancials - error:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
