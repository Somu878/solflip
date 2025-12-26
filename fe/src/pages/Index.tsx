import { useState, useCallback, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BettingPanel } from '@/components/BettingPanel';
import { FlipHistory } from '@/components/FlipHistory';
import { ResultModal } from '@/components/ResultModal';
import { DisclaimerModal } from '@/components/DisclaimerModal';
import { FlipModal } from '@/components/FlipModal';
import { motion } from 'framer-motion';
import { createAndSignTransfer } from '@/services/solanaTransfer';
import { submitFlip, fetchBets, Bet } from '@/services/flipApi';
import { useToast } from '@/hooks/use-toast';

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

  // Fetch bets from backend on mount
  useEffect(() => {
    const loadBets = async () => {
      try {
        const bets = await fetchBets();
        const formattedBets: FlipRecord[] = bets.map((bet: Bet) => ({
          id: bet.signature,
          wallet: bet.playerPublicKey,
          amount: bet.amount,
          choice: bet.choice as 'heads' | 'tails',
          result: bet.result as 'heads' | 'tails',
          won: bet.won,
          timestamp: new Date(bet.createdAt),
          signature: bet.signature,
          payoutSignature: bet.payoutSignature,
        }));
        // Sort by timestamp descending (most recent first)
        formattedBets.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        setHistory(formattedBets.slice(0, 20));
      } catch (error) {
        console.error('Failed to fetch bets:', error);
      }
    };
    loadBets();
  }, []);

  const handleFlip = useCallback(async (amount: number, choice: 'heads' | 'tails') => {
    if (!publicKey || !signTransaction) return;

    setCurrentChoice(choice);
    setCurrentAmount(amount);
    setShowFlipModal(true);
    setFlipStatus('confirming');
    setCoinResult(null);

    try {
      // 1. Sign and send the transfer transaction (just the bet amount, fee collected on win)
      const transferResult = await createAndSignTransfer(
        { publicKey, signTransaction },
        amount,
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

      // Keep spinning for a bit to build anticipation, then show result
      setTimeout(() => {
        setCoinResult(result);
        setFlipStatus('completed');

        // Add to history after result is shown
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

        // Show result modal after animation completes
        setTimeout(() => {
          setShowFlipModal(false);
          setFlipStatus('idle');
          setLastFlip({ won, amount: won ? amount * 1.94 : amount, result });
          setShowResult(true);
        }, 1500);
      }, 1500);
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

      <main className="relative z-10 pt-16 md:pt-20 pb-4 md:pb-6 px-4 min-h-[calc(100vh-3.5rem)] md:min-h-[calc(100vh-4rem)] flex flex-col">
        <div className="container mx-auto max-w-4xl flex-1 flex flex-col">
          {/* Hero Section - Compact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-4 md:mb-6"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mt-3 mb-1 md:mb-2">
              <span className="bg-gradient-to-r from-primary via-amber-400 to-primary bg-clip-text text-transparent">
                SOLFLIP
              </span>
            </h1>
            {/* <p className="text-xl md:text-2xl text-primary font-semibold mb-1 md:mb-2">Double or Nothing</p> */}
            <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto">
              Flip test SOL. 50/50 odds, instant results.
            </p>
          </motion.div>

          {/* Main Content - Centered */}
          <div className="flex flex-col items-center gap-4 md:gap-6 flex-1 justify-center">
            {/* Betting Panel or Connect Wallet */}
            {connected ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full max-w-md"
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
                className="text-center space-y-4"
              >
                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                  Connect Your Wallet to Begin
                </h2>
                <div className="wallet-adapter-button-wrapper flex justify-center">
                  <WalletMultiButton />
                </div>
              </motion.div>
            )}

            {/* Devnet Notice */}
            <p className="text-xs md:text-sm text-emerald-400/80">
              Running on Devnet
            </p>
          </div>

          {/* Flip History - At bottom, scrollable */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full mt-4 md:mt-6"
          >
            <FlipHistory history={history} />
          </motion.div>
        </div>
      </main>

      <Footer />

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
