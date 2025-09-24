export interface DriverDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface Driver {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy: string;
  updatedBy: string | null;
  isActive: boolean;
  firstName: string;
  lastName: string;
  phone: string;
  contractEndDate: string;
  status: 'ON_BASE' | 'IN_ROUTE' | 'ON_LEAVE' | 'INACTIVE';
  dailyRate: string;
  currency: string;
  notes: string;
  documents: DriverDocument[];
  contractStatus: 'active' | 'expired' | 'pending';
  daysUntilExpiration: number;
}

export interface DriversResponse {
  success: boolean;
  message: string;

  data: Driver[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DriversFilterParams {
  status?: string;
  contractStatus?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateDriverDto {
  firstName: string;
  lastName: string;
  phone: string;
  contractEndDate: string;
  dailyRate: string;
  currency: string;
  notes?: string;
}
