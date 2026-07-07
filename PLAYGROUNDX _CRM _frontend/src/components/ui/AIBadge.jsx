import { Bot } from 'lucide-react';

export default function AIBadge({ label = 'AI Conversion Manager' }) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] text-indigo-200 mb-1 font-bold uppercase tracking-wider">
      <Bot size={12} /> {label}
    </div>
  );
}
