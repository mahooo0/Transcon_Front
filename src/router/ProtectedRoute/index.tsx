import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

interface IProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute = ({ children, requiredRole }: IProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  console.log('Auth:');
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
