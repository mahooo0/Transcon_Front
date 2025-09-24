import { PaginationMeta } from '@/types';
import { IPermission } from '../auth/types';

export interface IUserRole {
  id: string;
  name: string;
  description: string;
  permissions: IPermission[];
}

export interface INotes {
  ru?: string;
  pl?: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  phone: string;
  login: string;
  notes?: INotes;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  role: IUserRole;
}

export interface EmployeeFilterParams {
  search?: string;
  role?: string;
  position?: string;
  status?: string;
  sortBy?: 'firstName' | 'lastName' | 'position' | 'createdAt' | 'updatedAt';
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  position: string;
  phone?: string;
  login: string;
  password?: string;
  roleId: string;
  notes?: INotes;
}

export interface UpdateEmployeeDto {
  firstName?: string;
  lastName?: string;
  position?: string;
  phone?: string;
  login?: string;
  password?: string;
  roleId?: string;
  notes?: INotes;
}

export interface UpdateEmployeeProfileDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  notes?: INotes;
}

export interface ChangePasswordDto {
  newPassword: string;
}

export interface EmployeesResponse {
  data: Employee[];
  meta: PaginationMeta;
}

export interface EmployeeStatistics {
  total: number;
  byRole: Record<string, number>;
  activeCount: number;
  inactiveCount: number;
}
