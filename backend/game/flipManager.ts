import { flipCoin } from "./flip";
import { storeBet } from "../store/bets";
import { PublicKey } from "@solana/web3.js";
import { fetchTx } from "../solana/fetchTx";
import { Side } from "../game/flip";
import { transfer } from "../solana/transfer";
import type { txMetaData } from "../solana/fetchTx";
import { ESCROW_PUBKEY } from "../config/wallet";


export async function ManageFlip(userFlipSide: Side, signature: string, userPublicKeyString: string, amount: number) {
    try {
        // Convert user's public key string to PublicKey object
        const userPublicKey = new PublicKey(userPublicKeyString);

        // Use ESCROW_PUBKEY to verify the transaction was sent to our escrow
        const parseSignature: { txMetaData: txMetaData, confirmed: Boolean } = await fetchTx(signature, ESCROW_PUBKEY);
        let winTxSignature;
        if (!parseSignature.confirmed) {
            throw new Error("Transaction not confirmed");
        }
        const { side, userId } = parseSignature.txMetaData;

        const { result, win } = flipCoin(userFlipSide);

        if (win) {
            // Convert SOL to lamports (1 SOL = 1e9 lamports) and double for winnings
            const winningsInLamports = Math.floor(amount * 2 * 1e9);
            // Transfer winnings to the USER's public key (not escrow!)
            winTxSignature = await transfer(userPublicKey, winningsInLamports);
            storeBet(signature, { side, amount, userId, result, win });
        }
        return { win, result, winTxSignature };
    } catch (error) {
        throw error;
    }

}
