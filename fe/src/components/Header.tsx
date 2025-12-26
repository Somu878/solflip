import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Dices, Sparkles } from 'lucide-react';

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-3 md:px-4 h-14 md:h-16 flex items-center justify-between relative">
        {/* Logo - Left */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primary via-amber-500 to-primary flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.4)]">
            <Dices className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground" />
          </div>
          <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent hidden sm:block">
            SOLFLIP
          </span>
        </div>

        {/* Devnet Badge - Center (absolute positioned) */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <div className="inline-flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-sm animate-pulse-glow-green">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-[10px] md:text-xs text-emerald-400 tracking-wider uppercase">
              Devnet
            </span>
            <Sparkles className="w-3 h-3 text-emerald-400 hidden md:block" />
          </div>
        </div>

        {/* Wallet Button - Right */}
        <div className="wallet-adapter-button-wrapper wallet-mobile">
          <WalletMultiButton />
        </div>
      </div>
    </header>
  );
};
