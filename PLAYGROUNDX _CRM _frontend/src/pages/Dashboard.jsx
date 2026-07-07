import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from '../dashboards/AdminDashboard';
import ExecutiveDashboard from '../dashboards/ExecutiveDashboard';
import ManagerDashboard from '../dashboards/ManagerDashboard';
import SupervisorDashboard from '../dashboards/SupervisorDashboard';
import AgentDashboard from '../dashboards/AgentDashboard';
import ReceptionistDashboard from '../dashboards/ReceptionistDashboard';
import ViewerDashboard from '../dashboards/ViewerDashboard';
import PlatformDashboard from '../dashboards/PlatformDashboard';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();

  // Render role-specific dashboard based on user role
  switch (user?.role) {
    case 'PLATFORM_OWNER':
    case 'PLATFORM_ADMIN':
      return <PlatformDashboard />;
    case 'EXECUTIVE':
      return <ExecutiveDashboard />;
    case 'MANAGER':
      return <ManagerDashboard />;
    case 'SUPERVISOR':
      return <SupervisorDashboard />;
    case 'AGENT':
      return <AgentDashboard />;
    case 'RECEPTIONIST':
      return <ReceptionistDashboard />;
    case 'VIEWER':
      return <ViewerDashboard />;
    case 'TENANT_OWNER':
    default:
      // Keep AdminDashboard exactly as the original monolithic layout for Tenant Owners
      return <AdminDashboard />;
  }
}
