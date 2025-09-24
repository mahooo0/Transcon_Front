import { api } from '@/api';
import { buildQueryString } from '@/helpers';
import { DriverSalaryResponse, DriverSalaryFilterParams } from './types';

const baseUrl = 'driver-salary/all';

const DriverSalaryService = {
  async getDriverSalaries(
    params?: DriverSalaryFilterParams
  ): Promise<DriverSalaryResponse> {
    const queryString = params ? buildQueryString(params) : '';
    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;
    const response = await api.get(url);
    return response.data;
  },
};

export default DriverSalaryService;
