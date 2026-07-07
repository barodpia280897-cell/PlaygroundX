import { UserPlus, CheckCircle, DollarSign, Heart, Crown } from 'lucide-react';

export const stages = [
  { id: 1, name: 'Registered', fans: 18452, pct: 100, dropoff: '18%', color: '#3b82f6', icon: UserPlus },
  { id: 2, name: 'Email Verified', fans: 15130, pct: 82, dropoff: '20%', color: '#0ea5e9', icon: CheckCircle },
  { id: 3, name: 'Profile Completed', fans: 12050, pct: 65, dropoff: '35%', color: '#10b981', icon: UserPlus },
  { id: 4, name: 'Wallet Funded', fans: 7750, pct: 42, dropoff: '33%', color: '#eab308', icon: DollarSign },
  { id: 5, name: 'First Purchase', fans: 5166, pct: 28, dropoff: '71%', color: '#f97316', icon: Heart },
  { id: 6, name: 'VIP Candidate', fans: 1476, pct: 8, dropoff: null, color: '#ef4444', icon: Crown },
];

export const stagePerformanceData = stages.map(s => ({
  ...s,
  convRate: (s.pct * 0.9 + Math.random()*5).toFixed(1) + '%',
  avgSpend: s.id >= 4 ? '$' + (s.id * 15 + Math.random()*10).toFixed(2) : '$0.00',
  trend: '+' + (Math.random()*10 + 2).toFixed(1) + '%'
}));

export const conversionAnalytics = Array.from({ length: 30 }, (_, i) => ({
  day: `May ${i + 1}`,
  rate: 15 + (i * 0.5) + (Math.sin(i)*2)
}));

export const revenueByStageData = [
  { name: 'Wallet Funded', Revenue: 45200, color: '#eab308' },
  { name: 'First Purchase', Revenue: 185600, color: '#f97316' },
  { name: 'Recurring (2-5)', Revenue: 420500, color: '#ec4899' },
  { name: 'VIP (5+)', Revenue: 850400, color: '#ef4444' },
];

export const recommendedActions = [
  { title: 'Re-engagement Campaign', desc: 'Send email to 3,080 users stuck at "Profile Completed"', impact: 'High Impact', type: 'Email', color: '#3b82f6' },
  { title: 'First Purchase Promo', desc: 'Offer 15% discount to 2,584 users with "Wallet Funded"', impact: 'High Impact', type: 'Promo', color: '#10b981' },
  { title: 'VIP Upsell', desc: 'Invite 1,476 "VIP Candidates" to exclusive inner circle', impact: 'Medium Impact', type: 'Invite', color: '#eab308' },
  { title: 'Cart Abandonment', desc: 'Follow up with 420 users who failed to complete funding', impact: 'Low Impact', type: 'SMS', color: '#ef4444' },
];
