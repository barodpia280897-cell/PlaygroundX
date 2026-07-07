import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import MainLayout from './layouts/MainLayout';
import PlatformLayout from './layouts/PlatformLayout';

// Always eagerly-loaded (small, needed at root)
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import OfflineBanner from './components/ui/OfflineBanner';

// ── Lazy-loaded page bundles ─────────────────────────────────────────────────
const Dashboard          = lazy(() => import('./pages/Dashboard'));
const Sections           = lazy(() => import('./pages/Sections'));
const CommunicationCenter= lazy(() => import('./pages/CommunicationCenter'));
const Emails             = lazy(() => import('./pages/Emails'));
const Leads              = lazy(() => import('./pages/Leads'));
const LeadDetails        = lazy(() => import('./pages/LeadDetails'));
const Creators           = lazy(() => import('./pages/Creators'));
const Fans               = lazy(() => import('./pages/Fans'));
const CreatorSuccess     = lazy(() => import('./pages/CreatorSuccess'));
const FanActivation      = lazy(() => import('./pages/FanActivation'));
const Pipelines          = lazy(() => import('./pages/Pipelines'));
const AICenter           = lazy(() => import('./pages/AICenter'));
const Escalations        = lazy(() => import('./pages/Escalations'));
const Tasks              = lazy(() => import('./pages/Tasks'));
const Calendar           = lazy(() => import('./pages/Calendar'));
const Reports            = lazy(() => import('./pages/Reports'));
const Revenue            = lazy(() => import('./pages/Revenue'));
const Agents             = lazy(() => import('./pages/Agents'));
const AgentWorkspace     = lazy(() => import('./pages/AgentWorkspace'));
const QualityAssurance   = lazy(() => import('./pages/QualityAssurance'));
const Campaigns          = lazy(() => import('./pages/Campaigns'));
const VIPCenter          = lazy(() => import('./pages/VIPCenter'));
const Automations        = lazy(() => import('./pages/Automations'));
const Settings           = lazy(() => import('./pages/Settings'));
const Integrations       = lazy(() => import('./pages/Integrations'));
const SystemHealth       = lazy(() => import('./pages/SystemHealth'));
const RoutingRules       = lazy(() => import('./pages/RoutingRules'));
const KnowledgeBase      = lazy(() => import('./pages/KnowledgeBase'));
const MessageTemplates   = lazy(() => import('./pages/MessageTemplates'));
const ExecutiveReports      = lazy(() => import('./pages/ExecutiveReports'));
const BusinessAnalytics     = lazy(() => import('./pages/BusinessAnalytics'));
const RevenueAnalytics      = lazy(() => import('./pages/RevenueAnalytics'));
const GrowthDashboard       = lazy(() => import('./pages/GrowthDashboard'));
const CampaignAnalytics     = lazy(() => import('./pages/CampaignAnalytics'));
const VIPAnalytics          = lazy(() => import('./pages/VIPAnalytics'));
const AIInsights            = lazy(() => import('./pages/AIInsights'));
const DepartmentPerformance = lazy(() => import('./pages/DepartmentPerformance'));
const KPIDashboard          = lazy(() => import('./pages/KPIDashboard'));
const QueueMonitor         = lazy(() => import('./pages/QueueMonitor'));
const OperationsDashboard  = lazy(() => import('./pages/OperationsDashboard'));
const SupervisorMonitoring = lazy(() => import('./pages/SupervisorMonitoring'));
const VideoCall            = lazy(() => import('./pages/VideoCall'));
const AppointmentCenter    = lazy(() => import('./pages/AppointmentCenter'));
const LiveActivityFeed     = lazy(() => import('./pages/LiveActivityFeed'));
const NotificationCenter   = lazy(() => import('./pages/NotificationCenter'));
const AuditLogs            = lazy(() => import('./pages/AuditLogs'));
const ReceptionistDashboard  = lazy(() => import('./dashboards/ReceptionistDashboard'));
const Visitors               = lazy(() => import('./pages/Visitors'));
const WalkInCustomers        = lazy(() => import('./pages/WalkInCustomers'));
const ReceptionCalls         = lazy(() => import('./pages/ReceptionCalls'));
const ReceptionMessages      = lazy(() => import('./pages/ReceptionMessages'));
const PlatformDashboard      = lazy(() => import('./dashboards/PlatformDashboard'));
const PlatformTenants        = lazy(() => import('./pages/platform/PlatformTenants'));
const PlatformTrialAccounts  = lazy(() => import('./pages/platform/PlatformTrialAccounts'));
const PlatformBilling        = lazy(() => import('./pages/platform/PlatformBilling'));
const PlatformInvoices       = lazy(() => import('./pages/platform/PlatformInvoices'));
const PlatformFailedPayments = lazy(() => import('./pages/platform/PlatformFailedPayments'));
const PlatformAPI            = lazy(() => import('./pages/platform/PlatformAPI'));
const PlatformWebhooks       = lazy(() => import('./pages/platform/PlatformWebhooks'));
const PlatformSupport        = lazy(() => import('./pages/platform/PlatformSupport'));
const PlatformAuditLogs      = lazy(() => import('./pages/platform/PlatformAuditLogs'));
const PlatformSettings       = lazy(() => import('./pages/platform/PlatformSettings'));

