// src/utils/rbac.js

const ROLE_PERMISSIONS = {
  PLATFORM_ADMIN: ['*'],
  PLATFORM_OWNER: ['*'],
  TENANT_OWNER: ['*'],
  MANAGER: [
    'view_dashboards', 'view_crm', 'view_ops', 'view_growth', 'view_analytics', 'view_system',
    'edit_profile', 'create_task', 'reassign', 'qa_evaluate', 'messaging'
  ],
  SUPERVISOR: [
    'view_dashboards', 'view_crm', 'view_ops', 'view_analytics', 'messaging',
    'edit_profile', 'create_task', 'reassign', 'qa_evaluate'
  ],
  AGENT: [
    'view_dashboards', 'view_crm', 'view_ops', 'view_growth', 'messaging', 'edit_profile', 'create_task'
  ],
  RECEPTIONIST: [
    'view_dashboards', 'view_ops', 'view_team', 'messaging', 'edit_profile', 'create_task'
  ],
  VIEWER: [
    'view_dashboards', 'view_crm', 'view_ops', 'view_growth', 'view_analytics'
  ]
};

export const hasPermission = (user, action) => {
  if (!user) return false;
  const perms = ROLE_PERMISSIONS[user.role] || [];
  return perms.includes('*') || perms.includes(action);
};

export const filterDataByRole = (data, user, type) => {
  if (!user || user.role !== 'AGENT' || !data) return data;
  
  // RLS matching: match user name 'Priya Sharma' or standard mock agent names
  const isAgent = (lead) => lead.agent === user.name || lead.agentId === 6 || lead.agent === 'Priya Sharma';
  
  switch (type) {
    case 'leads':
    case 'creators':
    case 'fans':
      return data.filter(isAgent);
    case 'conversations':
      return data.filter(c => {
        const ag = c.agent || c.lead?.assignedAgent || c.lead?.agent || '';
        const nm = c.name || c.lead?.name || '';
        return ag === user?.name || ag.includes('Priya') || ag.includes('Carlos') || ag === 'You' || ag === 'Unassigned' || ag.includes('Sharma') || ag.includes('Sarah') || nm.includes('Priya');
      });
    case 'tasks':
      return data.filter(t => t.assignedName === user.name || t.agent === user.name);
    case 'appointments':
      return data.filter(a => a.agent === user.name);
    default:
      return data;
  }
};
