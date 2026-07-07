// src/components/ui/Badge.jsx

const variants = {
  'Hot Lead':   'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'VIP':        'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'Active':     'bg-neon-green/15 text-neon-green border-neon-green/30',
  'Registered': 'bg-neon-blue/15 text-neon-blue border-neon-blue/30',
  'KYC Pending':'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'New':        'bg-gray-700/40 text-primary border-gray-600/40',
  'Online':     'bg-neon-green/15 text-neon-green border-neon-green/30',
  'In Call':    'bg-neon-blue/15 text-neon-blue border-neon-blue/30',
  'Break':      'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  'Offline':    'bg-gray-700/40 text-secondary border-gray-600/40',
  'Creator':    'bg-neon-purple/15 text-neon-purple border-neon-purple/30',
  'Fan':        'bg-neon-pink/15 text-neon-pink border-neon-pink/30',
  'default':    'bg-gray-700/40 text-primary border-gray-600/40',
};

export default function Badge({ label }) {
  const cls = variants[label] || variants['default'];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${cls}`}>
      {label}
    </span>
  );
}
