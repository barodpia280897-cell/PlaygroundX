import {
  Home, Building2, MessageCircle, Users, Star, Heart, TrendingUp, Flame,
  GitBranch, Bot, AlertTriangle, CheckSquare, Calendar as CalendarIcon, BarChart2,
  DollarSign, Headphones, ShieldCheck, Megaphone, Crown, Zap,
  Settings, Link2, Activity, PieChart, LineChart, Briefcase, Mail,
  GitMerge, Book, MessageSquare, List, CreditCard, LayoutDashboard, Globe, Eye, Video, Clock, FileText, PhoneCall, Smartphone, Bell
} from 'lucide-react';

// PLATFORM MENU (PlayGroundX Global Admin)
export const PLATFORM_MENU = [
  // Dashboard
  { id: 'p-dashboard', label: 'Platform Overview', icon: LayoutDashboard, path: '/platform/dashboard', category: 'Dashboard', allowedRoles: ['PLATFORM_OWNER', 'PLATFORM_ADMIN'] },

  // Tenant Management
  { id: 'p-tenants', label: 'All Tenants', icon: Building2, path: '/platform/tenants', category: 'Tenant Management', allowedRoles: ['PLATFORM_OWNER', 'PLATFORM_ADMIN', 'PLATFORM_SUPPORT'] },
  { id: 'p-trials', label: 'Trial Accounts', icon: Clock, path: '/platform/trials', category: 'Tenant Management', allowedRoles: ['PLATFORM_OWNER', 'PLATFORM_ADMIN'] },
  
  // Billing & Subscriptions
  { id: 'p-billing', label: 'Subscriptions', icon: CreditCard, path: '/platform/billing', category: 'Billing & Payments', allowedRoles: ['PLATFORM_OWNER', 'PLATFORM_ADMIN'] },
  { id: 'p-invoices', label: 'Invoices', icon: FileText, path: '/platform/invoices', category: 'Billing & Payments', allowedRoles: ['PLATFORM_OWNER', 'PLATFORM_ADMIN'] },
  { id: 'p-failed', label: 'Failed Payments', icon: AlertTriangle, path: '/platform/failed-payments', category: 'Billing & Payments', allowedRoles: ['PLATFORM_OWNER', 'PLATFORM_ADMIN'] },
  
  // API & Webhooks
  { id: 'p-api', label: 'API Keys', icon: Globe, path: '/platform/api', category: 'API & Webhooks', allowedRoles: ['PLATFORM_OWNER', 'PLATFORM_ADMIN'] },
  { id: 'p-webhooks', label: 'Webhooks', icon: Link2, path: '/platform/webhooks', category: 'API & Webhooks', allowedRoles: ['PLATFORM_OWNER', 'PLATFORM_ADMIN'] },
  
  // Support & System
  { id: 'p-support', label: 'Support Tickets', icon: MessageSquare, path: '/platform/support', category: 'Support Center', allowedRoles: ['PLATFORM_OWNER', 'PLATFORM_ADMIN', 'PLATFORM_SUPPORT'] },
  { id: 'p-audit', label: 'Global Audit Logs', icon: List, path: '/platform/audit', category: 'System Settings', allowedRoles: ['PLATFORM_OWNER', 'PLATFORM_ADMIN'] },
  { id: 'p-settings', label: 'Global Config', icon: Settings, path: '/platform/settings', category: 'System Settings', allowedRoles: ['PLATFORM_OWNER', 'PLATFORM_ADMIN'] }
];

