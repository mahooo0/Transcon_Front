import { UserRole } from '@/types/enum';

const userRoleMap: Record<UserRole, string> = {
  [UserRole.EMPLOYEE]: 'Employee',
  [UserRole.SUPER_EMPLOYEE]: 'Super Employee',
  [UserRole.ADMIN]: 'Admin',
  [UserRole.SUPER_ADMIN]: 'Super Admin',
};

export const getUserRole = (role: UserRole | string): string => {
  return userRoleMap[role as UserRole] ?? role;
};

export const SUPPORTED_LANGUAGES = [
  { code: 'ru', label: 'Русский' },
  { code: 'pl', label: 'Polski' },
];

//todo: fix this
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const buildQueryString = (params: Record<string, any>) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });
  return searchParams.toString();
};
