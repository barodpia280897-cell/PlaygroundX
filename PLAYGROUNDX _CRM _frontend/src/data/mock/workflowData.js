export const mockWorkflows = [
  { id: 'wf-1', name: 'Registration Workflow', status: 'Active' },
  { id: 'wf-2', name: 'Profile Completion', status: 'Active' },
  { id: 'wf-3', name: 'Creator Activation', status: 'Active' },
  { id: 'wf-4', name: 'Fan Activation', status: 'Active' },
  { id: 'wf-5', name: 'KYC Verification', status: 'Active' },
  { id: 'wf-6', name: 'First Deposit (Fans)', status: 'Active' },
  { id: 'wf-7', name: 'First Content (Creators)', status: 'Active' },
  { id: 'wf-8', name: 'Reactivation Workflow', status: 'Active' },
  { id: 'wf-9', name: 'VIP Detection', status: 'Active' },
  { id: 'wf-10', name: 'Escalation & Handoffs', status: 'Active' },
];

export const toolboxCategories = [
  {
    category: 'Triggers',
    tools: [
      { type: 'trigger', name: 'New Lead Captured', icon: 'zap', color: 'bg-blue-500' },
      { type: 'trigger', name: 'Event Occurred', icon: 'activity', color: 'bg-blue-500' }
    ]
  },
  {
    category: 'Messages',
    tools: [
      { type: 'whatsapp', name: 'Send WhatsApp', icon: 'message-circle', color: 'bg-green-500' },
      { type: 'email', name: 'Send Email', icon: 'mail', color: 'bg-purple-500' },
      { type: 'sms', name: 'Send SMS', icon: 'message-square', color: 'bg-blue-500' }
    ]
  },
  {
    category: 'Logic',
    tools: [
      { type: 'wait', name: 'Wait / Delay', icon: 'clock', color: 'bg-yellow-500' },
      { type: 'condition', name: 'Condition / If Else', icon: 'git-branch', color: 'bg-orange-500' }
    ]
  },
  {
    category: 'CRM Actions',
    tools: [
      { type: 'update', name: 'Update Field', icon: 'edit', color: 'bg-indigo-500' },
      { type: 'task', name: 'Create Task', icon: 'check-square', color: 'bg-indigo-500' },
      { type: 'tag', name: 'Add to List / Tag', icon: 'tag', color: 'bg-indigo-500' },
      { type: 'webhook', name: 'Webhook', icon: 'link', color: 'bg-gray-500' }
    ]
  }
];

export const workflowVariables = [
  '{{first_name}}',
  '{{last_name}}',
  '{{registration_link}}',
  '{{creator_name}}',
  '{{deposit_amount}}',
  '{{vip_level}}',
  '{{agent_name}}',
  '{{current_date}}'
];
