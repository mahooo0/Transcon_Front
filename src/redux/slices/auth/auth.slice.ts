import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAuthState } from './auth.types';

const initialState: IAuthState = {
  user: {
    id: '',
    login: '',
    fullName: '',
    position: '',
    role: '',
    permissions: [],
  },
  sessionTimeout: 0,
  isAuthenticated: false,
  lastActivity: null,
  sessionWarningShown: false,
  sessionId: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    },
    setSessionTimeOut: (state, action) => {
      return {
        ...state,
        sessionTimeout: action.payload,
        lastActivity: Date.now(),
      };
    },
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload;
    },
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
      if (!action.payload) {
        state.sessionWarningShown = false;
      }
    },
    updateLastActivity: (state) => {
      state.lastActivity = Date.now();
    },
    setSessionWarningShown: (state, action: PayloadAction<boolean>) => {
      state.sessionWarningShown = action.payload;
    },
    logout: () => {
      return initialState;
    },
  },
});

export const { setUser, setSessionTimeOut, setIsAuthenticated, logout, updateLastActivity, setSessionWarningShown } =
  authSlice.actions;

export default authSlice.reducer;
