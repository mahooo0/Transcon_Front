import { api } from '@/api';
import { ApiResponse } from '@/api/types';
import { buildQueryString } from '@/helpers';
import {
  DriversResponse,
  DriversFilterParams,
  CreateDriverDto,
  Driver,
} from './types';

export type { CreateDriverDto };

const baseUrl = 'drivers';

const DriversService = {
  async getDrivers(params?: DriversFilterParams): Promise<DriversResponse> {
    const queryString = params ? buildQueryString(params) : '';
    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;
    const response = await api.get(url);
    return response.data;
  },

  async createDriver(driver: CreateDriverDto): Promise<ApiResponse<Driver>> {
    return await api.post<Driver>(baseUrl, driver);
  },

  async updateDriver(
    id: string,
    driver: CreateDriverDto
  ): Promise<ApiResponse<Driver>> {
    return await api.put<Driver>(`${baseUrl}/${id}`, driver);
  },

  async getDriverById(id: string): Promise<ApiResponse<Driver>> {
    return await api.get<Driver>(`${baseUrl}/${id}`);
  },

  async deleteDriver(id: string): Promise<ApiResponse<void>> {
    return await api.delete<void>(`${baseUrl}/${id}`);
  },
};

export default DriversService;
