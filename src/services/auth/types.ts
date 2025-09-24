import { ApiResponse } from '@/api/types';
import { ActionNames, ModuleNames } from '@/types/enum';

export interface ILoginRequest {
  login: string;
  password: string;
}

export interface IPermission {
  id: string;
  name: string;
  module: ModuleNames;
  action: ActionNames;
}

export interface IUser {
  id: string;
  login: string;
  fullName: string;
  role: string;
  position: string;
  permissions: IPermission[];
}

export interface ILoginResponse {
  session_timeout: number;
  user: IUser;
}

export interface SessionStatus {
  sessionId: string;
  isActive: boolean;
  timeRemaining: number;
  lastActivity: string;
}

export interface SessionInfo {
  sessionId: string;
  loginTime: string;
  lastActivity: string;
  userId: string;
  login: string;
  role: string;
}

export interface IRole {
  id: string;
  name: string;
  isActive: boolean;
  //it also have other types...
}

export interface IAuthService {
  login(credentials: ILoginRequest): Promise<ApiResponse<ILoginResponse>>;
  logout(): Promise<ApiResponse<null>>;
  checkAuth(): Promise<ApiResponse<{ authenticated: boolean; user: IUser }>>;
  getProfile(): Promise<ApiResponse<{ user: IUser }>>;
  getSessionStatus(): Promise<ApiResponse<SessionStatus>>;
  validateSession(): Promise<ApiResponse<null>>;
  getRoles(): Promise<ApiResponse<IRole[]>>;
}
