export interface Trailer {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  isActive: boolean;
  registrationNumber: string;
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
  documents: unknown[];
  insuranceStatus: 'active' | 'inactive' | 'expired';
  technicalInspectionStatus: 'active' | 'inactive' | 'expired';
}

export interface TrailerResponse {
  data: Trailer[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateTrailerDto {
  registrationNumber: string;
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