import { DataProvider } from './contexts/DataContext';
import { DepartmentProvider } from './contexts/DepartmentContext';

import { PLATFORM_MENU, TENANT_MENU } from './config/navigation';
import { getRolePrefix } from './utils/routing';

// ── Page loading fallback ────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin" />
        <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">Loading…</p>
      </div>
    </div>
  );
}

function RootRedirect() {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.scope === 'PLATFORM') return <Navigate to="/platform/dashboard" replace />;
  const prefix = getRolePrefix(user?.role);
  return <Navigate to={`/${prefix}/dashboard`} replace />;
}

// Scope protection components
const ScopeProtectedRoute = ({ requiredScope, children }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.scope !== requiredScope) return <Navigate to="/" replace />;
  return children;
};


const PlatformRouteGuard = ({ path, element }) => {
  const { user } = useAuth();
  const cleanPath = path.split('/:')[0];
  const menuItem = PLATFORM_MENU.find(item => item.path.replace('/platform/', '') === cleanPath);
  if (menuItem && user && !menuItem.allowedRoles.includes(user.role)) {
    return <Navigate to="/platform/dashboard" replace />;
  }
  return element;
};

const TenantRouteGuard = ({ path, element }) => {
  const { user } = useAuth();
  const cleanPath = path.split('/:')[0];
  
  const flatTenantMenu = TENANT_MENU.reduce((acc, item) => {
    if (item.children) return [...acc, ...item.children];
    return [...acc, item];
  }, []);

  // We can't rely on the exact path for prefix if we hardcode it to replace /app/
  // The clean path from path property inside TenantRouteGuard is already omitting the prefix because we pass path="leads"
  
  const menuItem = flatTenantMenu.find(item => {
    const itemPath = item.path ? item.path.split('/').pop() : '';
    return itemPath === cleanPath;
  });
  
  if (menuItem && user && !menuItem.allowedRoles.includes(user.role)) {
    return <Navigate to={`/${getRolePrefix(user.role)}/dashboard`} replace />;
  }
  return element;
};

