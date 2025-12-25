import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Header } from '@/components/Header';
import { BettingPanel } from '@/components/BettingPanel';
import { FlipHistory } from '@/components/FlipHistory';
import { ResultModal } from '@/components/ResultModal';
import { DisclaimerModal } from '@/components/DisclaimerModal';
import { FlipModal } from '@/components/FlipModal';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { createAndSignTransfer } from '@/services/solanaTransfer';
import { submitFlip } from '@/services/flipApi';
import { useToast } from '@/hooks/use-toast';

interface FlipRecord {
  id: string;
  wallet: string;
  amount: number;
  choice: 'heads' | 'tails';
  result: 'heads' | 'tails';
  won: boolean;
  timestamp: Date;
}

const Index = () => {
  const { connected, publicKey, signTransaction } = useWallet();
  const { toast } = useToast();
  const [flipStatus, setFlipStatus] = useState<'idle' | 'confirming' | 'flipping' | 'completed'>('idle');
  const [showFlipModal, setShowFlipModal] = useState(false);
  const [coinResult, setCoinResult] = useState<'heads' | 'tails' | null>(null);
  const [currentChoice, setCurrentChoice] = useState<'heads' | 'tails'>('heads');
  const [currentAmount, setCurrentAmount] = useState(0.1);
  const [showResult, setShowResult] = useState(false);
  const [lastFlip, setLastFlip] = useState<{ won: boolean; amount: number; result: 'heads' | 'tails' } | null>(null);
  const [history, setHistory] = useState<FlipRecord[]>([]);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  const handleFlip = useCallback(async (amount: number, choice: 'heads' | 'tails') => {
    if (!publicKey || !signTransaction) return;

    setCurrentChoice(choice);
    setCurrentAmount(amount);
    setShowFlipModal(true);
    setFlipStatus('confirming');
    setCoinResult(null);

    try {
      // 1. Sign and send the transfer transaction
      const transferResult = await createAndSignTransfer(
        { publicKey, signTransaction },
        amount + (amount * 0.03),
        choice
      );

      setFlipStatus('flipping');

      // 2. Call the flip API with signature, userId, and side
      const flipResponse = await submitFlip({
        signature: transferResult.signature,
        userId: transferResult.publicKey,
        amount: amount,
        side: choice,
      });

      const result = flipResponse.result;
      const won = flipResponse.win;

      setCoinResult(result);
      setFlipStatus('completed');

      // Add to history
      const newRecord: FlipRecord = {
        id: Date.now().toString(),
        wallet: publicKey.toBase58(),
        amount,
        choice,
        result,
        won,
        timestamp: new Date(),
      };

      setHistory(prev => [newRecord, ...prev].slice(0, 20));

      // Show result modal after a short delay
      setTimeout(() => {
        setShowFlipModal(false);
        setFlipStatus('idle');
        setLastFlip({ won, amount: won ? amount * 0.97 : amount, result });
        setShowResult(true);
      }, 1000);
    } catch (error) {
      console.error('Flip error:', error);
      setFlipStatus('idle');
      setShowFlipModal(false);
      toast({
        title: "Flip Failed",
        description: error instanceof Error ? error.message : "Transaction failed",
        variant: "destructive",
      });
    }
  }, [publicKey, signTransaction, toast]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />

      <DisclaimerModal onConfirm={() => setDisclaimerAccepted(true)} />

      <Header />

      <main className="relative z-10 pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            {/* Devnet Badge */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-sm mb-8 animate-pulse-glow-green"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-sm text-emerald-400 tracking-wider uppercase">
                Running on Devnet
              </span>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-2">
              <span className="bg-gradient-to-r from-primary via-amber-400 to-primary bg-clip-text text-transparent">
                COINFLIP
              </span>
            </h1>
            <p className="text-xl text-primary font-semibold mb-2">Double or Nothing</p>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Flip test SOL. 50/50 odds, instant results.
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="flex flex-col items-center gap-8">
            {/* Betting Panel or Connect Wallet */}
            {connected ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <BettingPanel
                  onFlip={handleFlip}
                  isFlipping={flipStatus !== 'idle'}
                  disabled={!disclaimerAccepted}
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center space-y-6"
              >
                <h2 className="text-2xl font-bold text-foreground">
                  Connect Your Wallet to Begin
                </h2>
                <div className="wallet-adapter-button-wrapper flex justify-center">
                  <WalletMultiButton />
                </div>
              </motion.div>
            )}

            {/* Fee Notice */}
            <p className="text-sm text-muted-foreground">
              <span className="text-primary font-medium">3% fees</span> apply for every flip • <span className="text-emerald-400">Devnet only</span>
            </p>

            {/* Flip History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full"
            >
              <FlipHistory history={history} />
            </motion.div>
          </div>
        </div>
      </main>

      {/* Flip Modal */}
      <FlipModal
        isOpen={showFlipModal}
        flipStatus={flipStatus}
        result={coinResult}
        choice={currentChoice}
        amount={currentAmount}
      />

      {/* Result Modal */}
      {lastFlip && (
        <ResultModal
          isOpen={showResult}
          onClose={() => setShowResult(false)}
          won={lastFlip.won}
          amount={lastFlip.amount}
          result={lastFlip.result}
        />
      )}
    </div>
  );
};

export default Index;
