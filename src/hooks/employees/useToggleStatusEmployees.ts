import EmployeeService from '@/services/employees';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useToggleStatusEmployees = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (employeeId: string) => {
      await EmployeeService.toggleEmployeeStatus(employeeId);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
    mutationKey: ['toggleEmployeeStatus'],
  });
};
