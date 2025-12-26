import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWallet } from '@solana/wallet-adapter-react';
import { Coins, TrendingUp, TrendingDown } from 'lucide-react';

interface BettingPanelProps {
  onFlip: (amount: number, choice: 'heads' | 'tails') => void;
  isFlipping: boolean;
  disabled: boolean;
}

const PRESET_AMOUNTS = [0.1, 0.25, 0.5, 1, 2, 5];

export const BettingPanel = ({ onFlip, isFlipping, disabled }: BettingPanelProps) => {
  const [amount, setAmount] = useState<string>('0.1');
  const [choice, setChoice] = useState<'heads' | 'tails'>('heads');
  const { connected } = useWallet();

  const handleFlip = () => {
    const numAmount = parseFloat(amount);
    if (numAmount > 0) {
      onFlip(numAmount, choice);
    }
  };

  return (
    <div className="w-full max-w-md space-y-4 md:space-y-5">
      {/* Amount Selection */}
      <div className="space-y-2.5">
        <label className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Bet Amount (SOL)
        </label>
        <div className="grid grid-cols-3 gap-2">
          {PRESET_AMOUNTS.map((preset) => (
            <Button
              key={preset}
              variant={amount === preset.toString() ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAmount(preset.toString())}
              className={`font-mono text-sm md:text-base h-10 md:h-11 ${amount === preset.toString()
                ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(251,191,36,0.3)]'
                : 'border-border/50 hover:border-primary/50'
                }`}
            >
              {preset}
            </Button>
          ))}
        </div>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0.01"
          step="0.01"
          className="bg-background/60 border-primary/30 text-center font-mono text-base md:text-lg h-10 md:h-11 focus:border-primary focus:ring-primary/20 focus:shadow-[0_0_15px_rgba(251,191,36,0.15)] transition-all"
          placeholder="Custom amount"
        />
      </div>

      {/* Side Selection */}
      <div className="space-y-2.5">
        <label className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Pick Your Side
        </label>
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setChoice('heads')}
            className={`h-16 md:h-20 flex-col gap-1.5 md:gap-2 transition-all duration-300 ${choice === 'heads'
              ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.3)]'
              : 'border-border/50 hover:border-amber-500/50'
              }`}
          >
            <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
            <span className="font-bold text-base md:text-lg">HEADS</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setChoice('tails')}
            className={`h-16 md:h-20 flex-col gap-1.5 md:gap-2 transition-all duration-300 ${choice === 'tails'
              ? 'bg-slate-500/20 border-slate-400 text-slate-300 shadow-[0_0_30px_rgba(148,163,184,0.3)]'
              : 'border-border/50 hover:border-slate-400/50'
              }`}
          >
            <TrendingDown className="w-5 h-5 md:w-6 md:h-6" />
            <span className="font-bold text-base md:text-lg">TAILS</span>
          </Button>
        </div>
      </div>

      {/* Potential Win */}
      <div className="bg-background/30 rounded-lg p-3.5 md:p-4 border border-border/30">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm md:text-base">Potential Win:</span>
          <span className="text-xl md:text-2xl font-bold text-primary font-mono">
            {(parseFloat(amount || '0') * 1.94).toFixed(2)} SOL
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">
          <span className="text-primary/80">3% fee</span> deducted from winnings
        </p>
      </div>

      {/* Flip Button */}
      <Button
        size="lg"
        onClick={handleFlip}
        disabled={!connected || isFlipping || disabled || parseFloat(amount) <= 0}
        className="w-full h-12 md:h-14 text-base md:text-lg font-bold bg-gradient-to-r from-primary via-amber-500 to-primary hover:from-amber-400 hover:to-amber-600 text-primary-foreground shadow-[0_0_40px_rgba(251,191,36,0.4)] transition-all duration-300 disabled:opacity-50 !mt-2 md:!mt-3"
      >
        {isFlipping ? (
          <span className="flex items-center gap-2">
            <Coins className="w-5 h-5 animate-spin" />
            FLIPPING...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Coins className="w-5 h-5" />
            FLIP FOR {amount} SOL
          </span>
        )}
      </Button>
    </div>
  );
};
