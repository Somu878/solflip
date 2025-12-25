import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { PartyPopper, Frown } from 'lucide-react';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  won: boolean;
  amount: number;
  result: 'heads' | 'tails';
}

export const ResultModal = ({ isOpen, onClose, won, amount, result }: ResultModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            {won ? '🎉 You Won!' : '😢 You Lost'}
          </DialogTitle>
        </DialogHeader>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-6 py-6"
        >
          <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
            won 
              ? 'bg-green-500/20 text-green-500' 
              : 'bg-red-500/20 text-red-500'
          }`}>
            {won ? (
              <PartyPopper className="w-12 h-12" />
            ) : (
              <Frown className="w-12 h-12" />
            )}
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              The coin landed on <span className="font-bold text-foreground uppercase">{result}</span>
            </p>
            <p className={`text-3xl font-bold ${won ? 'text-green-500' : 'text-red-500'}`}>
              {won ? '+' : '-'}{amount.toFixed(2)} SOL
            </p>
          </div>
          
          <Button onClick={onClose} className="w-full">
            {won ? 'Collect Winnings' : 'Try Again'}
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
