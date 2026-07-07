import { AlertCircle } from 'lucide-react';

export default function SystemAlert({ message }) {
  return (
    <div className="flex justify-center my-4">
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 max-w-lg text-center shadow-[0_0_15px_rgba(239,68,68,0.1)]">
        <div className="flex items-center justify-center gap-2 text-red-500 text-xs font-bold mb-1">
          <AlertCircle size={12} /> System Event
        </div>
        <p className="text-xs text-gray-300">{message}</p>
      </div>
    </div>
  );
}
