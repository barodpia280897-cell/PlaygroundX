export const mockAutomations = [
  { id: 1, name: 'New Creator Onboarding', status: 'Active', triggers: 1245, completed: 980, lastEdited: '2025-05-18', steps: [
    { id: 'step-1', type: 'trigger', label: 'Registration Completed', config: { entity: 'Creator' } },
    { id: 'step-2', type: 'action', label: 'Send Welcome Email', config: { templateId: 101 } },
    { id: 'step-3', type: 'delay', label: 'Wait 24 Hours', config: { duration: 24, unit: 'hours' } },
    { id: 'step-4', type: 'action', label: 'Send WhatsApp Check-in', config: { templateId: 102 } },
    { id: 'step-5', type: 'action', label: 'Assign Agent Task', config: { task: 'Follow up call' } }
  ]},
  { id: 2, name: 'Fan KYC Reminder', status: 'Active', triggers: 3450, completed: 3100, lastEdited: '2025-05-16', steps: [
    { id: 'step-1', type: 'trigger', label: 'KYC Status = Pending', config: { duration: 48, unit: 'hours' } },
    { id: 'step-2', type: 'action', label: 'Send SMS', config: { templateId: 201 } },
    { id: 'step-3', type: 'delay', label: 'Wait 2 Days', config: { duration: 2, unit: 'days' } },
    { id: 'step-4', type: 'action', label: 'Create Support Ticket', config: { priority: 'High' } }
  ]}
];

export const runTrend = [
  { time: '10:00', runs: 12 }, { time: '11:00', runs: 28 }, { time: '12:00', runs: 15 },
  { time: '13:00', runs: 45 }, { time: '14:00', runs: 30 }, { time: '15:00', runs: 65 },
  { time: '16:00', runs: 40 }
];
