import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Dices, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary via-amber-500 to-primary flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.4)]">
            <Dices className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent">
            COINFLIP
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Home
          </a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Stats
          </a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <div className="wallet-adapter-button-wrapper">
            <WalletMultiButton />
          </div>
          
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col gap-4 mt-8">
                <a href="#" className="text-lg font-medium hover:text-primary transition-colors">
                  Home
                </a>
                <a href="#" className="text-lg font-medium hover:text-primary transition-colors">
                  Stats
                </a>
                <a href="#" className="text-lg font-medium hover:text-primary transition-colors">
                  FAQ
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
