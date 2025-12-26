import { flipCoin } from "./flip";
import { storeBet } from "../store/bets";
import { PublicKey } from "@solana/web3.js";
import { fetchTx } from "../solana/fetchTx";
import { Side } from "../game/flip";
import { transfer } from "../solana/transfer";
import type { txMetaData } from "../solana/fetchTx";
import { ESCROW_PUBKEY } from "../config/wallet";
import { getBet } from "../store/bets";

export async function ManageFlip(userFlipSide: Side, signature: string, userPublicKeyString: string, amount: number) {
    try {
        // Convert user's public key string to PublicKey object
        const userPublicKey = new PublicKey(userPublicKeyString);
        const checkSignature = await getBet(signature);


        // Use ESCROW_PUBKEY to verify the transaction was sent to our escrow
        const parseSignature: { txMetaData: txMetaData, confirmed: Boolean } = await fetchTx(signature, ESCROW_PUBKEY);
        let winTxSignature;
        if (!parseSignature.confirmed) {
            return { win: false, result: "Transaction not confirmed", winTxSignature: "" };
        }
        const { side, amount } = parseSignature.txMetaData;
        if (checkSignature && checkSignature.amount < amount) {
            return { win: false, result: "Transaction already processed", winTxSignature: "" };
        }

        const { result, win } = flipCoin(userFlipSide);

        if (win) {
            // Convert SOL to lamports (1 SOL = 1e9 lamports) and double for winnings
            const winningsInLamports = Math.floor(amount * 2 * 1e9);
            // Transfer winnings to the USER's public key (not escrow!)
            winTxSignature = await transfer(userPublicKey, winningsInLamports);
        }

        await storeBet(signature, {
            playerPublicKey: userPublicKeyString,
            amount,
            choice: side,
            result,
            won: win,
            payoutSignature: winTxSignature
        });
        return { win, result, winTxSignature };
    } catch (error) {
        console.log(error);
        return { win: false, result: "Transaction failed", winTxSignature: "" };
    }

}
