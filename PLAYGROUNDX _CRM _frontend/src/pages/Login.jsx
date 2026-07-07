import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, MOCK_USERS } from '../contexts/AuthContext';
import { getRolePrefix } from '../utils/routing';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Shield, Zap, AlertCircle, Crown, Users, Headphones, BarChart2, Activity, LogIn } from 'lucide-react';

const roleIcons = {
  PLATFORM_ADMIN: { Icon: Shield, color: '#00f0ff', badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30', cardBorder: 'border-cyan-500/30', cardBg: 'from-cyan-900/20 to-slate-900/40' },
  TENANT_OWNER: { Icon: Crown, color: '#ffd700', badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30', cardBorder: 'border-yellow-500/30', cardBg: 'from-yellow-900/20 to-slate-900/40' },
  MANAGER: { Icon: BarChart2, color: '#8a2be2', badge: 'bg-purple-500/20 text-purple-300 border-purple-400/30', cardBorder: 'border-purple-500/30', cardBg: 'from-purple-900/20 to-slate-900/40' },
  SUPERVISOR: { Icon: Shield, color: '#f97316', badge: 'bg-orange-500/20 text-orange-300 border-orange-400/30', cardBorder: 'border-orange-500/30', cardBg: 'from-orange-900/20 to-slate-900/40' },
  AGENT: { Icon: Headphones, color: '#39ff14', badge: 'bg-green-500/20 text-green-300 border-green-400/30', cardBorder: 'border-green-500/30', cardBg: 'from-green-900/20 to-slate-900/40' },
  VIEWER: { Icon: Activity, color: '#aaaaaa', badge: 'bg-gray-500/20 text-primary border-gray-400/30', cardBorder: 'border-gray-500/30', cardBg: 'from-gray-900/20 to-slate-900/40' },
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email or select a role below.'); return; }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const result = login(email, password);
    setLoading(false);
    if (result.success) {
      const found = MOCK_USERS.find(u => u.email === email);
      // Route PLATFORM users to platform dashboard, everyone else to their role-based dashboard
      const redirectPath = found.scope === 'PLATFORM' 
        ? '/platform/dashboard' 
        : `/${getRolePrefix(found.role)}/dashboard`;
      navigate(redirectPath, { replace: true });
    } else {
      setError('Invalid credentials. Select a role card below to auto-fill.');
    }
  };

  const handleCardClick = (user) => {
    setActiveCard(user.id);
    setEmail(user.email);
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="w-full h-full bg-background flex flex-col items-center relative overflow-y-auto custom-scrollbar px-4 py-8">

      {/* Animated bg blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-neon-blue/8 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-neon-purple/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/3 right-10 w-64 h-64 bg-neon-pink/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.7s' }} />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.035]"
        style={{ backgroundImage: 'linear-gradient(rgba(0,240,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,1) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      <div className="my-auto relative z-10 w-full max-w-lg">

        {/* ── BRAND HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-tr from-neon-blue to-neon-purple shadow-[0_0_28px_rgba(0,240,255,0.45)] shrink-0">
              <span className="text-xl font-black text-black tracking-tighter">PGX</span>
            </div>
            <div className="text-left">
              <div className="text-3xl font-black tracking-widest text-white leading-tight">PlayGroundX</div>
              <div className="text-[11px] text-neon-blue tracking-[0.22em] uppercase font-semibold">CRM OS</div>
            </div>
          </div>
          <h1 className="text-xl font-black text-white">Mission Control — Sign In</h1>
          <p className="text-gray-600 text-xs mt-1">Enter credentials or select a role card below to quick-access</p>
        </motion.div>

        {/* ── LOGIN FORM CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl border border-gray-800/80 rounded-2xl p-7 shadow-2xl shadow-black/50 mb-6"
        >
          {/* Status bar */}
          <div className="flex items-center gap-2 mb-5 px-3 py-2 rounded-xl bg-neon-green/5 border border-neon-green/20">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse shadow-[0_0_5px_rgba(57,255,20,1)]" />
            <span className="text-xs text-neon-green font-medium flex-1">Secure connection · All systems operational</span>
            <Shield size={12} className="text-neon-green" />
          </div>

          {error && (
            <div className="flex items-start gap-2.5 mb-4 px-3 py-2.5 rounded-xl bg-neon-pink/10 border border-neon-pink/30">
              <AlertCircle size={14} className="text-neon-pink shrink-0 mt-0.5" />
              <span className="text-xs text-neon-pink">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-[11px] font-semibold text-muted mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setActiveCard(null); }}
                placeholder="Enter email or pick a role below ↓"
                className="w-full bg-gray-900/60 border border-gray-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-neon-blue/60 focus:ring-1 focus:ring-neon-blue/20 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-semibold text-muted mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-900/60 border border-gray-700/80 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-neon-blue/60 focus:ring-1 focus:ring-neon-blue/20 transition-all"
                />
                <button
                  type="button"
                  id="toggle-password"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-neon-blue transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 accent-neon-blue rounded" defaultChecked />
                <span className="text-xs text-gray-600">Remember me</span>
              </label>
              <button type="button" className="text-xs text-neon-blue hover:underline">Forgot password?</button>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden group bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold py-3.5 rounded-xl text-sm shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:shadow-[0_0_30px_rgba(0,240,255,0.45)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500 skew-x-12" />
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={16} />
                  Sign In to Command Center
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* ── QUICK ACCESS LABEL ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="flex-1 h-px bg-gray-800" />
          <span className="text-[11px] text-gray-600 font-medium uppercase tracking-widest whitespace-nowrap">
            Quick Role Access
          </span>
          <div className="flex-1 h-px bg-gray-800" />
        </motion.div>

        {/* ── ROLE QUICK-ACCESS CARDS ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6"
        >
          {MOCK_USERS.map((u, i) => {
            const style = roleIcons[u.role] || roleIcons['VIEWER'];
            const { Icon } = style;
            const isActive = activeCard === u.id;

            return (
              <motion.button
                key={u.id}
                id={`quick-role-${u.id}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i + 0.35 }}
                onClick={() => handleCardClick(u)}
                disabled={loading}
                className={`
                  relative group text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden
                  bg-gradient-to-br ${style.cardBg} ${style.cardBorder}
                  ${isActive ? 'ring-1 ring-offset-0' : 'hover:border-opacity-70 hover:bg-white/5'}
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
                style={{ ringColor: style.color }}
              >
                {/* Active/loading shimmer */}
                {isActive && (
                  <div className="absolute inset-0 bg-white/5 animate-pulse rounded-xl" />
                )}

                <div className="relative flex items-center gap-2.5">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-full overflow-hidden border" style={{ borderColor: style.color + '50' }}>
                      <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background"
                      style={{ background: style.color, boxShadow: `0 0 5px ${style.color}` }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Icon size={10} style={{ color: style.color }} />
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${style.badge}`}>
                        {u.roleLabel}
                      </span>
                    </div>
                    <div className="text-[12px] font-bold text-white truncate">{u.name}</div>
                    <div className="text-[9px] text-gray-600 truncate">{u.email}</div>
                  </div>

                  {/* Loading spinner or arrow */}
                  <div className="shrink-0">
                    {isActive ? (
                      <div className="w-3.5 h-3.5 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
                    ) : (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                        style={{ background: style.color + '20', color: style.color }}>
                        <LogIn size={9} />
                      </div>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-6 text-[10px] text-gray-700"
        >
          <div className="flex items-center gap-1">
            <Zap size={10} className="text-neon-green" />
            <span>AI Online</span>
          </div>
          <span>|</span>
          <span>© 2025 PlayGroundX</span>
          <span>|</span>
          <span>v2.0.0</span>
        </motion.div>
      </div>
    </div>
  );
}
