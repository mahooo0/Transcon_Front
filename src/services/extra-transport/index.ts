import { api } from '@/api';
import { ApiResponse } from '@/api/types';

import { CreateExtraTransportDto, ExtraTransport } from './types';
import { buildQueryString } from '@/helpers';

//TODO: UPDATE TO users
const baseUrl = '/additional-vehicles';

interface ExtraTransportFilterParams {
  search?: string;
  type?: string;
  page?: number;
  limit?: number;
}

const ExtraTransportService = {
  async getAllExtraTransport(
    params?: ExtraTransportFilterParams
  ): Promise<ApiResponse<ExtraTransport[]>> {
    const queryString = params ? buildQueryString(params) : '';
    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;
    console.log('Making GET request to:', url);
    console.log('Filter params:', params);
    const response = await api.get(url);
    console.log(
      'ExtraTransportService.getAllExtraTransport response:',
      response
    );
    return response;
  },
  async getExtraTransportById(
    id: string
  ): Promise<ApiResponse<ExtraTransport>> {
    return await api.get(`${baseUrl}/${id}`);
  },
  async createExtraTransport(
    extraTransportData: CreateExtraTransportDto
  ): Promise<ApiResponse<ExtraTransport>> {
    console.log(
      'ExtraTransportService.createExtraTransport called with:',
      extraTransportData
    );
    console.log('Making POST request to:', baseUrl);
    const response = await api.post(baseUrl, extraTransportData);
    console.log(
      'ExtraTransportService.createExtraTransport response:',
      response
    );
    return response;
  },
  async updateExtraTransport(
    id: string,
    extraTransportData: CreateExtraTransportDto
  ): Promise<ApiResponse<ExtraTransport>> {
    console.log('ExtraTransportService.updateExtraTransport called with:', {
      id,
      extraTransportData,
    });
    console.log('Making PUT request to:', `${baseUrl}/${id}`);
    const response = await api.put(`${baseUrl}/${id}`, extraTransportData);
    console.log(
      'ExtraTransportService.updateExtraTransport response:',
      response
    );
    return response;
  },
  async deleteExtraTransport(id: string): Promise<ApiResponse<void>> {
    console.log(
      'ExtraTransportService.deleteExtraTransport called with id:',
      id
    );
    console.log('Making DELETE request to:', `${baseUrl}/${id}`);
    const response = await api.delete<void>(`${baseUrl}/${id}`);
    console.log(
      'ExtraTransportService.deleteExtraTransport response:',
      response
    );
    return response;
  },
};

export default ExtraTransportService;
