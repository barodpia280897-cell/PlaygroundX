import { motion } from 'framer-motion';

export const CardSkeleton = () => (
  <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden">
    <div className="absolute inset-0 shimmer" />
    <div className="w-1/3 h-3 bg-gray-800 rounded" />
    <div className="w-1/2 h-8 bg-gray-800 rounded" />
    <div className="w-1/4 h-2 bg-gray-800 rounded" />
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 5 }) => (
  <div className="w-full bg-gray-900/30 border border-gray-800/50 rounded-2xl overflow-hidden relative">
    <div className="absolute inset-0 shimmer pointer-events-none" />
    <div className="w-full border-b border-gray-800 flex px-4 py-3">
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="flex-1 h-3 bg-gray-800/50 rounded mx-2" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="w-full border-b border-gray-800/50 flex px-4 py-3">
        {Array.from({ length: cols }).map((_, c) => (
          <div key={c} className="flex-1 h-4 bg-gray-800 rounded mx-2" />
        ))}
      </div>
    ))}
  </div>
);

export const ChartSkeleton = () => (
  <div className="w-full h-full min-h-[200px] bg-gray-900/40 border border-gray-800 rounded-xl p-4 flex flex-col justify-end relative overflow-hidden">
    <div className="absolute inset-0 shimmer pointer-events-none" />
    <div className="flex items-end justify-between h-3/4 gap-2 px-2">
      {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
        <div key={i} className="flex-1 bg-gray-800 rounded-t-sm" style={{ height: `${h}%` }} />
      ))}
    </div>
    <div className="w-full h-px bg-gray-800 mt-2" />
  </div>
);
