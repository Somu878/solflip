import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

interface FlipRecord {
  id: string;
  wallet: string;
  amount: number;
  choice: 'heads' | 'tails';
  result: 'heads' | 'tails';
  won: boolean;
  timestamp: Date;
  signature?: string;
  payoutSignature?: string | null;
}

interface FlipHistoryProps {
  history: FlipRecord[];
}

export const FlipHistory = ({ history }: FlipHistoryProps) => {
  const formatWallet = (wallet: string) => {
    return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <div className="w-full max-w-md">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
        Recent Flips
      </h3>
      <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        <AnimatePresence mode="popLayout">
          {history.map((flip, index) => (
            <motion.div
              key={flip.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center justify-between p-3 rounded-lg border ${flip.won
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-red-500/10 border-red-500/30'
                }`}
            >
              <div className="flex items-center gap-3">
                {flip.won ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <div>
                  <span className="font-mono text-sm text-foreground">
                    {formatWallet(flip.wallet)}
                  </span>
                  <span className="text-muted-foreground text-sm ml-2">
                    flipped <span className="text-primary font-bold">{flip.amount} SOL</span>
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-sm font-bold ${flip.won ? 'text-green-500' : 'text-red-500'}`}>
                  {flip.won ? 'WON' : 'LOST'}
                </span>
                <p className="text-xs text-muted-foreground">{formatTime(flip.timestamp)}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {history.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No flips yet. Be the first!
          </div>
        )}
      </div>
    </div>
  );
};
