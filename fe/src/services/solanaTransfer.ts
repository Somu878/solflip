import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { createMemoInstruction } from "@solana/spl-memo";

const DEVNET_RPC = "https://api.devnet.solana.com";
const ESCROW_PUBKEY = new PublicKey("BvXzc2NSaHp2TWWfmvN7WddvU9rgQBqLX9ieWv8m1Ao5");

export interface TransferResult {
  signature: string;
  publicKey: string;
  amount: number;
  side: "heads" | "tails";
}

export async function createAndSignTransfer(
  wallet: {
    publicKey: PublicKey;
    signTransaction: (tx: Transaction) => Promise<Transaction>;
  },
  amount: number,
  side: "heads" | "tails"
): Promise<TransferResult> {
  const connection = new Connection(DEVNET_RPC);
  const lamports = Math.floor(amount * LAMPORTS_PER_SOL);

  // Memo format: flipSide-amount
  const memo = `${side}-${amount}`;

  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: ESCROW_PUBKEY,
      lamports,
    }),
    createMemoInstruction(memo)
  );

  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = wallet.publicKey;

  const signedTx = await wallet.signTransaction(tx);
  const signature = await connection.sendRawTransaction(signedTx.serialize());

  await connection.confirmTransaction(signature);

  return {
    signature,
    publicKey: wallet.publicKey.toBase58(),
    amount,
    side,
  };
}
