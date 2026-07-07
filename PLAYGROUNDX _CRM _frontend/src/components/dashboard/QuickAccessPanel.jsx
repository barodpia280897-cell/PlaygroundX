// src/components/dashboard/QuickAccessPanel.jsx
import { motion } from 'framer-motion';

/**
 * Reusable Quick Access Panel
 * cards: [{ icon: LucideIcon, title, description, color (hex), onClick }]
 */
export default function QuickAccessPanel({ title = 'Quick Access', cards = [] }) {
  return (
    <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-neon-blue to-neon-purple" />
        <h2 className="font-black text-white text-sm uppercase tracking-widest">{title}</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={card.onClick}
              className="relative group flex flex-col items-start gap-2.5 p-4 rounded-xl border transition-all duration-200 text-left overflow-hidden
                bg-gray-950/60 border-gray-800 hover:border-gray-600 hover:bg-gray-900"
            >
              {/* Glow blob */}
              <div
                className="absolute -top-4 -right-4 w-16 h-16 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"
                style={{ backgroundColor: card.color }}
              />
              {/* Icon */}
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                style={{
                  backgroundColor: `${card.color}18`,
                  border: `1px solid ${card.color}35`,
                  color: card.color,
                }}
              >
                <Icon size={17} />
              </div>
              {/* Text */}
              <div>
                <div className="text-xs font-black text-white group-hover:text-white leading-tight">
                  {card.title}
                </div>
                {card.description && (
                  <div className="text-[10px] text-gray-500 mt-0.5 leading-tight line-clamp-2">
                    {card.description}
                  </div>
                )}
              </div>
              {/* Active indicator line */}
              <div
                className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300 rounded-full"
                style={{ backgroundColor: card.color }}
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
