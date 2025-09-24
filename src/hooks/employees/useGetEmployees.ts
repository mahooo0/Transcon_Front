import { useQuery } from '@tanstack/react-query';
import EmployeeService from '@/services/employees';
import { EmployeeFilterParams } from '@/services/employees/types';

export const useGetEmployees = (params?: EmployeeFilterParams) => {
  return useQuery({
    queryKey: ['employees', params],
    queryFn: async () => {
      const response = await EmployeeService.getAllEmployees(params);
      return response;
    },
  });
};

export const useGetUniquePositions = () => {
  return useQuery({
    queryKey: ['employees-positions'],
    queryFn: async () => {
      const response = await EmployeeService.getUniquePositions();
      return response;
    },
  });
};
