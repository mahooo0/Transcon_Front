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
  truckId: string;
  trailerId: string;
  driverId: string;
  kilometers: number;
  ratePerKm: string;
  currency: string;
  totalAmount: string;
  contractorId: string | null;
  contractorString: string;
  status: string;
  logist: string;
  expectedPaymentDate: string;
  paymentStatus: string;
  general: string;
  responsibleLogistId: string;
}

export interface CreatedByUser {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy: string;
  updatedBy: string;
  isActive: boolean;
  firstName: string;
  lastName: string;
  position: string;
  phone: string;
  login: string;
  password: string;
  notes: string | null;
  roleId: string;
}

export interface IncidentLog {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  isActive: boolean;
  freight: Freight;
  freightId: string;
  incidentDate: string;
  incidentType: 'FUEL' | 'FINE' | 'REPAIR' | 'ADDITIONAL' | 'ROAD';
  description: string;
  financialBurden: 'ON_DRIVER' | 'ON_COMPANY';
  amount: string;
  currency: string;
  notes: string;
  createdByUser: CreatedByUser;
  createdByUserId: string;
  documents: unknown[];
}

export interface IncidentLogsResponse {
  data: IncidentLog[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateIncidentLogDto {
  freightId: string;
  incidentDate: string;
  incidentType: 'FUEL' | 'FINE' | 'REPAIR' | 'ADDITIONAL' | 'ROAD';
  description: string;
  financialBurden: 'ON_DRIVER' | 'ON_COMPANY';
  amount: number;
  currency: string;
  notes: string;
}

export interface IncidentLogsFilterParams {
  incidentType?: string;
  financialBurden?: string;
  freightId?: string;
  createdByUserId?: string;
  currency?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}
