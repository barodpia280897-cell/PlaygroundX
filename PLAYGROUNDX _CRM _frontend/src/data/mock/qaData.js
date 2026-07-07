import { Star, MessageSquare, CheckCircle, XCircle, AlertTriangle, TrendingUp, Phone, Mail } from 'lucide-react';

export const kpiData = [
  { label: 'Overall QA Score', value: '92.4%', change: '+4.3%', isNeg: false, icon: Star, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  { label: 'Evaluated Interactions', value: '3,842', change: '+18.7%', isNeg: false, icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  { label: 'Passed', value: '3,547', sub: '(92.3%)', change: '+19.2%', isNeg: false, icon: CheckCircle, color: 'text-neon-green', bg: 'bg-neon-green/10', border: 'border-neon-green/30' },
  { label: 'Failed', value: '295', sub: '(7.7%)', change: '-6.1%', isNeg: false, icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  { label: 'Critical Issues', value: '56', change: '-12.5%', isNeg: false, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  { label: 'Coaching Assigned', value: '128', change: '+15.4%', isNeg: false, icon: TrendingUp, color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/30' },
];

export const deptPerformance = [
  { name: 'English Team', flag: '🇬🇧', score: '93.1%', vs: '+4.6%', eval: '1,286' },
  { name: 'Spanish Team', flag: '🇪🇸', score: '91.2%', vs: '+3.8%', eval: '1,052' },
  { name: 'French Team', flag: '🇫🇷', score: '90.3%', vs: '+2.1%', eval: '645' },
  { name: 'Portuguese Team', flag: '🇵🇹', score: '89.7%', vs: '+1.9%', eval: '382' },
  { name: 'Arabic Team', flag: '🇦🇪', score: '87.5%', vs: '+2.7%', eval: '241' },
  { name: 'Hindi Team', flag: '🇮🇳', score: '88.9%', vs: '+3.3%', eval: '153' },
  { name: 'Bengali Team', flag: '🇧🇩', score: '86.2%', vs: '+2.5%', eval: '83' },
];

export const leaderboard = [
  { rank: 1, name: 'Mia Luxe', avatar: 'https://i.pravatar.cc/150?img=9', score: '98.6%', eval: '126' },
  { rank: 2, name: 'Alex Star', avatar: 'https://i.pravatar.cc/150?img=11', score: '97.2%', eval: '118' },
  { rank: 3, name: 'Luna Starr', avatar: 'https://i.pravatar.cc/150?img=1', score: '96.4%', eval: '134' },
  { rank: 4, name: 'Chris Diamond', avatar: 'https://i.pravatar.cc/150?img=12', score: '95.6%', eval: '142' },
  { rank: 5, name: 'Bella Rose', avatar: 'https://i.pravatar.cc/150?img=5', score: '94.3%', eval: '121' },
];

export const trendData = [
  { day: 'Apr 21', overall: 85, passed: 80, failed: 15 },
  { day: 'Apr 24', overall: 88, passed: 83, failed: 12 },
  { day: 'Apr 28', overall: 86, passed: 81, failed: 13 },
  { day: 'May 1', overall: 90, passed: 86, failed: 10 },
  { day: 'May 5', overall: 89, passed: 85, failed: 11 },
  { day: 'May 9', overall: 92, passed: 89, failed: 8 },
  { day: 'May 12', overall: 91, passed: 88, failed: 9 },
  { day: 'May 16', overall: 94, passed: 92, failed: 6 },
  { day: 'May 19', overall: 93, passed: 91, failed: 7 },
];

export const reviewQueues = [
  { title: 'Call Reviews', count: 42, icon: Phone, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30', critical: 7, high: 15, medium: 20 },
  { title: 'WhatsApp Reviews', count: 68, icon: MessageSquare, color: 'text-neon-green', bg: 'bg-neon-green/10', border: 'border-neon-green/30', critical: 9, high: 24, medium: 35 },
  { title: 'Email Reviews', count: 31, icon: Mail, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/30', critical: 4, high: 11, medium: 16 },
  { title: 'AI Handovers', count: 25, icon: MessageSquare, color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/30', critical: 5, high: 8, medium: 12 },
  { title: 'Escalation Audits', count: 18, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30', critical: 6, high: 7, medium: 5 }
];

export const complianceData = [
  { name: 'Compliant', value: 96.1, color: '#10b981' },
  { name: 'Minor Issues', value: 2.6, color: '#f59e0b' },
  { name: 'Major Issues', value: 1.1, color: '#ef4444' },
  { name: 'Critical Issues', value: 0.2, color: '#b91c1c' }
];

export const topIssues = [
  { label: 'Incorrect Information', count: 78, pct: 26.4, color: 'bg-red-500' },
  { label: 'Policy/Procedure Violation', count: 54, pct: 18.3, color: 'bg-amber-500' },
  { label: 'Missing Verification', count: 46, pct: 15.6, color: 'bg-yellow-500' },
  { label: 'Incorrect Escalation', count: 34, pct: 11.5, color: 'bg-orange-500' },
  { label: 'Unprofessional Tone', count: 28, pct: 9.5, color: 'bg-purple-500' },
  { label: 'Incomplete Documentation', count: 25, pct: 8.5, color: 'bg-blue-500' },
  { label: 'Other Issues', count: 30, pct: 10.2, color: 'bg-gray-500' }
];

export const failedEvals = [
  { id: 'INT-83729', type: 'WhatsApp', agent: 'John Doe', issue: 'Incorrect Information', score: '45%', date: 'May 20, 10:32 AM' },
  { id: 'INT-83715', type: 'Call', agent: 'Sara Agent', issue: 'Policy Violation', score: '35%', date: 'May 20, 09:48 AM' },
  { id: 'INT-83692', type: 'Email', agent: 'Mike Smith', issue: 'Missing Verification', score: '50%', date: 'May 20, 08:15 AM' },
  { id: 'INT-83671', type: 'AI Handoff', agent: 'Alex Star', issue: 'Incorrect Escalation', score: '40%', date: 'May 19, 07:42 PM' },
  { id: 'INT-83655', type: 'Escalation', agent: 'Bella Rose', issue: 'Unprofessional Tone', score: '38%', date: 'May 19, 06:33 PM' }
];

export const bottomAgents = [
  { rank: 1, name: 'Sara Agent', avatar: 'https://i.pravatar.cc/150?img=47', score: '84.2%', eval: 69 },
  { rank: 2, name: 'King James', avatar: 'https://i.pravatar.cc/150?img=68', score: '85.4%', eval: 77 },
  { rank: 3, name: 'Johnny Blaze', avatar: 'https://i.pravatar.cc/150?img=12', score: '86.1%', eval: 89 },
  { rank: 4, name: 'Mark Wilson', avatar: 'https://i.pravatar.cc/150?img=33', score: '87.3%', eval: 63 },
  { rank: 5, name: 'Tom Hardy', avatar: 'https://i.pravatar.cc/150?img=60', score: '87.9%', eval: 71 }
];
