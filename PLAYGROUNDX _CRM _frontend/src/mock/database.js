// src/mock/database.js
// Centralized default mock database. 
// This data is only used to seed localStorage on the first launch or when reset is triggered.

import { 
  kpiStats, languageDistribution, conversionFunnel, aiPerformance, 
  creatorPipeline, fanPipeline, agentAlerts, todaySummary, liveActivityFeed, primaryChannels, 
  topCountries, revenueByMonth, revenueByCountry 
} from '../data/mockData';
import { mockLeads, mockTimelineEvents, mockConversations, mockTasks, mockAppointments, mockRoutingRules, mockAutomations, mockArticles, mockTemplates, mockQueues, mockAgents } from '../data/mock';

// We import the existing arrays to avoid duplicating the huge lists of data in two places.
// In a real refactor, we would move all data here and delete mockData.js.
// For now, this serves as the initial state map.

export const INITIAL_DATABASE = {
  kpiStats,
  languageDistribution,
  conversionFunnel,
  aiPerformance,
  creatorPipeline,
  fanPipeline,
  agentAlerts,
  conversations: mockConversations,
  tasks: mockTasks,
  appointments: mockAppointments,
  notifications: [
    { id: 1, type: 'vip', title: 'VIP Prospect Detected', body: 'Maria Gonzalez — Lead Score 185, VIP Score 92', message: 'Maria Gonzalez — Lead Score 185, VIP Score 92', time: '2 mins ago', unread: true, category: 'CRM' },
    { id: 2, type: 'alert', title: 'KYC Failed', body: 'Ahmed Al Mansour — documents rejected', message: 'Ahmed Al Mansour — documents rejected', time: '5 mins ago', unread: true, category: 'System' },
    { id: 3, type: 'alert', title: 'Payment Failed', body: 'Jenna Smith — card declined $200', message: 'Jenna Smith — card declined $200', time: '8 mins ago', unread: true, category: 'Billing' },
    { id: 4, type: 'call', title: 'Call Requested', body: 'Carlos Ramirez — wants agent callback', message: 'Carlos Ramirez — wants agent callback', time: '12 mins ago', unread: true, category: 'CRM' },
    { id: 5, type: 'hot', title: 'Hot Lead Alert', body: 'Sophie Dubois — multiple link clicks', message: 'Sophie Dubois — multiple link clicks', time: '15 mins ago', unread: false, category: 'Growth' },
    { id: 6, type: 'info', title: 'Registration Complete', body: 'Li Wei completed registration', message: 'Li Wei completed registration', time: '20 mins ago', unread: false, category: 'CRM' },
    { id: 7, type: 'info', title: 'System Update', body: 'AI Success Manager updated rules', message: 'AI Success Manager updated rules', time: '1 hour ago', unread: false, category: 'System' },
  ],
  timelineEvents: mockTimelineEvents,
  todaySummary,
  liveActivityFeed,
  primaryChannels,
  topCountries,
  leads: mockLeads,
  agents: mockAgents,
  revenueByMonth,
  revenueByCountry,
  routingRules: mockRoutingRules,
  automations: mockAutomations,
  articles: mockArticles,
  templates: mockTemplates,
  queues: mockQueues,

  // Adding other modules that didn't have explicit mock arrays in mockData.js
  departments: [
    { id: 1, name: 'Creator Acquisition', type: 'Business', agents: 8, supervisors: 2, leads: 312, conversion: '22%', status: 'Active', color: '#00f0ff', languages: ['English','Spanish','French'] },
    { id: 2, name: 'Creator Success', type: 'Business', agents: 6, supervisors: 1, leads: 204, conversion: '31%', status: 'Active', color: '#39ff14', languages: ['English','Spanish'] },
    { id: 3, name: 'Fan Acquisition', type: 'Business', agents: 10, supervisors: 2, leads: 518, conversion: '18%', status: 'Active', color: '#8a2be2', languages: ['English','Spanish','Portuguese','Korean'] },
    { id: 4, name: 'Fan Success', type: 'Business', agents: 7, supervisors: 2, leads: 290, conversion: '28%', status: 'Active', color: '#ff0055', languages: ['English','Arabic','Hindi'] },
    { id: 5, name: 'VIP Team', type: 'Business', agents: 4, supervisors: 1, leads: 48, conversion: '65%', status: 'Active', color: '#ffd700', languages: ['English','Spanish','French'] },
    { id: 6, name: 'KYC Team', type: 'Business', agents: 5, supervisors: 1, leads: 180, conversion: '88%', status: 'Active', color: '#00f0ff', languages: ['All'] },
    { id: 7, name: 'English Department', type: 'Language', agents: 14, supervisors: 3, leads: 578, conversion: '24%', status: 'Active', color: '#00f0ff', languages: ['English'] },
    { id: 8, name: 'Spanish Department', type: 'Language', agents: 9, supervisors: 2, leads: 231, conversion: '21%', status: 'Active', color: '#ffd700', languages: ['Spanish'] }
  ],
  campaigns: [
    { id:1, name:'Summer Giveaway Campaign', desc:'Increase engagement with our summer giveaway event', type:'Promotional', channel:'WhatsApp, Instagram', audience:'Fans & Leads', audienceCount:85420, status:'Active', reach:52340, reachPct:'18.2%', engagement:28.6, engPct:'4.7%', conversion:14.3, convPct:'3.2%', date:'May 18, 2025', color:'#8a2be2', icon:'Gift' },
    { id:2, name:'Creator Webinar Series', desc:'Educational webinar series for content creators', type:'Educational', channel:'Email, YouTube', audience:'Creators', audienceCount:12850, status:'Active', reach:9420, reachPct:'12.7%', engagement:35.8, engPct:'6.1%', conversion:11.2, convPct:'2.9%', date:'May 15, 2025', color:'#3b82f6', icon:'Video' },
    { id:3, name:'App Feature Launch', desc:'Promote new AI features in the PGX app', type:'Product', channel:'WhatsApp, Push', audience:'Leads', audienceCount:65230, status:'Active', reach:48120, reachPct:'23.5%', engagement:22.4, engPct:'5.8%', conversion:13.1, convPct:'4.1%', date:'May 10, 2025', color:'#39ff14', icon:'Smartphone' },
    { id:4, name:'VIP Exclusive Offer', desc:'Special offers for VIP members', type:'Promotional', channel:'Email', audience:'VIP Members', audienceCount:3450, status:'Scheduled', reach:0, reachPct:'0%', engagement:0, engPct:'0%', conversion:0, convPct:'0%', date:'May 25, 2025', color:'#f59e0b', icon:'Crown' },
    { id:5, name:'Re-engagement Campaign', desc:'Win back inactive users with special offers', type:'Re-engagement', channel:'Email, SMS, WhatsApp', audience:'Inactive Users', audienceCount:22610, status:'Completed', reach:18450, reachPct:'—', engagement:19.6, engPct:'—', conversion:8.7, convPct:'—', date:'May 1, 2025', color:'#ff0055', icon:'RefreshCw' },
    { id:6, name:'Holiday Sale Blast', desc:'Black Friday holiday promotion', type:'Promotional', channel:'SMS, Push', audience:'All Users', audienceCount:95300, status:'Completed', reach:76250, reachPct:'—', engagement:31.2, engPct:'—', conversion:15.8, convPct:'—', date:'Apr 28, 2025', color:'#ec4899', icon:'ShoppingBag' },
    { id:7, name:'Customer Feedback Survey', desc:'Collect feedback to improve our platform', type:'Survey', channel:'Email', audience:'Users', audienceCount:8920, status:'Draft', reach:0, reachPct:'—', engagement:0, engPct:'—', conversion:0, convPct:'—', date:'—', color:'#00f0ff', icon:'ClipboardList' },
  ],
  vips: [
    { id:1, name:'Sophie Dubois', flag:'🇫🇷', avatar:'https://i.pravatar.cc/150?img=9', type:'Fan', tier:'Diamond', score:98, spent:'$4,200', status:'Active', followers:'—', earnings:'—', color:'#00f0ff' },
    { id:2, name:'Jenna Smith', flag:'🇺🇸', avatar:'https://i.pravatar.cc/150?img=13', type:'Creator', tier:'Platinum', score:95, spent:'—', status:'Active', followers:'128K', earnings:'$4,800', color:'#8a2be2' },
    { id:3, name:'Maria Gonzalez', flag:'🇪🇸', avatar:'https://i.pravatar.cc/150?img=1', type:'Creator', tier:'Gold', score:92, spent:'—', status:'Active', followers:'42K', earnings:'$3,100', color:'#ffd700' },
    { id:4, name:'Jin Woo', flag:'🇰🇷', avatar:'https://i.pravatar.cc/150?img=3', type:'Fan', tier:'Platinum', score:88, spent:'$2,800', status:'Active', followers:'—', earnings:'—', color:'#8a2be2' },
  ],
  pipelines: [
    { name:'New Creator Lead', count:122, color:'#555', leads:[
      { name:'Ana Silva', country:'🇧🇷', score:45 }, { name:'Tom Evans', country:'🇬🇧', score:30 },
    ]},
    { name:'Contacted', count:84, color:'#00f0ff', leads:[
      { name:'Sofia Martinez', country:'🇪🇸', score:70 }, { name:'Yuna Kim', country:'🇰🇷', score:65 },
    ]},
    { name:'Registration Started', count:45, color:'#8a2be2', leads:[
      { name:'Pierre Dupont', country:'🇫🇷', score:90 },
    ]},
    { name:'Registered', count:84, color:'#39ff14', leads:[
      { name:'Maria Gonzalez', country:'🇪🇸', score:110 },
    ]},
    { name:'KYC Submitted', count:38, color:'#ffd700', leads:[
      { name:'Ahmed Al Mansour', country:'🇦🇪', score:130 },
    ]},
    { name:'KYC Approved', count:22, color:'#ff7f00', leads:[
      { name:'Jenna Smith', country:'🇺🇸', score:150 },
    ]},
    { name:'Active Creator', count:58, color:'#ff0055', leads:[
      { name:'Sophie Dubois', country:'🇫🇷', score:220 },
    ]},
  ],
  qaConversations: [
    { id: 'C-1042', agent: 'Sarah Jenkins', lead: 'Mike Ross', dept: 'English Team', score: 85, status: 'Pending Review', aiSuggestion: 'Good empathy, missed upsell.', type: 'Chat', date: '2 hrs ago' },
    { id: 'C-1043', agent: 'David Chen', lead: 'Emma Stone', dept: 'English Team', score: null, status: 'Needs Review', aiSuggestion: 'Check tone in message 4.', type: 'Chat', date: '3 hrs ago' },
  ],
  qaCalls: [
    { id: 'V-9921', agent: 'Carlos Ray', lead: 'Julia Fox', dept: 'Spanish Team', duration: '14m 20s', score: 92, sentiment: 'Positive', status: 'Pending Review', type: 'Call', date: '1 day ago' },
    { id: 'V-9922', agent: 'Anna Lee', lead: 'Tom Hardy', dept: 'Creator Success', duration: '5m 10s', score: null, sentiment: 'Neutral', status: 'Needs Review', type: 'Call', date: '4 hrs ago' },
  ],
  qaEmails: [
    { id: 'E-4421', agent: 'David Chen', lead: 'Tony Stark', subject: 'Account Verification Issue', responseTime: '12 mins', score: 88, status: 'Pending Review', type: 'Email', date: '5 hrs ago' },
  ],
  qaHandovers: [
    { id: 'H-221', agent: 'Sarah Jenkins', aiConfidence: '42%', reason: 'Complex billing question', resolutionTime: '4m', outcome: 'Resolved', status: 'Pending Review', type: 'AI Handover', date: '1 hr ago' },
  ],
  qaEscalations: [
    { id: 'ESC-91', agent: 'Carlos Ray', supervisor: 'Manager Jane', priority: 'High', status: 'In Progress', timeline: 'Escalated 2 hrs ago', type: 'Escalation', date: '2 hrs ago' },
  ],
  qaScorecards: [
    { id: 'SC-1', agent: 'Sarah Jenkins', communication: 90, productKnowledge: 85, compliance: 100, tone: 95, resolution: 80, finalScore: 90, date: 'May 14' },
    { id: 'SC-2', agent: 'David Chen', communication: 70, productKnowledge: 90, compliance: 80, tone: 85, resolution: 85, finalScore: 82, date: 'May 12' },
  ],
  qaCoaching: [
    { id: 'CO-1', agent: 'David Chen', coach: 'Manager Jane', progress: 40, dueDate: 'May 20', status: 'In Progress', topic: 'Tone & Empathy' },
    { id: 'CO-2', agent: 'Carlos Ray', coach: 'Manager Jane', progress: 100, dueDate: 'May 15', status: 'Completed', topic: 'Billing Procedures' },
  ],
  aiLiveActivity: [
    { time: '10:46:32 AM', lead: 'Maria G.', flag: '🇪🇸', language: 'Spanish', question: '¿Cómo puedo ganar dinero en PGX?', confidence: '96%', status: 'AI Replied' },
    { time: '10:45:18 AM', lead: 'Jin Woo', flag: '🇰🇷', language: 'Korean', question: 'How do I verify my KYC?', confidence: '92%', status: 'AI Replied' },
    { time: '10:45:07 AM', lead: 'Joao Silva', flag: '🇧🇷', language: 'Portuguese', question: 'Como faço para fazer um depósito?', confidence: '89%', status: 'AI Replied' },
    { time: '10:44:55 AM', lead: 'Sophie D.', flag: '🇫🇷', language: 'French', question: 'How do subscriptions work?', confidence: '94%', status: 'AI Replied' },
    { time: '10:44:41 AM', lead: 'Ahmed A.', flag: '🇦🇪', language: 'Arabic', question: 'I want to go live, how?', confidence: '45%', status: 'Escalated' },
    { time: '10:44:29 AM', lead: 'Priya D.', flag: '🇮🇳', language: 'Hindi', question: 'Payment failed, need help', confidence: '21%', status: 'Escalated' },
  ],
  aiEscalations: [
    { lead: 'Ahmed Al Mansour', flag: '🇦🇪', priority: 'High', issue: 'Payment failed', agent: 'Carlos Ray', status: 'Pending', time: '10:44 AM' },
    { lead: 'Jenna Smith', flag: '🇺🇸', priority: 'High', issue: 'I want VIP', agent: 'Sarah Agent', status: 'Pending', time: '10:39 AM' },
    { lead: 'Carlos Ramirez', flag: '🇲🇽', priority: 'Medium', issue: 'Need to speak to someone', agent: 'Unassigned', status: 'New', time: '10:31 AM' },
    { lead: 'Maria Gonzalez', flag: '🇪🇸', priority: 'Medium', issue: 'KYC failed', agent: 'Mike Agent', status: 'In Progress', time: '10:28 AM' },
    { lead: 'Sophia Brown', flag: '🇬🇧', priority: 'Low', issue: 'Call me please', agent: 'Unassigned', status: 'New', time: '10:15 AM' },
  ],

  // Supervisor Assistance Requests — seeded so Agent → Supervisor workflow can integrate
  supervisorAssistanceRequests: [
    {
      id: 'SAR-001',
      agentName: 'Priya Sharma',
      agentAvatar: 'https://i.pravatar.cc/150?img=47',
      requestType: 'VIP Call Assistance',
      context: 'Maria Gonzalez (VIP Fan) — escalated after price negotiation stall on 80/20 split',
      priority: 'High',
      timeAgo: '2m ago',
      status: 'Pending'
    },
    {
      id: 'SAR-002',
      agentName: 'Mike Agent',
      agentAvatar: 'https://i.pravatar.cc/150?img=12',
      requestType: 'KYC Document Confusion',
      context: 'Ahmed Al Mansour (Creator) — unsure which documents are needed for Arabic region KYC',
      priority: 'Medium',
      timeAgo: '8m ago',
      status: 'Pending'
    },
    {
      id: 'SAR-003',
      agentName: 'Elena Vasquez',
      agentAvatar: 'https://i.pravatar.cc/150?img=25',
      requestType: 'Payment Dispute Query',
      context: 'Jenna Smith (Creator) — failed payout $200, agent unsure about chargeback procedure',
      priority: 'Medium',
      timeAgo: '15m ago',
      status: 'Pending'
    },
    {
      id: 'SAR-004',
      agentName: 'Omar Agent',
      agentAvatar: 'https://i.pravatar.cc/150?img=8',
      requestType: 'Lead Negotiation Support',
      context: 'Carlos Ramirez (Hot Lead) — requesting custom terms, agent needs authority to offer discount',
      priority: 'Low',
      timeAgo: '22m ago',
      status: 'Pending'
    }
  ]
};
