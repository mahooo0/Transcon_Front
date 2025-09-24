import { useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { logout, setSessionWarningShown } from '@/redux/slices/auth/auth.slice';
import AuthService from '@/services/auth';
import toast from 'react-hot-toast';

export const useSessionManager = () => {
  const dispatch = useDispatch();

  const { isAuthenticated, sessionWarningShown } = useSelector(
    (state: RootState) => state.auth
  );

  const sessionCheckRef = useRef<NodeJS.Timeout | null>(null);
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSessionExpired = useCallback(async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      dispatch(logout());
    }
  }, [dispatch]);

  const checkSessionStatus = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await AuthService.getSessionStatus();

      if (response.success && response.data) {
        const { isActive, timeRemaining } = response.data;

        if (!isActive || timeRemaining <= 0) {
          handleSessionExpired();
          return;
        }

        if (
          timeRemaining <= 300 &&
          timeRemaining > 240 &&
          !sessionWarningShown
        ) {
          const minutes = Math.ceil(timeRemaining / 60);
          toast.error(`Your session will expire in ${minutes} minutes!`);
          dispatch(setSessionWarningShown(true));
        }

        if (timeRemaining > 300 && sessionWarningShown) {
          dispatch(setSessionWarningShown(false));
        }
      } else {
        handleSessionExpired();
      }
    } catch (error) {
      console.error('Session status check failed:', error);
      handleSessionExpired();
    }
  }, [isAuthenticated, sessionWarningShown, handleSessionExpired, dispatch]);

  const handleUserActivity = useCallback(() => {
    if (!isAuthenticated) return;

    // dispatch(updateLastActivity());
  }, [isAuthenticated]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const activityEvents = [
    // 'mousedown',
    // 'mousemove',
    // 'keypress',
    // 'scroll',
    // 'touchstart',
    'click',
    // 'focus',
  ];

  useEffect(() => {
    if (isAuthenticated) {
      activityEvents.forEach((event) => {
        document.addEventListener(event, handleUserActivity, true);
        window.addEventListener(event, handleUserActivity, true);
      });

      checkSessionStatus();

      sessionCheckRef.current = setInterval(checkSessionStatus, 2 * 60 * 1000);

      handleUserActivity();

      return () => {
        activityEvents.forEach((event) => {
          document.removeEventListener(event, handleUserActivity, true);
          window.removeEventListener(event, handleUserActivity, true);
        });

        if (sessionCheckRef.current) {
          clearInterval(sessionCheckRef.current);
        }
        if (activityTimeoutRef.current) {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          clearTimeout(activityTimeoutRef.current);
        }
      };
    }
  }, [
    isAuthenticated,
    handleUserActivity,
    checkSessionStatus,
    dispatch,
    activityEvents,
  ]);

  return {
    checkSessionStatus,
    handleSessionExpired,
  };
};
