import {
    Connection,
    PublicKey,
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL,
    Keypair
} from "@solana/web3.js";
import { createMemoInstruction } from "@solana/spl-memo";
import { ESCROW_KEYPAIR } from "./config/wallet";

// 1. Solana connection
const connection = new Connection(
    "https://api.devnet.solana.com");

// 2. Escrow wallet (backend-controlled pubkey)
const ESCROW_PUBKEY = window.pubkey


// 4. Build memo
const side = "heads";
const lamports = 0.01 * LAMPORTS_PER_SOL; // 0.01 SOL
const userId = "user123";

const memo = `${side}-${lamports}-${userId}`;

// 5. Build transaction
const tx = new Transaction().add(
    SystemProgram.transfer({
        fromPubkey: ESCROW_KEYPAIR.publicKey,
        toPubkey: ESCROW_PUBKEY,
        lamports,
    }),
    createMemoInstruction(memo)
);

// 6. Send transaction (user signs here)
const recentBlockhash = await connection.getLatestBlockhash();
tx.recentBlockhash = recentBlockhash.blockhash;
tx.feePayer = ESCROW_KEYPAIR.publicKey;
tx.sign(ESCROW_KEYPAIR);

const signature = await connection.sendRawTransaction(tx.serialize());

// 7. Wait for confirmation
await connection.confirmTransaction(signature);

console.log("TX SIGNATURE:", signature);
