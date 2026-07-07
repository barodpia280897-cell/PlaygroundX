// src/data/mockData.js
// All static mock data for the PlayGroundX CRM frontend.
// Replace with real API calls in the future.

export const kpiStats = [
  { label: 'New Leads Today', value: '1,284', change: '+18.6% vs yesterday', positive: true, icon: 'Users', color: 'blue' },
  { label: 'Creators', value: '514', change: '+16.4%', positive: true, icon: 'Star', color: 'purple' },
  { label: 'Fans', value: '770', change: '+20.1%', positive: true, icon: 'Heart', color: 'pink' },
  { label: 'Hot Leads', value: '122', change: '+19.3%', positive: true, icon: 'Flame', color: 'orange' },
  { label: 'VIP Leads', value: '48', change: '+15.7%', positive: true, icon: 'Crown', color: 'gold' },
  { label: 'Needs Agent', value: '17', change: '-8.3%', positive: false, icon: 'Headphones', color: 'red' },
];

export const languageDistribution = [
  { name: 'English', value: 45, color: '#00f0ff' },
  { name: 'Spanish', value: 18, color: '#ff0055' },
  { name: 'French', value: 12, color: '#8a2be2' },
  { name: 'Portuguese', value: 10, color: '#39ff14' },
  { name: 'German', value: 5, color: '#ffd700' },
  { name: 'Arabic', value: 4, color: '#ff6b00' },
  { name: 'Hindi', value: 3, color: '#00ff88' },
  { name: 'Others', value: 3, color: '#555' },
];

export const conversionFunnel = [
  { stage: 'Leads', value: 1284, percent: 100 },
  { stage: 'Registered', value: 744, percent: 58 },
  { stage: 'KYC', value: 538, percent: 42 },
  { stage: 'Deposit', value: 372, percent: 29 },
  { stage: 'Active', value: 231, percent: 18 },
];

export const aiPerformance = {
  questionsAnswered: 2451,
  escalated: 42,
  resolutionRate: 98.3,
};

export const creatorPipeline = [
  { stage: 'New Creator Lead', count: 122 },
  { stage: 'Contacted', count: 84 },
  { stage: 'Interested', count: 71 },
  { stage: 'Registration Started', count: 45 },
  { stage: 'Registered', count: 84 },
  { stage: 'Profile Incomplete', count: 29 },
  { stage: 'KYC Submitted', count: 22 },
  { stage: 'KYC Approved', count: 16 },
  { stage: 'Profile Complete', count: 11 },
  { stage: 'First Content Uploaded', count: 9 },
  { stage: 'Active Creator', count: 58 },
  { stage: 'First Live Hosted', count: 6 },
  { stage: 'VIP Creator', count: 15 },
];

export const fanPipeline = [
  { stage: 'New Fan Lead', count: 344 },
  { stage: 'Contacted', count: 201 },
  { stage: 'Registered', count: 201 },
  { stage: 'First Deposit', count: 146 },
  { stage: 'First Purchase', count: 112 },
  { stage: 'Joined Room', count: 97 },
  { stage: 'Active Fan', count: 88 },
  { stage: 'VIP Fan', count: 48 },
];

export const agentAlerts = [
  { type: 'VIP Prospect Waiting', name: 'Maria Gonzalez', time: '2m ago', priority: 'vip', icon: 'Crown' },
  { type: 'KYC Failed', name: 'Ahmed Al Mansour', time: '5m ago', priority: 'high', icon: 'Shield' },
  { type: 'Payment Failed', name: 'Jenna Smith', time: '8m ago', priority: 'high', icon: 'CreditCard' },
  { type: 'Call Requested', name: 'Carlos Ramirez', time: '12m ago', priority: 'medium', icon: 'Phone' },
  { type: 'Hot Lead', name: 'Sophie Dubois', time: '15m ago', priority: 'hot', icon: 'Flame' },
];

export const recentConversations = [
  { id: 1, name: 'Maria Gonzalez', flag: '🇪🇸', channel: 'WhatsApp', time: '2m', unread: 2, avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, name: 'Jin Woo', flag: '🇰🇷', channel: 'SMS', time: '3m', unread: 1, avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: 3, name: 'Li Wei', flag: '🇨🇳', channel: 'Email', time: '5m', unread: 0, avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: 4, name: 'Sophie Dubois', flag: '🇫🇷', channel: 'WhatsApp', time: '7m', unread: 3, avatar: 'https://i.pravatar.cc/150?img=9' },
  { id: 5, name: 'Ahmed Al Mansour', flag: '🇦🇪', channel: 'WhatsApp', time: '8m', unread: 2, avatar: 'https://i.pravatar.cc/150?img=7' },
];

export const todaysTasks = [
  { title: 'Follow up with VIP prospect', name: 'Maria Gonzalez', due: 'Due in 5m', urgency: 'critical' },
  { title: 'Call requested', name: 'Ahmed Al Mansour', due: 'Due in 15m', urgency: 'high' },
  { title: 'KYC verification', name: 'Jenna Smith', due: 'Due in 30m', urgency: 'medium' },
  { title: 'Payment issue follow up', name: 'Carlos Ramirez', due: 'Due in 45m', urgency: 'medium' },
];

export const todaySummary = {
  outgoingMessages: 3281,
  incomingMessages: 2914,
  emailsSent: 1256,
  callsMade: 84,
  appointmentsBooked: 23,
};

