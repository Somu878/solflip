import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CoinFlipProps {
  isFlipping: boolean;
  result: 'heads' | 'tails' | null;
}

export const CoinFlip = ({ isFlipping, result }: CoinFlipProps) => {
  return (
    <div className="relative w-40 h-40 perspective-1000">
      <motion.div
        className="w-full h-full relative preserve-3d"
        animate={
          isFlipping
            ? { rotateY: [0, 1800] }
            : result === 'tails'
            ? { rotateY: 180 }
            : { rotateY: 0 }
        }
        transition={
          isFlipping
            ? { duration: 2, ease: 'easeInOut' }
            : { duration: 0.3 }
        }
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Heads */}
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center backface-hidden border-4 border-amber-300 shadow-[0_0_40px_rgba(251,191,36,0.5)]"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-center">
            <span className="text-4xl font-bold text-amber-900">H</span>
            <div className="text-xs text-amber-800 font-semibold">HEADS</div>
          </div>
        </div>
        
        {/* Tails */}
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-400 via-gray-300 to-slate-500 flex items-center justify-center border-4 border-slate-300 shadow-[0_0_40px_rgba(148,163,184,0.5)]"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="text-center">
            <span className="text-4xl font-bold text-slate-700">T</span>
            <div className="text-xs text-slate-600 font-semibold">TAILS</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
