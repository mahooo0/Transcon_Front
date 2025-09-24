import EmployeeService from '@/services/employees';
import { useQuery } from '@tanstack/react-query';

export const useGetEmployee = (id: string) => {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: async () => {
        const response = await EmployeeService.getEmployeeById(id);
        console.log('Response query', response)
        return response.data;
    },
    enabled: Boolean(id),
  });
};
