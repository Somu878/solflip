import { ESCROW_KEYPAIR } from "../config/wallet";
import { connection } from "./connection";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";



export async function transfer(pubkey: PublicKey, amount: number) {
    try {
        const tx = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: ESCROW_KEYPAIR.publicKey,
                toPubkey: pubkey,
                lamports: amount,
            }),
        );
        const recentBlockhash = await connection.getLatestBlockhash();
        tx.recentBlockhash = recentBlockhash.blockhash;
        tx.feePayer = ESCROW_KEYPAIR.publicKey;
        tx.sign(ESCROW_KEYPAIR);
        const signature = await connection.sendRawTransaction(tx.serialize());
        await connection.confirmTransaction(signature);
        return signature;
    } catch (error) {
        throw new Error(error as string);
    }

}