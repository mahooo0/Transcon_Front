import { useQuery } from '@tanstack/react-query';
import DriverSalaryService from '@/services/driver-salary';
import { DriverSalaryFilterParams } from '@/services/driver-salary/types';

export const useGetDriverSalaries = (params?: DriverSalaryFilterParams) => {
  return useQuery({
    queryKey: ['driver-salaries', params],
    queryFn: () => DriverSalaryService.getDriverSalaries(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
