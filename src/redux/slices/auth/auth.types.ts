import { IUser } from '@/services/auth/types';

export interface IAuthState {
  user: IUser;
  sessionTimeout: number;
  isAuthenticated: boolean;
  lastActivity: number | null;
  sessionWarningShown: boolean;
  sessionId: string;
}
