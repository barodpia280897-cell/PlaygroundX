export const mockTasks = [
  { id: 1, title: 'Follow up on KYC', leadId: 1, agentId: 1, dueDate: '2025-05-21T10:00:00Z', status: 'Pending', priority: 'High', description: 'Review Maria\'s submitted documents.' },
  { id: 2, title: 'Welcome Call', leadId: 4, agentId: 3, dueDate: '2025-05-17T11:30:00Z', status: 'Completed', priority: 'Medium', description: 'Call Sophie to welcome her to VIP.' },
  { id: 3, title: 'Check Abandoned Registration', leadId: 3, agentId: null, dueDate: '2025-05-21T14:00:00Z', status: 'Pending', priority: 'Low', description: 'Li Wei abandoned registration 48h ago.' },
  { id: 4, title: 'Request new ID', leadId: 5, agentId: 6, dueDate: '2025-05-20T12:15:00Z', status: 'Completed', priority: 'High', description: 'Ahmed\'s ID was blurry.' }
];

export const mockAppointments = [
  { id: 1, leadId: 1, agentId: 1, title: 'Onboarding Demo', date: '2025-05-22T14:00:00Z', status: 'Scheduled', meetingLink: 'https://zoom.us/j/123456789' },
  { id: 2, leadId: 4, agentId: 3, title: 'VIP Account Review', date: '2025-05-25T10:00:00Z', status: 'Scheduled', meetingLink: 'https://zoom.us/j/987654321' }
];
