 
import { api } from '@/api';
import { ApiResponse } from '@/api/types';
import {
  IAuthService,
  ILoginRequest,
  ILoginResponse,
  IRole,
  IUser,
  SessionStatus,
} from './types';

const baseUrl = '/auth';

const AuthService: IAuthService = {
  async login(
    credentials: ILoginRequest
  ): Promise<ApiResponse<ILoginResponse>> {
    const res = await api.post<ILoginResponse>(`${baseUrl}/login`, credentials);
    return res;
  },

  async checkAuth(): Promise<
    ApiResponse<{ authenticated: boolean; user: IUser }>
  > {
    const res = await api.get<{ authenticated: boolean; user: IUser }>(
      `${baseUrl}/check`
    );
    return res;
  },

  async getProfile(): Promise<ApiResponse<{ user: IUser }>> {
    const res = await api.get<{ user: IUser }>(`${baseUrl}/profile`);
    return res;
  },

  async logout(): Promise<ApiResponse<null>> {
    const res = await api.post<null>(`${baseUrl}/logout`);
    return res;
  },

  async getSessionStatus(): Promise<ApiResponse<SessionStatus>> {
    try {
      const response = await api.get('/auth/session-status');
      return response;
    } catch (error) {
      console.error('Session status check failed:', error);
      throw error;
    }
  },

  async validateSession() {
    try {
      const response = await api.get('/auth/validate-session');
      return response;
    } catch (error) {
      console.error('Session validation failed:', error);
      throw error;
    }
  },

  async getRoles(): Promise<ApiResponse<IRole[]>> {
    try {
      const response = await api.get('/auth/roles');
      return response;
    } catch (error) {
      console.error('Failed to fetch roles:', error);
      throw error;
    }
  },
};

export default AuthService;
