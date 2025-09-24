import EmployeeService from '@/services/employees';
import { UpdateEmployeeDto } from '@/services/employees/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdateEmployeeParams {
  id: string;
  employeeData: UpdateEmployeeDto;
}

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, employeeData }: UpdateEmployeeParams) => {
      return await EmployeeService.updateEmployee(id, employeeData);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });

      queryClient.invalidateQueries({
        queryKey: ['employee', variables.id],
      });
    },
    onError: (error) => {
      console.error('Failed to update employee:', error);
    },
  });
};
