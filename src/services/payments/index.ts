import { api } from '@/api';
import { ApiResponse } from '@/api/types';
import { buildQueryString } from '@/helpers';
import {
  PaymentsResponse,
  PaymentsFilterParams,
  CreatePaymentDto,
} from './types';

const baseUrl = 'freights/payments';

const PaymentsService = {
  async getPayments(params?: PaymentsFilterParams): Promise<PaymentsResponse> {
    const queryString = params ? buildQueryString(params) : '';
    const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;
    const response = await api.get(url);
    return response.data;
  },

  async createPayment(
    freightId: string,
    payment: CreatePaymentDto
  ): Promise<ApiResponse<unknown>> {
    console.log('API Request URL:', `freights/freight/${freightId}/add`);
    console.log('API Request Body:', payment);

    const response = await api.post(
      `freights/freight/${freightId}/add`,
      payment
    );
    return response;
  },

  async updatePaymentStatus(
    paymentId: string,
    status: 'PENDING' | 'PAID' | 'PARTIAL' | 'OVERDUE' | 'CANCELLED'
  ): Promise<ApiResponse<unknown>> {
    console.log('Обновление статуса платежа:', { paymentId, status });

    // Обновляем статус конкретного платежа
    const response = await api.put(`payments/${paymentId}`, {
      status,
    });
    return response;
  },
};

export default PaymentsService;
