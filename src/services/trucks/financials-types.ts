export interface TruckFinancials {
  truckId: string;
  registrationNumber: string;
  brand: string;
  model: string;
  status: 'ON_BASE' | 'IN_ROUTE' | 'IN_REPAIR' | 'INACTIVE';
  totalFreights: number;
  totalRevenue: number;
  totalDriverSalary: number;
  totalIncidentsCost: number;
  totalProfit: number;
  averageProfitPerFreight: number;
}

export interface TruckFinancialsResponse {
  success: boolean;
  message: string;
  data: TruckFinancials[];
}
