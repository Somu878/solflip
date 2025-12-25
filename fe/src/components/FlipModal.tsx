import { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { CoinFlip } from './CoinFlip';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Loader2, Wallet } from 'lucide-react';

interface FlipModalProps {
  isOpen: boolean;
  flipStatus: 'idle' | 'confirming' | 'flipping' | 'completed';
  result: 'heads' | 'tails' | null;
  choice: 'heads' | 'tails';
  amount: number;
}

export const FlipModal: FC<FlipModalProps> = ({ isOpen, flipStatus, result, choice, amount }) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => { }}>
      <DialogContent className="sm:max-w-sm bg-background/95 backdrop-blur-xl border-border/50 flex flex-col items-center py-10 min-h-[400px] justify-center" hideCloseButton>
        <VisuallyHidden>
          <DialogTitle>Coin Flip</DialogTitle>
        </VisuallyHidden>

        <AnimatePresence mode="wait">
          {flipStatus === 'confirming' ? (
            <motion.div
              key="confirming"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="relative z-10 p-4 rounded-full border-2 border-primary/30 bg-background/50"
                >
                  <Loader2 className="w-12 h-12 text-primary" />
                </motion.div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-1.5 border-2 border-background">
                  <Wallet className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent animate-pulse">
                  Confirming Transaction...
                </h3>
                <p className="text-sm text-muted-foreground max-w-[200px]">
                  Please approve the request in your wallet
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="flipping"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center w-full"
            >
              <div className="relative mb-6">
                {/* Glow effect */}
                <div className="absolute inset-0 blur-3xl bg-primary/30 rounded-full scale-150" />
                <CoinFlip isFlipping={flipStatus === 'flipping'} result={result} />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center space-y-2"
              >
                <p className="text-muted-foreground text-sm uppercase tracking-wide">
                  {flipStatus === 'flipping' ? 'Flipping...' : result ? 'Result' : 'Good luck!'}
                </p>
                <p className="text-foreground font-semibold text-lg">
                  Bet: <span className="text-primary font-mono">{amount} SOL</span> on{' '}
                  <span className={choice === 'heads' ? 'text-amber-400' : 'text-slate-400'}>
                    {choice.toUpperCase()}
                  </span>
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
