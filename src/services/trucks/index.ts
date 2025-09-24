import { api } from '@/api';
import { buildQueryString } from '@/helpers';
import { CreateTruckDto, TrucksResponse, Trucks } from './types';
import {  TruckFinancials } from './financials-types';

//TODO: UPDATE TO users
const baseUrl = '/trucks';

export interface TrucksFilterParams {
  search?: string;
  type?: string;
  status?: string;
  brand?: string;
  registrationNumber?: string;
  page?: number;
  limit?: number;
}

const TrucksService = {
  async getAllTrucks(params?: TrucksFilterParams): Promise<TrucksResponse> {
    const queryString = params ? buildQueryString(params) : '';
    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;
    console.log('Making GET request to:', url);
    console.log('Filter params:', params);
    const response = await api.get<TrucksResponse>(url);
    console.log('TrucksService.getAllTrucks response:', response);
    return response.data;
  },

  async createTruck(data: CreateTruckDto): Promise<TrucksResponse> {
    const response = await api.post<TrucksResponse>(baseUrl, data);
    return response.data;
  },
  async getTruckById(id: string): Promise<Trucks> {
    console.log('TrucksService.getTruckById called with ID:', id);
    console.log('Making GET request to:', `${baseUrl}/${id}`);
    const response = await api.get<Trucks>(`${baseUrl}/${id}`);
    console.log('TrucksService.getTruckById response:', response);
    return response.data;
  },

  async updateTruck(id: string, truckData: CreateTruckDto): Promise<Trucks> {
    console.log(
      'TrucksService.updateTruck called with ID:',
      id,
      'Data:',
      truckData
    );
    console.log('Making PUT request to:', `${baseUrl}/${id}`);
    const response = await api.put<Trucks>(`${baseUrl}/${id}`, truckData);
    console.log('TrucksService.updateTruck response:', response);
    return response.data;
  },

  async deleteTruck(id: string): Promise<void> {
    console.log('TrucksService.deleteTruck called with ID:', id);
    console.log('Making DELETE request to:', `${baseUrl}/${id}`);
    const response = await api.delete<void>(`${baseUrl}/${id}`);
    console.log('TrucksService.deleteTruck response:', response);
    return response.data;
  },

  async getTruckFinancials(): Promise<TruckFinancials[]> {
    const url = `${baseUrl}/financials/all`;
    console.log('Making GET request to:', url);
    const response = await api.get<TruckFinancials[]>(url);
    console.log('TrucksService.getTruckFinancials response:', response);
    console.log(
      'TrucksService.getTruckFinancials response.data:',
      response.data
    );
    console.log(
      'TrucksService.getTruckFinancials response.data.data:',
      response.data
    );
    return response.data || [];
  },
};

export default TrucksService;
