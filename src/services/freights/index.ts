import { api } from '@/api';
import { ApiResponse } from '@/api/types';
import { buildQueryString } from '@/helpers';

export interface Truck {
  id: string;
  registrationNumber: string;
  brand: string;
  model: string;
  vinNumber: string;
  insuranceFrom: string;
  insuranceTo: string;
  technicalInspectionFrom: string;
  technicalInspectionTo: string;
  notes: {
    pl: string;
    ru: string;
  } | null;
  status: string;
}

export interface Trailer {
  id: string;
  registrationNumber: string;
  vinNumber: string;
  insuranceFrom: string;
  insuranceTo: string;
  technicalInspectionFrom: string;
  technicalInspectionTo: string;
  notes: string | null;
  status: string;
}

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  contractEndDate: string;
  status: string;
  dailyRate: string;
  currency: string;
  notes: string;
}

export interface ResponsibleLogist {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  phone: string;
  login: string;
  notes: string | null;
}

export interface Freight {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  isActive: boolean;
  loadingDate: string;
  unloadingDate: string;
  loadingCode: string;
  unloadingCode: string;
  countries: string;
  truck: Truck;
  truckId: string;
  trailer: Trailer;
  trailerId: string;
  driver: Driver;
  driverId: string;
  kilometers: number;
  ratePerKm: number | null;
  currency: string;
  totalAmount: string;
  contractorId: string | null;
  contractorString: string;
  status: string;
  logist: string;
  expectedPaymentDate: string;
  paymentStatus: string;
  general: string;
  responsibleLogist: ResponsibleLogist;
  responsibleLogistId: string;
  documents: unknown[];
}

export interface FreightFilterParams {
  status?: string;
  driverId?: number;
  truckId?: number;
  trailerId?: number;
  contractorString?: string;
  countryFrom?: string;
  countryTo?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface FreightMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FreightResponse {
  data: Freight[];
  meta: FreightMeta;
}

export interface CreateFreightDto {
  truckId: string;
  trailerId: string;
  driverId: string;
  loadingDate: string;
  unloadingDate: string;
  loadingCode: string;
  unloadingCode: string;
  countries: string;
  kilometers: number;
  ratePerKm: number;
  currency: string;
  totalAmount: number;
  contractorString: string;
  responsibleLogistId: string;
  logist: string;
  general?: string;
  expectedPaymentDate: string;
}

const baseUrl = 'freights';

const FreightService = {
  async getAllFreights(
    params?: FreightFilterParams
  ): Promise<ApiResponse<FreightResponse>> {
    const queryString = params ? buildQueryString(params) : '';
    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;
    return await api.get(url);
  },

  async getFreightById(id: string): Promise<ApiResponse<Freight>> {
    return await api.get<Freight>(`${baseUrl}/${id}`);
  },

  async createFreight(
    freight: CreateFreightDto
  ): Promise<ApiResponse<Freight>> {
    return await api.post<Freight>(baseUrl, freight);
  },

  async updateFreight(
    id: string,
    freight: Partial<Freight>
  ): Promise<ApiResponse<Freight>> {
    return await api.put<Freight>(`${baseUrl}/${id}`, freight);
  },

  async deleteFreight(id: string): Promise<ApiResponse<void>> {
    return await api.delete<void>(`${baseUrl}/${id}`);
  },
};

export default FreightService;
