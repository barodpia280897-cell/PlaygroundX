export const mockTimelineEvents = [
  // Maria Gonzalez (Lead 1) - Creator onboarding timeline
  { id: 101, leadId: 1, type: 'system', text: 'Lead Created from Instagram Ad', timestamp: '2025-05-18T10:30:00Z', icon: 'UserPlus' },
  { id: 102, leadId: 1, type: 'system', text: 'Routed to Spanish Department', timestamp: '2025-05-18T10:30:05Z', icon: 'GitMerge' },
  { id: 103, leadId: 1, type: 'ai_action', text: 'AI sent welcome WhatsApp', timestamp: '2025-05-18T10:31:00Z', icon: 'MessageCircle' },
  { id: 104, leadId: 1, type: 'user_action', text: 'User opened WhatsApp', timestamp: '2025-05-18T10:35:00Z', icon: 'Eye' },
  { id: 105, leadId: 1, type: 'user_action', text: 'User replied: "Yes, I want to sign up"', timestamp: '2025-05-18T10:36:00Z', icon: 'MessageSquare' },
  { id: 106, leadId: 1, type: 'ai_action', text: 'AI sent Registration Link', timestamp: '2025-05-18T10:36:10Z', icon: 'Link' },
  { id: 107, leadId: 1, type: 'system', text: 'Registration Completed', timestamp: '2025-05-18T10:45:00Z', icon: 'CheckCircle' },
  { id: 108, leadId: 1, type: 'system', text: 'Email Verified', timestamp: '2025-05-18T10:46:00Z', icon: 'Mail' },
  { id: 109, leadId: 1, type: 'system', text: 'Profile Photo Uploaded', timestamp: '2025-05-19T09:15:00Z', icon: 'Camera' },
  { id: 110, leadId: 1, type: 'system', text: 'KYC Submitted', timestamp: '2025-05-20T11:00:00Z', icon: 'FileText' },
  { id: 111, leadId: 1, type: 'alert', text: 'KYC Pending Review', timestamp: '2025-05-20T11:00:10Z', icon: 'AlertTriangle' },

  // Sophie Dubois (Lead 4) - VIP Fan timeline
  { id: 401, leadId: 4, type: 'system', text: 'Wallet Funded with $2,000', timestamp: '2025-05-16T14:30:00Z', icon: 'DollarSign' },
  { id: 402, leadId: 4, type: 'user_action', text: 'Subscribed to 5 Creators', timestamp: '2025-05-16T15:00:00Z', icon: 'UserCheck' },
  { id: 403, leadId: 4, type: 'system', text: 'Earned VIP Status', timestamp: '2025-05-17T09:00:00Z', icon: 'Crown' },
  { id: 404, leadId: 4, type: 'agent_action', text: 'Emma Agent completed welcome call', timestamp: '2025-05-17T11:30:00Z', icon: 'Phone' },

  // Li Wei (Lead 3) - Needs Follow up
  { id: 301, leadId: 3, type: 'system', text: 'Lead Created from Google Ad', timestamp: '2025-05-19T14:20:00Z', icon: 'UserPlus' },
  { id: 302, leadId: 3, type: 'system', text: 'Registration Started', timestamp: '2025-05-19T14:25:00Z', icon: 'Clock' },
  { id: 303, leadId: 3, type: 'alert', text: 'Registration Abandoned (24h)', timestamp: '2025-05-20T14:25:00Z', icon: 'AlertTriangle' },
  { id: 304, leadId: 3, type: 'ai_action', text: 'AI sent reminder email', timestamp: '2025-05-20T14:26:00Z', icon: 'Mail' },

  // Ahmed Al Mansour (Lead 5) - KYC Failed/Pending
  { id: 501, leadId: 5, type: 'system', text: 'KYC Submitted', timestamp: '2025-05-20T11:45:00Z', icon: 'FileText' },
  { id: 502, leadId: 5, type: 'alert', text: 'KYC Rejected - Blurry ID', timestamp: '2025-05-20T12:00:00Z', icon: 'XCircle' },
  { id: 503, leadId: 5, type: 'agent_action', text: 'Ahmed Agent requested new ID', timestamp: '2025-05-20T12:15:00Z', icon: 'MessageCircle' },
  { id: 504, leadId: 5, type: 'system', text: 'New KYC Submitted', timestamp: '2025-05-21T09:00:00Z', icon: 'FileText' }
];
