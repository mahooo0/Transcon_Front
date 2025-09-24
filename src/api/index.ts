/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import config from '@/config';
import { ApiResponse } from './types';
import { ApiError, NetworkError } from './errors';
import toast from 'react-hot-toast';
import { logout, updateLastActivity } from '@/redux/slices/auth/auth.slice';
import { store } from '@/redux/store';

class API {
  private fetch: AxiosInstance;

  constructor(baseURL: string, apiKey: string, timeout: number = 5000) {
    this.fetch = axios.create({
      baseURL: `${baseURL}/api/v1`,
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { 'X-API-Key': apiKey }),
      },
      timeout,
      withCredentials: true,
    });

    this.runInterceptors();
  }

  private runInterceptors() {
    axios.interceptors.request.use(
      (config) => {
        const state = store.getState();

        if (state.auth.isAuthenticated) {
          store.dispatch(updateLastActivity());
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    axios.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        console.log('INTERCEPTOR ERROR:', error);
        if (error.response?.status === 401) {
          const state = store.getState();

          if (state.auth.isAuthenticated) {
            store.dispatch(logout());

            if (window.location.pathname !== '/login') {
              toast.error('Session expired. Please login again.');
              window.location.href = '/login';
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T = any>(
    url: string,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.fetch.get(
        url,
        { params }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.fetch.post(url, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.fetch.put(url, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete<T = any>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.fetch.delete(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async downloadFile(url: string): Promise<Blob> {
    try {
      const response = await this.fetch.get(url, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): ApiError | NetworkError {
    if (error.response) {
      throw new ApiError(
        error.response.data?.message || error.response.statusText,
        error.response.status,
        error.response.data?.error
      );
    } else if (error.request) {
      throw new NetworkError();
    } else {
      throw new ApiError(`Request Error: ${error.message}`, 0);
    }
  }
}

console.log(config.apiKey);

export const api = new API(config.backendBaseUrl, config.apiKey);

export default API;
