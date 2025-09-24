import { AxiosError } from "axios";

class ApiError extends AxiosError {
  constructor(
    message: string,
    public statusCode: number,
    public error?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class NetworkError extends AxiosError {
  constructor(message: string = 'Network Error: No response from server') {
    super(message);
    this.name = 'NetworkError';
  }
}

export { ApiError, NetworkError };
