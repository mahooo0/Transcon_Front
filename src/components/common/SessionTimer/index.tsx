import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import AuthService from '@/services/auth';
import { Clock } from 'lucide-react';

export const SessionTimer: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [showTimer, setShowTimer] = useState<boolean>(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowTimer(false);
      return;
    }

    const checkTime = async () => {
      try {
        const response = await AuthService.getSessionStatus();
        console.log('Does it works here', response);
        if (response.success && response.data) {
          const { timeRemaining: remaining } = response.data;
          setTimeRemaining(remaining);

          setShowTimer(remaining <= 600 && remaining > 0);
        }
      } catch (error) {
        setShowTimer(false);
        console.error('Error fetching session status:', error);
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  if (!showTimer) return null;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isUrgent = timeRemaining <= 300;

  return (
    <div
      className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50 ${
        isUrgent
          ? 'bg-red-500 text-white animate-pulse'
          : 'bg-yellow-500 text-black'
      }`}
    >
      <Clock size={16} />
      <span className="font-semibold">
        Session expires: {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
};