export default function App() {
  return (
    <BrowserRouter>
      <OfflineBanner />
      <AuthProvider>
        <DataProvider>
          <DepartmentProvider>
            <ToastProvider>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                {/* Public route */}
                <Route path="/login" element={<Login />} />

              {/* PLATFORM ROUTES */}
              <Route path="/platform/*" element={<ScopeProtectedRoute requiredScope="PLATFORM"><PlatformLayout /></ScopeProtectedRoute>}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard"       element={<PlatformDashboard />} />
                <Route path="analytics"       element={<Navigate to="../dashboard" replace />} />
                {/* [arena-admin MOVED] */}
                <Route path="tenants"         element={<PlatformRouteGuard path="tenants" element={<PlatformTenants />} />} />
                <Route path="trials"          element={<PlatformRouteGuard path="trials" element={<PlatformTrialAccounts />} />} />
                <Route path="billing"         element={<PlatformRouteGuard path="billing" element={<PlatformBilling />} />} />
                <Route path="invoices"        element={<PlatformRouteGuard path="invoices" element={<PlatformInvoices />} />} />
                <Route path="failed-payments" element={<PlatformRouteGuard path="failed-payments" element={<PlatformFailedPayments />} />} />
                <Route path="revenue"         element={<PlatformRouteGuard path="billing" element={<PlatformBilling />} />} />
                <Route path="api"             element={<PlatformRouteGuard path="api" element={<PlatformAPI />} />} />
                <Route path="webhooks"        element={<PlatformRouteGuard path="webhooks" element={<PlatformWebhooks />} />} />
                <Route path="support"         element={<PlatformRouteGuard path="support" element={<PlatformSupport />} />} />
                <Route path="audit"           element={<PlatformRouteGuard path="audit" element={<PlatformAuditLogs />} />} />
                <Route path="settings"        element={<PlatformRouteGuard path="settings" element={<PlatformSettings />} />} />
              </Route>

              {/* TENANT ROUTES */}
              <Route path="/:rolePrefix/*" element={<ScopeProtectedRoute requiredScope="TENANT"><MainLayout /></ScopeProtectedRoute>}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard"       element={<Dashboard />} />
                
                {/* CRM */}
                <Route path="leads"           element={<TenantRouteGuard path="leads" element={<Leads />} />} />
                <Route path="leads/:id"       element={<TenantRouteGuard path="leads" element={<LeadDetails />} />} />
                <Route path="creators"        element={<TenantRouteGuard path="creators" element={<Creators />} />} />
                <Route path="fans"            element={<TenantRouteGuard path="fans" element={<Fans />} />} />
                <Route path="pipelines"       element={<TenantRouteGuard path="pipelines" element={<Pipelines />} />} />
                
                {/* Operations */}
                <Route path="ai-center"       element={<TenantRouteGuard path="ai-center" element={<AICenter />} />} />
                <Route path="tasks"           element={<TenantRouteGuard path="tasks" element={<Tasks />} />} />
                <Route path="calendar"        element={<TenantRouteGuard path="calendar" element={<Calendar />} />} />
                <Route path="reports"         element={<TenantRouteGuard path="reports" element={<Reports />} />} />
                <Route path="agents"          element={<TenantRouteGuard path="agents" element={<Agents />} />} />
                <Route path="workspace"       element={<TenantRouteGuard path="workspace" element={<AgentWorkspace />} />} />
                <Route path="reception"       element={<TenantRouteGuard path="reception" element={<ReceptionistDashboard />} />} />
                <Route path="escalations"     element={<TenantRouteGuard path="escalations" element={<Escalations />} />} />
                <Route path="revenue"         element={<TenantRouteGuard path="revenue" element={<Revenue />} />} />
                <Route path="quality"         element={<TenantRouteGuard path="quality" element={<QualityAssurance />} />} />
                
                {/* Growth */}
                <Route path="automations"     element={<TenantRouteGuard path="automations" element={<Automations />} />} />
                <Route path="campaigns"       element={<TenantRouteGuard path="campaigns" element={<Campaigns />} />} />
                <Route path="vip"             element={<TenantRouteGuard path="vip" element={<VIPCenter />} />} />
                {/* [arena-analytics MOVED] */}
                
                {/* System */}
                <Route path="sections"        element={<TenantRouteGuard path="sections" element={<Sections />} />} />
                <Route path="section-performance" element={<TenantRouteGuard path="sections" element={<Sections />} />} />
                <Route path="conversations"   element={<TenantRouteGuard path="conversations" element={<CommunicationCenter />} />} />
                <Route path="emails"          element={<TenantRouteGuard path="emails" element={<Emails />} />} />
                <Route path="creator-success" element={<TenantRouteGuard path="creator-success" element={<CreatorSuccess />} />} />
                <Route path="fan-activation"  element={<TenantRouteGuard path="fan-activation" element={<FanActivation />} />} />
                <Route path="integrations"    element={<TenantRouteGuard path="integrations" element={<Integrations />} />} />
                <Route path="settings"        element={<TenantRouteGuard path="settings" element={<Settings />} />} />
                <Route path="system-health"   element={<TenantRouteGuard path="system-health" element={<SystemHealth />} />} />
                <Route path="routing-rules"   element={<TenantRouteGuard path="routing-rules" element={<RoutingRules />} />} />
                <Route path="knowledge-base"  element={<TenantRouteGuard path="knowledge-base" element={<KnowledgeBase />} />} />
                <Route path="templates"       element={<TenantRouteGuard path="templates" element={<MessageTemplates />} />} />
                
                <Route path="queue-monitor"   element={<TenantRouteGuard path="queue-monitor" element={<QueueMonitor />} />} />
                <Route path="supervisor"      element={<TenantRouteGuard path="supervisor" element={<SupervisorMonitoring />} />} />
                <Route path="operations"      element={<TenantRouteGuard path="operations" element={<OperationsDashboard />} />} />
                <Route path="video-call"      element={<TenantRouteGuard path="video-call" element={<VideoCall />} /> } />
                <Route path="appointments"    element={<TenantRouteGuard path="appointments" element={<AppointmentCenter />} />} />
                <Route path="activity-feed"   element={<TenantRouteGuard path="activity-feed" element={<LiveActivityFeed />} />} />
                <Route path="notifications"   element={<TenantRouteGuard path="notifications" element={<NotificationCenter />} />} />
                <Route path="audit"           element={<TenantRouteGuard path="audit" element={<AuditLogs />} />} />

                {/* Receptionist */}
                <Route path="reception"       element={<TenantRouteGuard path="reception" element={<ReceptionistDashboard />} />} />
                <Route path="visitors"        element={<TenantRouteGuard path="visitors" element={<Visitors />} />} />
                <Route path="walk-ins"        element={<TenantRouteGuard path="walk-ins" element={<WalkInCustomers />} />} />
                <Route path="reception-calls" element={<TenantRouteGuard path="reception-calls" element={<ReceptionCalls />} />} />
                <Route path="reception-messages" element={<TenantRouteGuard path="reception-messages" element={<ReceptionMessages />} />} />

                {/* Executive / Analytics */}
                <Route path="executive-reports"      element={<TenantRouteGuard path="executive-reports" element={<ExecutiveReports />} />} />
                <Route path="business-analytics"     element={<TenantRouteGuard path="business-analytics" element={<BusinessAnalytics />} />} />
                <Route path="revenue-analytics"      element={<TenantRouteGuard path="revenue-analytics" element={<RevenueAnalytics />} />} />
                <Route path="growth-dashboard"       element={<TenantRouteGuard path="growth-dashboard" element={<GrowthDashboard />} />} />
                <Route path="campaign-analytics"     element={<TenantRouteGuard path="campaign-analytics" element={<CampaignAnalytics />} />} />
                <Route path="vip-analytics"          element={<TenantRouteGuard path="vip-analytics" element={<VIPAnalytics />} />} />
                <Route path="ai-insights"            element={<TenantRouteGuard path="ai-insights" element={<AIInsights />} />} />
                <Route path="department-performance" element={<TenantRouteGuard path="department-performance" element={<DepartmentPerformance />} />} />
                <Route path="kpi-dashboard"          element={<TenantRouteGuard path="kpi-dashboard" element={<KPIDashboard />} />} />
                {/* [viewer analytics MOVED] */}

                {/* Fallback inside namespace */}
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Route>

              {/* [ENTERTAINMENT / ARENA ROUTES MOVED TO SPORTS-ARENA PROJECT] */}
              {/* [VIEWER DASHBOARD MOVED TO SPORTS-ARENA PROJECT] */}

              {/* Root and Fallback */}
              <Route path="/" element={<RootRedirect />} />
              <Route path="*" element={<NotFound />} />
              </Routes>
              </Suspense>
            </ToastProvider>
          </DepartmentProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
