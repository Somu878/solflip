import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

export const ESCROW_KEYPAIR = Keypair.fromSecretKey(
    bs58.decode(process.env.PRIVATE_KEY as string)
);

export const ESCROW_PUBKEY = ESCROW_KEYPAIR.publicKey;