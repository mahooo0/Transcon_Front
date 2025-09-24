export interface FreightIncidents {
  onCompany: number;
  onDriver: number;
  additional: number;
  total: number;
}

export interface FreightDriver {
  id: string;
  name: string;
  grossSalary: number;
  incidentDeductions: number;
  netSalary: number;
}

export interface FreightFinancial {
  freightId: string;
  freightNumber: string;
  loadingDate: string;
  unloadingDate: string;
  origin: string;
  destination: string;
  totalRevenue: number;
  incidents: FreightIncidents;
  driver: FreightDriver;
  netProfit: number;
}

export interface FreightFinancialsResponse {
  success: boolean;
  message: string;
  data: FreightFinancial[];
}

export interface FreightFinancialsFilterParams {
  month?: number;
  year?: number;
}
