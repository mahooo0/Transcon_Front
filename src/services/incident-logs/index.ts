import { api } from '@/api';
import { ApiResponse } from '@/api/types';
import { buildQueryString } from '@/helpers';
import {
  IncidentLog,
  IncidentLogsResponse,
  IncidentLogsFilterParams,
  CreateIncidentLogDto,
} from './types';

const baseUrl = 'incident-logs';

const IncidentLogsService = {
  async getAllIncidentLogs(
    params?: IncidentLogsFilterParams
  ): Promise<ApiResponse<IncidentLogsResponse>> {
    const queryString = params ? buildQueryString(params) : '';
    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;
    return await api.get(url);
  },

  async getIncidentLogById(id: string): Promise<ApiResponse<IncidentLog>> {
    return await api.get<IncidentLog>(`${baseUrl}/${id}`);
  },

  async createIncidentLog(
    incidentLog: CreateIncidentLogDto
  ): Promise<ApiResponse<IncidentLog>> {
    return await api.post<IncidentLog>(baseUrl, incidentLog);
  },

  async updateIncidentLog(
    id: string,
    incidentLog: CreateIncidentLogDto
  ): Promise<ApiResponse<IncidentLog>> {
    return await api.put<IncidentLog>(`${baseUrl}/${id}`, incidentLog);
  },
};

export default IncidentLogsService;
