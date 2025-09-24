import { api } from '@/api';
import { buildQueryString } from '@/helpers';
import { CreateTrailerDto, TrailerResponse, Trailer } from './types';

const baseUrl = '/trailer';

export interface TrailerFilterParams {
  search?: string;
  type?: string;
  status?: string;
  registrationNumber?: string;
  page?: number;
  limit?: number;
}

const TrailerService = {
  async getAllTrailers(params?: TrailerFilterParams): Promise<TrailerResponse> {
    const queryString = params ? buildQueryString(params) : '';
    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;
    console.log('Making GET request to:', url);
    console.log('Filter params:', params);
    const response = await api.get<TrailerResponse>(url);
    console.log('TrailerService.getAllTrailers response:', response);
    return response.data;
  },

  async createTrailer(data: CreateTrailerDto): Promise<TrailerResponse> {
    console.log('TrailerService.createTrailer called with:', data);
    console.log('Making POST request to:', baseUrl);
    const response = await api.post<TrailerResponse>(baseUrl, data);
    console.log('TrailerService.createTrailer response:', response);
    return response.data;
  },

  async getTrailerById(id: string): Promise<Trailer> {
    console.log('TrailerService.getTrailerById called with ID:', id);
    console.log('Making GET request to:', `${baseUrl}/${id}`);
    const response = await api.get<Trailer>(`${baseUrl}/${id}`);
    console.log('TrailerService.getTrailerById response:', response);
    return response.data;
  },

  async updateTrailer(
    id: string,
    trailerData: CreateTrailerDto
  ): Promise<Trailer> {
    console.log(
      'TrailerService.updateTrailer called with ID:',
      id,
      'Data:',
      trailerData
    );
    console.log('Making PUT request to:', `${baseUrl}/${id}`);
    const response = await api.put<Trailer>(`${baseUrl}/${id}`, trailerData);
    console.log('TrailerService.updateTrailer response:', response);
    return response.data;
  },

  async deleteTrailer(id: string): Promise<void> {
    console.log('TrailerService.deleteTrailer called with ID:', id);
    console.log('Making DELETE request to:', `${baseUrl}/${id}`);
    const response = await api.delete<void>(`${baseUrl}/${id}`);
    console.log('TrailerService.deleteTrailer response:', response);
    return response.data;
  },
};

export default TrailerService;
