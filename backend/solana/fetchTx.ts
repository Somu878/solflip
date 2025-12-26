
import { PublicKey } from "@solana/web3.js";
import { connection } from "./connection";

/**
 * Fetches memo data from a Solana transaction signature
 */
export async function fetchTx(signature: string, escrowPubkey: PublicKey): Promise<{ txMetaData: txMetaData, confirmed: Boolean }> {
    const tx = await connection.getParsedTransaction(signature, {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0,
    });

    if (!tx) {
        return { txMetaData: { side: "", amount: 0, userPubkey: null }, confirmed: false };
    }

    const data: txMetaData = {
        side: "",
        amount: 0,
        userPubkey: null,
    };

    // Verify the escrow is included in the transaction
    const verify = tx.transaction.message.accountKeys.some(
        (account) => account.pubkey.toBase58() === escrowPubkey.toBase58()
    );
    if (!verify) {
        return { txMetaData: { side: "", amount: 0, userPubkey: null }, confirmed: false };
    }

    // Extract the user's public key - the signer that is NOT the escrow
    for (const account of tx.transaction.message.accountKeys) {
        if (account.signer && account.pubkey.toBase58() !== escrowPubkey.toBase58()) {
            data.userPubkey = account.pubkey;
            break;
        }
    }

    for (const ix of tx.transaction.message.instructions) {
        if ("parsed" in ix && ix.program === "spl-memo") {
            // SPL memo's parsed value is always a string
            const memoString = ix.parsed as string;
            const memo = memoString.split("-");
            data.side = memo[0] ?? "";
            data.amount = Number(memo[1] ?? 0);
        }
    }
    return { txMetaData: data, confirmed: true };
}

export interface txMetaData {
    side: string;
    amount: number;
    userPubkey: PublicKey | null;
}