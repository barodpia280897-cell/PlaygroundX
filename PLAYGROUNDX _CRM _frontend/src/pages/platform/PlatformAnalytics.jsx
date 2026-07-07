import { usePlatformData } from '../../contexts/DataContext';
import { BarChart2, Globe, Server, Activity, Users } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip, CartesianGrid } from 'recharts';

export default function PlatformAnalytics() {
  const [revenueData] = usePlatformData('platformRevenue');
  const [health] = usePlatformData('platformHealth');

  return (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto custom-scrollbar pr-2 pb-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
          <BarChart2 size={24} className="text-neon-green" />
          Platform Analytics
        </h1>
        <p className="text-sm text-gray-400 mt-1">Detailed metrics on platform usage and performance.</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-5">
          <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Total Users</div>
          <div className="text-3xl font-black text-white">{health?.platformUsers?.toLocaleString() || 0}</div>
          <div className="text-xs text-neon-green mt-2 font-bold">+1,204 this week</div>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-5">
          <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">API Requests</div>
          <div className="text-3xl font-black text-white">{health?.apiUsage || '0'}</div>
          <div className="text-xs text-neon-blue mt-2 font-bold">2.4ms avg latency</div>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-5">
          <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Storage Used</div>
          <div className="text-3xl font-black text-white">{health?.storageUsage || '0'}</div>
          <div className="text-xs text-gray-500 mt-2 font-bold">14% capacity</div>
        </div>
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-5">
          <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Network Traffic</div>
          <div className="text-3xl font-black text-white">84 TB</div>
          <div className="text-xs text-neon-purple mt-2 font-bold">Inbound & Outbound</div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
        <h2 className="font-bold text-white mb-6">API & Platform Load</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[
              { time: '00:00', requests: 12000, latency: 15 },
              { time: '04:00', requests: 15000, latency: 18 },
              { time: '08:00', requests: 45000, latency: 22 },
              { time: '12:00', requests: 85000, latency: 45 },
              { time: '16:00', requests: 62000, latency: 30 },
              { time: '20:00', requests: 28000, latency: 20 },
              { time: '24:00', requests: 14000, latency: 16 },
            ]}>
              <defs>
                <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="time" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                itemStyle={{ color: '#00f0ff' }}
              />
              <Area type="monotone" dataKey="requests" stroke="#00f0ff" strokeWidth={3} fillOpacity={1} fill="url(#colorReq)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
