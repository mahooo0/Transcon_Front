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
  status: string;
  dailyRate: string;
  currency: string;
  notes: string;
}

export interface Payment {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  isActive: boolean;
  freightId: string;
  expectedPaymentDate: string;
  actualPaymentDate: string | null;
  amount: string;
  paidAmount: string | null;
  currency: string;
  status: 'PENDING' | 'PAID' | 'PARTIAL' | 'OVERDUE' | 'CANCELLED';
  notes: string | null;
  paymentDate: string | null;
}

export interface FreightPayment {
  freightId: string;
  freightNumber: string;
  totalAmount: string;
  paidAmount: number;
  remainingAmount: number;
  status: 'PENDING' | 'PAID' | 'PARTIAL' | 'OVERDUE' | 'CANCELLED';
  driver: Driver;
  payments: Payment[];
}

export interface PaymentsResponse {
  success: boolean;
  message: string;
  data: FreightPayment[];
}

export interface PaymentsFilterParams {
  month?: number;
  year?: number;
  status?: string;
  driverId?: string;
  freightId?: string;
  search?: string;
}

export interface CreatePaymentDto {
  amount: number;
  paidAmount: number;
  expectedPaymentDate: string;
  actualPaymentDate: string;
  currency: string;
  notes: string;
}
