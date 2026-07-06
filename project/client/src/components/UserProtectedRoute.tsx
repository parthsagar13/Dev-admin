import { Navigate, Outlet } from 'react-router-dom';
import { useUserAuth } from '@/context/UserAuthContext';

export const UserProtectedRoute = () => {
  const { isAuthenticated } = useUserAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};
