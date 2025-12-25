import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Gamepad2, Sparkles } from 'lucide-react';

interface DisclaimerModalProps {
  onConfirm: () => void;
}

export const DisclaimerModal = ({ onConfirm }: DisclaimerModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('solflip-disclaimer-accepted');
    if (!hasAccepted) {
      setIsOpen(true);
    } else {
      onConfirm();
    }
  }, [onConfirm]);

  const handleConfirm = () => {
    if (accepted) {
      localStorage.setItem('solflip-disclaimer-accepted', 'true');
      setIsOpen(false);
      onConfirm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg bg-background/95 backdrop-blur-xl border-border/50" hideCloseButton>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Gamepad2 className="w-6 h-6" />
            Welcome to SOLFLIP
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Devnet Badge */}
          <div className="flex justify-center">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 animate-pulse-glow-green">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-sm text-emerald-400 tracking-wider uppercase">
                Devnet Demo
              </span>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
          </div>

          {/* Fun notice */}
          <div className="bg-card/50 rounded-xl p-4 border border-border/50">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Running on Solana <span className="text-emerald-400 font-semibold">Devnet</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                Uses <span className="text-purple-400 font-semibold">test tokens</span> with no real value
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Built for <span className="text-primary font-semibold">fun & learning</span> only
              </li>
            </ul>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="disclaimer"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked as boolean)}
              className="mt-1"
            />
            <label htmlFor="disclaimer" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
              I understand this is a demo game using test tokens on Solana Devnet. No real money is involved and this is purely for entertainment purposes.
            </label>
          </div>
          
          <Button
            onClick={handleConfirm}
            disabled={!accepted}
            className="w-full bg-emerald-500 text-white hover:bg-emerald-600"
          >
            Let's Play!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
