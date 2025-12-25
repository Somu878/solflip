import { Connection } from "@solana/web3.js";

const HELIUS_RPC = process.env.HELIUS_RPC;
export const connection = new Connection(
    HELIUS_RPC as string);
