import { useSessionManager } from '@/hooks/useSessionManager';

const SessionWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useSessionManager();
  return (
    <>
      {children}
      {/* <SessionTimer /> */}
    </>
  );
};

export default SessionWrapper;
