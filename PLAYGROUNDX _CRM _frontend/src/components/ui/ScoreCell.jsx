
export default function ScoreCell({ leadScore, vipScore, healthScore }) {
  return (
    <div className="flex items-end gap-2 mb-1">
      <div className="flex flex-col items-center">
        <span className="text-xs font-black text-white leading-none">{leadScore || 0}</span>
        <span className="text-[8px] text-gray-500 uppercase mt-1">Lead</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xs font-black text-yellow-400 leading-none">{vipScore || 0}</span>
        <span className="text-[8px] text-gray-500 uppercase mt-1">VIP</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xs font-black text-neon-green leading-none">{healthScore || 0}</span>
        <span className="text-[8px] text-gray-500 uppercase mt-1">Health</span>
      </div>
    </div>
  );
}
