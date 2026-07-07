export const mockConversations = [
  { 
    id: 'conv-101', 
    lead: { name: 'Maria Gonzalez', id: 1, type: 'Creator', score: 185, flag: '🇪🇸', language: 'Spanish', assignedAgent: 'Priya Sharma', status: 'Hot Lead', vip: true, health: 85, lastInteraction: 'Just now', campaign: 'Creator Onboarding' },
    channel: 'WhatsApp', 
    status: 'Needs Action', 
    unreadCount: 1,
    lastMessage: 'I need to talk to a human about VIP earnings.', 
    time: 'Just now',
    messages: [
      { id: 'm1', sender: 'ai', type: 'text', content: 'Hi Maria, I noticed you haven\'t completed your PlayGroundX registration yet. Were you able to start the signup process? Completing registration is the first step toward creating your profile.', time: '09:00 AM', status: 'read' },
      { id: 'm2', sender: 'lead', type: 'text', content: 'No, I have a few questions before I sign up.', time: '09:05 AM', status: 'read' },
      { id: 'm3', sender: 'ai', type: 'text', content: 'Of course! I can help. What questions do you have? Also, follow us on Instagram @playgroundx.vip for special promotions.', time: '09:06 AM', status: 'read' },
      { id: 'm4', sender: 'lead', type: 'text', content: 'I need to talk to a human about VIP earnings. My following on IG is 500k.', time: 'Just now', status: 'unread' },
      { id: 'm5', sender: 'system', type: 'event', content: 'AI Conversion Manager flagged as HOT LEAD (+100 VIP, +50 Earnings). Routing to Live Agent.', time: 'Just now' }
    ]
  },
  { 
    id: 'conv-102', 
    lead: { name: 'Elena Rodriguez', id: 2, type: 'Fan', score: 45, flag: '🇪🇸', language: 'Spanish', assignedAgent: 'Carlos Ray', status: 'Pending', vip: false, health: 65, lastInteraction: '15 mins ago', campaign: 'Summer Promo' },
    channel: 'Email', 
    status: 'Read', 
    unreadCount: 0,
    lastMessage: 'Thank you for the update.', 
    time: '15m ago',
    messages: [
      { id: 'm1', sender: 'lead', type: 'text', content: 'I am having trouble logging into my account. It says password incorrect.', time: 'Yesterday', status: 'read' },
      { id: 'm2', sender: 'agent', type: 'text', content: 'Hi Elena, I have sent a password reset link to your registered email address. Please check your spam folder as well.', time: 'Yesterday', status: 'read' },
      { id: 'm3', sender: 'lead', type: 'text', content: 'Thank you for the update. I was able to reset it.', time: '15m ago', status: 'read' }
    ]
  },
  { 
    id: 'conv-103', 
    lead: { name: 'Ahmed Al-Fayed', id: 8, type: 'Creator', score: 88, flag: '🇦🇪', language: 'Arabic', assignedAgent: 'Priya Sharma', status: 'Active', vip: true, health: 85, lastInteraction: '1 hour ago', campaign: 'VIP Fast-Track' },
    channel: 'Video', 
    status: 'Unread', 
    unreadCount: 1,
    lastMessage: 'Missed Video Call', 
    time: '1h ago',
    messages: [
      { id: 'm1', sender: 'agent', type: 'text', content: 'Your VIP fast-track application is approved! Would you like to jump on a quick video call to setup your studio?', time: '2 days ago', status: 'delivered' },
      { id: 'm2', sender: 'system', type: 'event', content: 'Missed Video Call from Lead', time: '1h ago' }
    ]
  },
  {
    id: 'conv-104',
    lead: { name: 'Sarah Jenkins', id: 10, type: 'Fan', score: 72, flag: '🇺🇸', language: 'English', assignedAgent: 'Priya Sharma', status: 'Active', vip: false, health: 70, lastInteraction: '3 hours ago', campaign: 'Re-engagement' },
    channel: 'Phone',
    status: 'Read',
    unreadCount: 0,
    lastMessage: 'Inbound Call (04:22)',
    time: '3h ago',
    messages: [
      { id: 'm1', sender: 'system', type: 'event', content: 'Inbound Voice Call started', time: '3h ago' },
      { id: 'm2', sender: 'system', type: 'event', content: 'Call ended. Duration: 04:22. Recording saved.', time: '3h ago' },
      { id: 'm3', sender: 'agent', type: 'note', content: 'User called complaining about a double charge on May 1st. Confirmed it was a bank hold, not a double charge. Issue resolved on call.', time: '3h ago', author: 'Mike Agent' }
    ]
  },
  {
    id: 'conv-105',
    lead: { name: 'Li Wei', id: 15, type: 'Creator', score: 95, flag: '🇨🇳', language: 'Chinese', assignedAgent: 'Priya Sharma', status: 'New', vip: true, health: 90, lastInteraction: '4 hours ago', campaign: 'Global Expansion' },
    channel: 'SMS',
    status: 'Read',
    unreadCount: 0,
    lastMessage: 'Please send the link again.',
    time: '4h ago',
    messages: [
      { id: 'm1', sender: 'agent', type: 'text', content: 'Hi Li Wei, here is your unique streaming key for tonight.', time: '5h ago', status: 'read' },
      { id: 'm2', sender: 'lead', type: 'text', content: 'Please send the link again.', time: '4h ago', status: 'read' }
    ]
  }
];