// TENANT MENU (Acme Digital Ltd CRM) - 2-Level Nested Architecture
export const TENANT_MENU = [
  {
    id: 'cat-executive',
    label: 'Executive',
    icon: LayoutDashboard,
    isGroup: true,
    allowedRoles: ['TENANT_OWNER', 'VIEWER'],
    children: [
      { id: 't-dashboard', label: 'Overview', path: '/dashboard', allowedRoles: ['TENANT_OWNER', 'MANAGER', 'SUPERVISOR', 'AGENT', 'VIEWER', 'RECEPTIONIST'] },
      { id: 't-revenue', label: 'Financials', path: '/revenue', allowedRoles: ['TENANT_OWNER', 'VIEWER'] },
      { id: 't-kpi-dash', label: 'Analytics Hub', path: '/kpi-dashboard', allowedRoles: ['TENANT_OWNER', 'VIEWER'] },
    ]
  },
  {
    id: 'cat-crm',
    label: 'CRM',
    icon: Users,
    isGroup: true,
    allowedRoles: ['TENANT_OWNER', 'MANAGER', 'SUPERVISOR', 'AGENT', 'VIEWER'],
    children: [
      { id: 't-leads', label: 'Leads', path: '/leads', badge: '1.2K', badgeColor: 'text-neon-green bg-neon-green/10 border-neon-green/30', allowedRoles: ['TENANT_OWNER', 'MANAGER', 'SUPERVISOR', 'AGENT', 'VIEWER'] },
      { id: 't-creators', label: 'Creators', path: '/creators', allowedRoles: ['TENANT_OWNER', 'MANAGER', 'SUPERVISOR', 'AGENT', 'VIEWER'] },
      { id: 't-fans', label: 'Fans', path: '/fans', allowedRoles: ['TENANT_OWNER', 'MANAGER', 'SUPERVISOR', 'AGENT', 'VIEWER'] },
      { id: 't-pipelines', label: 'Pipelines', path: '/pipelines', allowedRoles: ['TENANT_OWNER', 'MANAGER', 'AGENT', 'VIEWER'] }
    ]
  },
  {
    id: 'cat-comm',
    label: 'Communication',
    icon: MessageCircle,
    isGroup: true,
    allowedRoles: ['TENANT_OWNER', 'MANAGER', 'SUPERVISOR', 'AGENT', 'VIEWER'],
    children: [
      { id: 't-conversations', label: 'Conversations', path: '/conversations', badge: 5, badgeColor: 'text-neon-blue bg-neon-blue/10 border-neon-blue/30', allowedRoles: ['TENANT_OWNER', 'MANAGER', 'SUPERVISOR', 'AGENT', 'VIEWER'] },
      { id: 't-ai-center', label: 'AI Center', path: '/ai-center', allowedRoles: ['TENANT_OWNER', 'MANAGER', 'SUPERVISOR', 'VIEWER'] },
      { id: 't-video-call', label: 'Video Center', path: '/video-call', allowedRoles: ['TENANT_OWNER', 'MANAGER', 'AGENT'] }
    ]
  },
  {
    id: 'cat-ops',
    label: 'Operations',
    icon: Activity,
    isGroup: true,
    allowedRoles: ['TENANT_OWNER', 'MANAGER', 'SUPERVISOR', 'AGENT', 'RECEPTIONIST'],
    children: [
      { id: 't-tasks', label: 'Tasks', path: '/tasks', allowedRoles: ['TENANT_OWNER', 'MANAGER', 'SUPERVISOR', 'AGENT', 'RECEPTIONIST'] },
      { id: 't-calendar', label: 'Calendar', path: '/calendar', allowedRoles: ['TENANT_OWNER', 'MANAGER', 'SUPERVISOR', 'AGENT'] },
      { id: 't-escalations', label: 'Escalations', path: '/escalations', badge: 13, badgeColor: 'text-neon-pink bg-neon-pink/10 border-neon-pink/30', allowedRoles: ['TENANT_OWNER', 'MANAGER', 'SUPERVISOR'] },
      { id: 't-ops-dash', label: 'Live Operations', path: '/operations', allowedRoles: ['TENANT_OWNER', 'MANAGER', 'SUPERVISOR'] },
      { id: 't-queue', label: 'Queue Monitor', path: '/queue-monitor', allowedRoles: ['TENANT_OWNER', 'MANAGER', 'SUPERVISOR'] },
      { id: 't-supervisor', label: 'Floor Monitor', path: '/supervisor', allowedRoles: ['TENANT_OWNER', 'MANAGER', 'SUPERVISOR'] },
    ]
  },
  {
    id: 'cat-reception',
    label: 'Front Desk Operations',
    icon: CalendarIcon,
    isGroup: true,
    allowedRoles: ['RECEPTIONIST', 'TENANT_OWNER', 'MANAGER'],
    children: [
      { id: 't-reception-main', label: 'Front Desk Center', path: '/reception', allowedRoles: ['RECEPTIONIST', 'TENANT_OWNER', 'MANAGER'] },
      { id: 't-appointments-desk', label: 'Appointment Center', path: '/appointments', allowedRoles: ['RECEPTIONIST', 'TENANT_OWNER', 'MANAGER', 'SUPERVISOR'] },
      { id: 't-visitors-log', label: 'Visitor Log & Passes', path: '/visitors', allowedRoles: ['RECEPTIONIST', 'TENANT_OWNER', 'MANAGER'] },
      { id: 't-walk-ins-queue', label: 'Walk-In Queue', path: '/walk-ins', allowedRoles: ['RECEPTIONIST', 'TENANT_OWNER', 'MANAGER'] },
      { id: 't-reception-calls', label: 'Front Desk Calls', path: '/reception-calls', allowedRoles: ['RECEPTIONIST', 'TENANT_OWNER', 'MANAGER'] },
      { id: 't-reception-msg', label: 'SMS & WhatsApp', path: '/reception-messages', allowedRoles: ['RECEPTIONIST', 'TENANT_OWNER', 'MANAGER'] },
    ]
  },
  {
    id: 'cat-growth',
    label: 'Growth',
    icon: TrendingUp,
    isGroup: true,
    allowedRoles: ['TENANT_OWNER', 'MANAGER', 'VIEWER', 'AGENT'],
    children: [
      { id: 't-campaigns', label: 'Bulk Broadcasts & Campaigns', path: '/campaigns', allowedRoles: ['TENANT_OWNER', 'MANAGER', 'AGENT', 'VIEWER'] },
      { id: 't-campaign-analytics', label: 'Campaign Analytics', path: '/campaign-analytics', allowedRoles: ['TENANT_OWNER', 'MANAGER', 'VIEWER', 'AGENT'] },
      { id: 't-growth-dashboard', label: 'Growth Dashboard', path: '/growth-dashboard', allowedRoles: ['TENANT_OWNER', 'MANAGER', 'VIEWER'] },
      { id: 't-creator-success', label: 'Creator Success', path: '/creator-success', allowedRoles: ['TENANT_OWNER', 'MANAGER', 'AGENT', 'VIEWER'] },
      { id: 't-fan-activation', label: 'Fan Activation', path: '/fan-activation', allowedRoles: ['TENANT_OWNER', 'MANAGER', 'AGENT', 'VIEWER'] },
      { id: 't-vip', label: 'VIP Center', path: '/vip', allowedRoles: ['TENANT_OWNER'] },
    ]
  },
  {
    id: 'cat-team',
    label: 'Team',
    icon: Headphones,
    isGroup: true,
    allowedRoles: ['TENANT_OWNER', 'MANAGER', 'SUPERVISOR', 'AGENT'],
    children: [
      { id: 't-workspace', label: 'Agent Workspace', path: '/workspace', allowedRoles: ['AGENT'] },
      { id: 't-agents', label: 'Agents', path: '/agents', allowedRoles: ['TENANT_OWNER', 'MANAGER', 'SUPERVISOR'] },
      { id: 't-appointments', label: 'Appointments', path: '/appointments', allowedRoles: ['TENANT_OWNER', 'MANAGER'] },
    ]
  },
  {
    id: 'cat-admin',
    label: 'Administration',
    icon: Settings,
    isGroup: true,
    allowedRoles: ['TENANT_OWNER', 'MANAGER'],
    children: [
      { id: 't-settings', label: 'Settings', path: '/settings', allowedRoles: ['TENANT_OWNER'] },
      { id: 't-integrations', label: 'Integrations', path: '/integrations', allowedRoles: ['TENANT_OWNER'] },
      { id: 't-audit', label: 'Audit Logs', path: '/audit', allowedRoles: ['TENANT_OWNER'] },
      { id: 't-automations', label: 'Workflow Engine', path: '/routing-rules', allowedRoles: ['TENANT_OWNER', 'MANAGER'] },
    ]
  },
  {
    id: 'cat-analytics',
    label: 'Analytics',
    icon: BarChart2,
    isGroup: true,
    allowedRoles: ['TENANT_OWNER', 'MANAGER', 'SUPERVISOR', 'VIEWER'],
    children: [
      { id: 't-reports', label: 'Reports', path: '/reports', allowedRoles: ['TENANT_OWNER', 'MANAGER', 'SUPERVISOR', 'VIEWER'] },
      { id: 't-exec-reports', label: 'Executive Reports', path: '/executive-reports', allowedRoles: ['TENANT_OWNER', 'VIEWER'] },
      { id: 't-biz-analytics', label: 'Business Analytics', path: '/business-analytics', allowedRoles: ['TENANT_OWNER', 'VIEWER'] },
      { id: 't-dept-performance', label: 'Department Performance', path: '/department-performance', allowedRoles: ['TENANT_OWNER', 'MANAGER', 'SUPERVISOR'] },
      { id: 't-section-performance', label: 'Section Performance', path: '/section-performance', allowedRoles: ['TENANT_OWNER', 'MANAGER'] },
      { id: 't-quality', label: 'Quality Assurance', path: '/quality', allowedRoles: ['TENANT_OWNER', 'MANAGER', 'SUPERVISOR', 'VIEWER'] },
      { id: 't-revenue-analytics', label: 'Revenue Analytics', path: '/revenue-analytics', allowedRoles: ['TENANT_OWNER', 'MANAGER', 'VIEWER'] },
      { id: 't-vip-analytics', label: 'VIP Analytics', path: '/vip-analytics', allowedRoles: ['TENANT_OWNER', 'VIEWER'] },
      { id: 't-ai-insights', label: 'AI Insights', path: '/ai-insights', allowedRoles: ['TENANT_OWNER', 'MANAGER', 'VIEWER'] },
      { id: 't-activity-feed', label: 'Activity Feed', path: '/activity-feed', allowedRoles: ['TENANT_OWNER', 'MANAGER', 'SUPERVISOR'] },
    ]
  },
  
  // These routes are kept available so they don't break existing App.jsx rendering/roles,
  // but they are hidden from the primary nested sidebar or placed appropriately:
  { id: 't-sections', label: 'Sections', path: '/sections', isHidden: true, allowedRoles: ['TENANT_OWNER', 'MANAGER'] },
  { id: 't-routing-rules', label: 'Routing Rules', path: '/routing-rules', isHidden: true, allowedRoles: ['TENANT_OWNER', 'MANAGER'] },
  { id: 't-knowledge-base', label: 'Knowledge Base', path: '/knowledge-base', isHidden: true, allowedRoles: ['TENANT_OWNER', 'MANAGER'] },
  { id: 't-templates', label: 'Message Templates', path: '/templates', isHidden: true, allowedRoles: ['TENANT_OWNER', 'MANAGER'] },
  { id: 't-automations-hidden', label: 'Automations', path: '/automations', isHidden: true, allowedRoles: ['TENANT_OWNER', 'MANAGER'] },
  
  // Note: Notifications are handled via the Header bell icon now, but we keep the route valid:
  { id: 't-notifications', label: 'Notifications', path: '/notifications', isHidden: true, allowedRoles: ['RECEPTIONIST', 'TENANT_OWNER', 'MANAGER', 'SUPERVISOR', 'AGENT', 'VIEWER'] },
];
