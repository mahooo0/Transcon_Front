export interface DriverSalary {
  driverId: string;
  driverName: string;
  dailyRate: string;
  workedDays: number;
  totalDeductions: number;
  grossSalary: number;
  netSalary: number;
  currency: string;
}

export interface DriverSalaryResponse {
  success: boolean;
  message: string;
  data: DriverSalary[];
}

export interface DriverSalaryFilterParams {
  month?: number;
  year?: number;
}
