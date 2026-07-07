export const mockRoutingRules = [
  { id: 1, name: 'VIP Lead Routing', description: 'Route high VIP potential leads to senior agents.', priority: 1, status: 'Active', condition: 'VIP Score > 80', action: 'Assign to Queue', queue: 'VIP Support', department: 'VIP Team', lastModified: '2025-05-18T10:30:00Z', createdBy: 'Admin Jane' },
  { id: 2, name: 'Spanish Creators', description: 'Route Spanish creator leads to Spanish dept.', priority: 2, status: 'Active', condition: 'Language = Spanish AND Type = Creator', action: 'Assign to Queue', queue: 'Creator Escalations', department: 'Spanish Department', lastModified: '2025-05-17T14:20:00Z', createdBy: 'Manager Carlos' },
  { id: 3, name: 'General English Fans', description: 'Route general English fans to standard queue.', priority: 3, status: 'Active', condition: 'Language = English AND Type = Fan', action: 'Assign to Queue', queue: 'General Support', department: 'English Department', lastModified: '2025-05-15T09:15:00Z', createdBy: 'System' },
  { id: 4, name: 'Escalated Billing', description: 'Route billing issues to finance queue.', priority: 4, status: 'Inactive', condition: 'Tags CONTAINS "Billing"', action: 'Assign to Queue', queue: 'Finance Reviews', department: 'Creator Success', lastModified: '2025-05-10T11:45:00Z', createdBy: 'Admin Jane' }
];

export const deptData = [
  { name: 'English Dept', value: 45, color: '#00f0ff' },
  { name: 'Spanish Dept', value: 25, color: '#ffd700' },
  { name: 'VIP Team', value: 15, color: '#8a2be2' },
  { name: 'Finance', value: 15, color: '#ff0055' },
];

export const actionData = [
  { name: 'Assign to Queue', value: 60, color: '#39ff14' },
  { name: 'Assign to Agent', value: 30, color: '#00f0ff' },
  { name: 'Tag as VIP', value: 10, color: '#ff7f00' },
];
