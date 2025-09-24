import { api } from '@/api';
import { buildQueryString } from '@/helpers';
import {
  FreightFinancialsResponse,
  FreightFinancialsFilterParams,
} from './types';

const baseUrl = 'driver-salary/freights/financials';

const FreightFinancialsService = {
  async getFreightFinancials(
    params?: FreightFinancialsFilterParams
  ): Promise<FreightFinancialsResponse> {
    const queryString = params ? buildQueryString(params) : '';
    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;
    const response = await api.get(url);
    return response.data;
  },
};

export default FreightFinancialsService;
