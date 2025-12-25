import { connection } from "../solana/connection";
import { ESCROW_PUBKEY } from "../config/wallet";
import { parseMemo } from "../config/parseMemo";
import { storeBet } from "../store/bets";

export function startListener() {
    connection.onLogs(ESCROW_PUBKEY, async (logs, ctx) => {
        const sig = logs.signature;

        const tx = await connection.getParsedTransaction(sig, {
            maxSupportedTransactionVersion: 0,
        });
        if (!tx) return;

        const memoIx = tx.transaction.message.instructions.find(
            (ix: any) => ix.program === "spl-memo"
        );
        if (!memoIx) return;

        const memo = memoIx.programId
        const parsed = parseMemo(memoIx.programId);
        if (!parsed) return;

        storeBet(sig, {
            ...parsed,
            signature: sig,
            player: tx.transaction.message.accountKeys[0].pubkey,
        });
    });
}