export const liveActivityFeed = [
  { text: 'Maria Gonzalez completed registration', time: '10:42 AM', type: 'registration' },
  { text: 'Ahmed Al Mansour completed KYC', time: '10:41 AM', type: 'kyc' },
  { text: 'Sarah Smith made first deposit $100', time: '10:40 AM', type: 'deposit' },
  { text: 'Jenna Smith uploaded new content', time: '10:38 AM', type: 'content' },
  { text: 'Carlos Ramirez joined a live room', time: '10:37 AM', type: 'room' },
  { text: 'Li Wei subscribed to a creator', time: '10:35 AM', type: 'subscription' },
  { text: 'Sophie Dubois earned VIP status', time: '10:33 AM', type: 'vip' },
  { text: 'Jin Woo made a purchase $55', time: '10:30 AM', type: 'deposit' },
];

export const primaryChannels = [
  { name: 'WhatsApp', value: 667, percent: 52, color: '#25D366' },
  { name: 'SMS', value: 308, percent: 24, color: '#00f0ff' },
  { name: 'Email', value: 205, percent: 16, color: '#8a2be2' },
  { name: 'Phone', value: 77, percent: 6, color: '#ffd700' },
  { name: 'Unknown', value: 27, percent: 2, color: '#555' },
];

export const topCountries = [
  { country: 'United States', flag: '🇺🇸', percent: 28, count: 359 },
  { country: 'Mexico', flag: '🇲🇽', percent: 18, count: 231 },
  { country: 'Brazil', flag: '🇧🇷', percent: 12, count: 154 },
  { country: 'France', flag: '🇫🇷', percent: 8, count: 102 },
  { country: 'Germany', flag: '🇩🇪', percent: 6, count: 77 },
];

// ---- Leads Page Mock Data ----
export const mockLeads = [
  { id: 1, name: 'Maria Gonzalez', email: 'maria@email.com', phone: '+34 612 345 678', country: 'Spain', flag: '🇪🇸', type: 'Creator', language: 'Spanish', status: 'Hot Lead', leadScore: 185, vipScore: 92, stage: 'KYC Submitted', source: 'Instagram Ad', agent: 'Carlos', createdAt: '2025-05-18', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, name: 'Jin Woo', email: 'jin@email.com', phone: '+82 10 1234 5678', country: 'South Korea', flag: '🇰🇷', type: 'Fan', language: 'Korean', status: 'Active', leadScore: 140, vipScore: 60, stage: 'Active Fan', source: 'TikTok Ad', agent: 'Sarah', createdAt: '2025-05-17', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: 3, name: 'Li Wei', email: 'li@email.com', phone: '+86 138 0013 8000', country: 'China', flag: '🇨🇳', type: 'Creator', language: 'Chinese', status: 'Registered', leadScore: 95, vipScore: 35, stage: 'Profile Incomplete', source: 'Google Ad', agent: 'Unassigned', createdAt: '2025-05-19', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: 4, name: 'Sophie Dubois', email: 'sophie@email.com', phone: '+33 6 12 34 56 78', country: 'France', flag: '🇫🇷', type: 'Fan', language: 'French', status: 'VIP', leadScore: 220, vipScore: 98, stage: 'VIP Fan', source: 'Facebook Ad', agent: 'Emma', createdAt: '2025-05-15', avatar: 'https://i.pravatar.cc/150?img=9' },
  { id: 5, name: 'Ahmed Al Mansour', email: 'ahmed@email.com', phone: '+971 50 123 4567', country: 'UAE', flag: '🇦🇪', type: 'Creator', language: 'Arabic', status: 'KYC Pending', leadScore: 110, vipScore: 44, stage: 'KYC Submitted', source: 'Organic', agent: 'Ali', createdAt: '2025-05-20', avatar: 'https://i.pravatar.cc/150?img=7' },
  { id: 6, name: 'Carlos Ramirez', email: 'carlos@email.com', phone: '+52 55 1234 5678', country: 'Mexico', flag: '🇲🇽', type: 'Fan', language: 'Spanish', status: 'Active', leadScore: 160, vipScore: 70, stage: 'Active Fan', source: 'Referral', agent: 'Carlos', createdAt: '2025-05-16', avatar: 'https://i.pravatar.cc/150?img=11' },
  { id: 7, name: 'Jenna Smith', email: 'jenna@email.com', phone: '+1 310 555 0123', country: 'United States', flag: '🇺🇸', type: 'Creator', language: 'English', status: 'Active', leadScore: 175, vipScore: 80, stage: 'Active Creator', source: 'Instagram Ad', agent: 'Sarah', createdAt: '2025-05-14', avatar: 'https://i.pravatar.cc/150?img=13' },
  { id: 8, name: 'Rania Hassan', email: 'rania@email.com', phone: '+20 100 123 4567', country: 'Egypt', flag: '🇪🇬', type: 'Fan', language: 'Arabic', status: 'New', leadScore: 25, vipScore: 0, stage: 'New Lead', source: 'Facebook Ad', agent: 'Unassigned', createdAt: '2025-05-21', avatar: 'https://i.pravatar.cc/150?img=20' },
];

// ---- Agents Page Mock Data ----
// Moved to src/data/mock/agents.js

// ---- Revenue Data ----
export const revenueByMonth = [
  { month: 'Jan', revenue: 42000 }, { month: 'Feb', revenue: 55000 },
  { month: 'Mar', revenue: 61000 }, { month: 'Apr', revenue: 74000 },
  { month: 'May', revenue: 89000 }, { month: 'Jun', revenue: 102000 },
];

export const revenueByCountry = [
  { country: 'United States', revenue: 34200, color: '#00f0ff' },
  { country: 'Spain', revenue: 22100, color: '#ff0055' },
  { country: 'Brazil', revenue: 18500, color: '#39ff14' },
  { country: 'France', revenue: 14300, color: '#8a2be2' },
  { country: 'UAE', revenue: 12900, color: '#ffd700' },
];
