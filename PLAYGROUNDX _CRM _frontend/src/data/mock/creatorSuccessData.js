import { TrendingUp, AlertTriangle, ShieldAlert, Video, UploadCloud } from 'lucide-react';

export const topKpis = [
  { label: 'At Risk Creators', value: '238', change: '↑ 12.5%', color: '#ef4444', icon: AlertTriangle },
  { label: 'KYC Pending', value: '67', change: '↓ 8.3%', color: '#f59e0b', icon: ShieldAlert },
  { label: 'No Content Uploaded', value: '48', change: '↓ 14.2%', color: '#10b981', icon: UploadCloud },
  { label: 'No Live Hosted', value: '35', change: '↓ 11.4%', color: '#8a2be2', icon: Video },
  { label: 'Revenue Dropping', value: '102', change: '↑ 15.7%', color: '#3b82f6', icon: TrendingUp },
];

export const healthDonutData = [
  { name: 'Excellent', value: 28, color: '#10b981' },
  { name: 'Good', value: 42, color: '#3b82f6' },
  { name: 'Average', value: 20, color: '#f59e0b' },
  { name: 'Poor', value: 10, color: '#ef4444' },
];

export const healthTrendData = [
  { day: 'Apr 21', score: 55 }, { day: 'Apr 24', score: 62 }, { day: 'Apr 28', score: 60 },
  { day: 'May 2', score: 68 }, { day: 'May 5', score: 72 }, { day: 'May 9', score: 70 },
  { day: 'May 12', score: 78 }, { day: 'May 16', score: 75 }, { day: 'May 19', score: 82 },
];

export const topIssues = [
  { issue: 'Incomplete KYC', count: 67, pct: 28.2, color: '#ef4444' },
  { issue: 'No Content Uploaded', count: 48, pct: 20.2, color: '#f59e0b' },
  { issue: 'No Live Hosted', count: 35, pct: 14.7, color: '#8a2be2' },
  { issue: 'Low Engagement', count: 29, pct: 12.2, color: '#10b981' },
  { issue: 'Revenue Dropping', count: 22, pct: 9.2, color: '#3b82f6' },
  { issue: 'Policy Violations', count: 12, pct: 5.0, color: '#dc2626' },
  { issue: 'Others', count: 25, pct: 10.5, color: '#6b7280' },
];

export const alerts = [
  { title: 'KYC Expiring Soon', desc: '23 creators', time: '12m ago', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  { title: 'Revenue Dropping', desc: '15 creators', time: '1h ago', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { title: 'No Live Hosted', desc: '12 creators', time: '2h ago', color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { title: 'Policy Violation', desc: '5 creators', time: '4h ago', color: 'text-red-500', bg: 'bg-red-500/10' },
  { title: 'Content Rejected', desc: '8 creators', time: '5h ago', color: 'text-orange-400', bg: 'bg-orange-400/10' },
];

export const atRiskCreators = [
  { id: 1, name: 'Luna Starr', handle: '@lunastarr', avatar: 'https://i.pravatar.cc/150?img=1', score: 28, risk: 'High', issue: 'No Live Hosted', issueColor: '#8a2be2', dept: 'Spanish Team', rev: '$220', revTrend: '-45%', active: '2 days ago', sparkline: [40, 30, 35, 25, 20, 15, 10] },
  { id: 2, name: 'Alex Star', handle: '@alexstar', avatar: 'https://i.pravatar.cc/150?img=11', score: 32, risk: 'High', issue: 'Revenue Dropping', issueColor: '#3b82f6', dept: 'English Team', rev: '$150', revTrend: '-38%', active: '3 days ago', sparkline: [50, 45, 40, 35, 25, 20, 15] },
  { id: 3, name: 'Bella Rose', handle: '@bellarose', avatar: 'https://i.pravatar.cc/150?img=5', score: 38, risk: 'High', issue: 'Incomplete KYC', issueColor: '#ef4444', dept: 'French Team', rev: '$300', revTrend: '-22%', active: '1 day ago', sparkline: [60, 55, 50, 48, 45, 40, 38] },
  { id: 4, name: 'Johnny Blaze', handle: '@johnnyblaze', avatar: 'https://i.pravatar.cc/150?img=12', score: 42, risk: 'Medium', issue: 'Low Engagement', issueColor: '#10b981', dept: 'English Team', rev: '$410', revTrend: '-18%', active: '5 days ago', sparkline: [70, 65, 60, 58, 55, 50, 48] },
  { id: 5, name: 'Mia Luxe', handle: '@mialuxe', avatar: 'https://i.pravatar.cc/150?img=9', score: 45, risk: 'Medium', issue: 'No Content Uploaded', issueColor: '#f59e0b', dept: 'Spanish Team', rev: '$180', revTrend: '-15%', active: '2 days ago', sparkline: [80, 75, 70, 68, 65, 60, 58] },
];
