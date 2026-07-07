import { Navigate, Outlet } from 'react-router-dom';
import { useAuth, ROLE_CONFIG } from '../contexts/AuthContext';

export default function ProtectedRoute({ allowedRole }) {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  // Enforce role-based namespace
  if (allowedRole && user.role !== allowedRole) {
    const correctPrefix = ROLE_CONFIG[user.role].prefix;
    return <Navigate to={`/${correctPrefix}/dashboard`} replace />;
  }
  
  return <Outlet />;
}
