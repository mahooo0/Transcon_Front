import EmployeeService from '@/services/employees';
import { CreateEmployeeDto } from '@/services/employees/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employeeData: CreateEmployeeDto) => {
      const response = await EmployeeService.createEmployee(employeeData);
      return response;
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
    mutationKey: ['createEmployee'],
  });
};
