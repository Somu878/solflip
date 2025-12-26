import prisma from "../prisma/_client";

export interface TransferData {
    fromPublicKey: string;
    amount: number;
    memo?: string;
    status?: string;
    statusReason?: string;
}

/**
 * Store a new transfer in the database
 * @param signature - The unique transaction signature
 * @param transfer - The transfer data to store
 * @returns Object with success status and message
 */
export async function storeTransfer(signature: string, transfer: TransferData) {
    // Check if transfer with this signature already exists
    const existingTransfer = await prisma.transfer.findUnique({
        where: { signature }
    });

    if (existingTransfer) {
        return { success: false, message: "Transfer already processed", transfer: existingTransfer };
    }

    // Create new transfer
    const newTransfer = await prisma.transfer.create({
        data: {
            signature,
            fromPublicKey: transfer.fromPublicKey,
            amount: transfer.amount,
            memo: transfer.memo,
            status: transfer.status ?? "received",
            statusReason: transfer.statusReason
        },
    });

    return { success: true, message: "Transfer created", transfer: newTransfer };
}

/**
 * Get a transfer by its signature
 * @param signature - The unique transaction signature
 * @returns The transfer record or null if not found
 */
export async function getTransfer(signature: string) {
    return prisma.transfer.findUnique({ where: { signature } });
}

/**
 * Update the status of a transfer
 * @param signature - The unique transaction signature
 * @param status - The new status
 * @param statusReason - Optional reason for the status change
 * @returns The updated transfer record
 */
export async function updateTransferStatus(signature: string, status: string, statusReason?: string) {
    return prisma.transfer.update({
        where: { signature },
        data: {
            status,
            statusReason
        }
    });
}

/**
 * Get all transfers for a specific public key (as sender or receiver)
 * @param publicKey - The public key to search for
 * @returns Array of transfers
 */
export async function getTransfersByPublicKey(publicKey: string) {
    return prisma.transfer.findMany({
        where: { fromPublicKey: publicKey },
        orderBy: { createdAt: 'desc' }
    });
}

/**
 * Link a transfer to a bet
 * @param transferSignature - The transfer's signature
 * @param betSignature - The bet's signature to link
 * @returns The updated bet with transfer relation
 */
export async function linkTransferToBet(transferSignature: string, betSignature: string) {
    const transfer = await prisma.transfer.findUnique({
        where: { signature: transferSignature }
    });

    if (!transfer) {
        return { success: false, message: "Transfer not found" };
    }

    const updatedBet = await prisma.bet.update({
        where: { signature: betSignature },
        data: { transferId: transfer.id }
    });

    return { success: true, message: "Transfer linked to bet", bet: updatedBet };
}
