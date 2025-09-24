import EmployeeService from '@/services/employees';
import { UpdateEmployeeProfileDto } from '@/services/employees/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface IUpdateEmployeeProfileParams {
  id: string;
  profileData: UpdateEmployeeProfileDto;
}

export const useUpdateEmployeeProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, profileData }: IUpdateEmployeeProfileParams) => {
      return await EmployeeService.updateEmployeeProfile(id, profileData);
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
