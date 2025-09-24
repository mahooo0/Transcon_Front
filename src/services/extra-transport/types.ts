export interface ExtraTransport {
  id: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  deletedAt: string | null;
  createdBy: string;
  updatedBy: string | null;
  isActive: boolean;
  registrationNumber: string;
  name: string;
  type: string;
  insuranceFrom: string; // "YYYY-MM-DD"
  insuranceTo: string; // "YYYY-MM-DD"
  technicalInspectionFrom: string; // "YYYY-MM-DD"
  technicalInspectionTo: string; // "YYYY-MM-DD"
  notes: string | null;
  //TODO: add documents type
  documents: unknown[]; // or create a proper type if you know structure
  insuranceStatus: 'active' | 'inactive' | 'expired'; // extend if needed
  technicalInspectionStatus: 'active' | 'inactive' | 'expired'; // extend if needed
}

export interface CreateExtraTransportDto {
  registrationNumber: string;
  name: string;
  type: string;
  insuranceFrom: string;
  insuranceTo: string;
  technicalInspectionFrom: string;
  technicalInspectionTo: string;
  notes: string;
}
