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
    <div className="w-full max-w-md space-y-6">
      {/* Amount Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Bet Amount (SOL)
        </label>
        <div className="grid grid-cols-3 gap-2">
          {PRESET_AMOUNTS.map((preset) => (
            <Button
              key={preset}
              variant={amount === preset.toString() ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAmount(preset.toString())}
              className={`font-mono ${
                amount === preset.toString()
                  ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(251,191,36,0.3)]'
                  : 'border-border/50 hover:border-primary/50'
              }`}
            >
              {preset} SOL
            </Button>
          ))}
        </div>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0.01"
          step="0.01"
          className="bg-background/50 border-border/50 text-center font-mono text-lg"
          placeholder="Custom amount"
        />
      </div>

      {/* Side Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Pick Your Side
        </label>
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setChoice('heads')}
            className={`h-20 flex-col gap-2 transition-all duration-300 ${
              choice === 'heads'
                ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.3)]'
                : 'border-border/50 hover:border-amber-500/50'
            }`}
          >
            <TrendingUp className="w-6 h-6" />
            <span className="font-bold">HEADS</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setChoice('tails')}
            className={`h-20 flex-col gap-2 transition-all duration-300 ${
              choice === 'tails'
                ? 'bg-slate-500/20 border-slate-400 text-slate-300 shadow-[0_0_30px_rgba(148,163,184,0.3)]'
                : 'border-border/50 hover:border-slate-400/50'
            }`}
          >
            <TrendingDown className="w-6 h-6" />
            <span className="font-bold">TAILS</span>
          </Button>
        </div>
      </div>

      {/* Potential Win */}
      <div className="bg-background/30 rounded-lg p-4 border border-border/30">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Potential Win:</span>
          <span className="text-2xl font-bold text-primary font-mono">
            {(parseFloat(amount || '0') * 1.94).toFixed(2)} SOL
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">3% fee applies</p>
      </div>

      {/* Flip Button */}
      <Button
        size="lg"
        onClick={handleFlip}
        disabled={!connected || isFlipping || disabled || parseFloat(amount) <= 0}
        className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary via-amber-500 to-primary hover:from-amber-400 hover:to-amber-600 text-primary-foreground shadow-[0_0_40px_rgba(251,191,36,0.4)] transition-all duration-300 disabled:opacity-50"
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
