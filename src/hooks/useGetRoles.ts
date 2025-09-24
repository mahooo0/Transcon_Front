import AuthService from '@/services/auth';
import { useQuery } from '@tanstack/react-query';

export const useGetRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await AuthService.getRoles();
      return response;
    },
  });
};
