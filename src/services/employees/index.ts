import { api } from '@/api';
import { ApiResponse } from '@/api/types';
import {
  ChangePasswordDto,
  CreateEmployeeDto,
  Employee,
  EmployeeFilterParams,
  EmployeeStatistics,
  UpdateEmployeeDto,
  UpdateEmployeeProfileDto,
} from './types';
import { buildQueryString } from '@/helpers';

//TODO: UPDATE TO users
const baseUrl = '/employees';

const EmployeeService = {
  async getAllEmployees(
    params?: EmployeeFilterParams
  ): Promise<ApiResponse<Employee[]>> {
    const queryString = params ? buildQueryString(params) : '';
    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;
    return await api.get(url);
  },

  async createEmployee(
    employee: CreateEmployeeDto
  ): Promise<ApiResponse<Employee>> {
    return await api.post<Employee>(baseUrl, employee);
  },

  async updateEmployee(
    id: string,
    employee: UpdateEmployeeDto
  ): Promise<ApiResponse<Employee>> {
    return await api.put<Employee>(`${baseUrl}/${id}`, employee);
  },

  async getEmployeeById(id: string): Promise<ApiResponse<Employee>> {
    const response = await api.get<Employee>(`${baseUrl}/${id}`);
    return response;
  },

  async updateEmployeeProfile(
    id: string,
    profile: UpdateEmployeeProfileDto
  ): Promise<ApiResponse<Employee>> {
    return await api.put<Employee>(`${baseUrl}/${id}/profile`, profile);
  },

  async changeEmployeePassword(
    id: string,
    passwordData: ChangePasswordDto
  ): Promise<ApiResponse<void>> {
    return await api.put<void>(`${baseUrl}/${id}/password`, passwordData);
  },

  async toggleEmployeeStatus(id: string): Promise<ApiResponse<void>> {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await api.delete<void>(`${baseUrl}/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  async getEmployeeStatistics(): Promise<ApiResponse<EmployeeStatistics>> {
    return await api.get<EmployeeStatistics>(`${baseUrl}/statistics`);
  },

  async getUniquePositions(): Promise<ApiResponse<string[]>> {
    return await api.get<string[]>(`${baseUrl}/positions`);
  },
};

export default EmployeeService;
