export interface Trucks {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  isActive: boolean;
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
  };
  status: 'IN_ROUTE' | 'ON_BASE' | 'IN_REPAIR';

  documents: unknown[];
  insuranceStatus: 'active' | 'inactive' | 'expired';
  technicalInspectionStatus: 'active';
}

export interface CreateTruckDto {
  registrationNumber: string;
  brand: string;
  model: string;
  vinNumber: string;
  insuranceFrom: string;
  insuranceTo: string;
  technicalInspectionFrom: string;
  technicalInspectionTo: string;
  notes: {
    ru: string;
    pl: string;
  };
  status: 'IN_ROUTE' | 'ON_BASE' | 'IN_REPAIR';
}

export interface TrucksResponse {
  data: Trucks[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateTruckDto {
  registrationNumber: string;
  brand: string;
  model: string;
  vinNumber: string;
  insuranceFrom: string;
  insuranceTo: string;
  technicalInspectionFrom: string;
  technicalInspectionTo: string;
  notes: {
    ru: string;
    pl: string;
  };
  status: 'IN_ROUTE' | 'ON_BASE' | 'IN_REPAIR';
}
