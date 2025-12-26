import prisma from "../prisma/_client";

export async function storeBet(signature: string, bet: {
    playerPublicKey: string;
    amount: number;
    choice: string;
    result: string;
    won: boolean;
    payoutSignature?: string;
}) {
    // Check if bet with this signature already exists
    const existingBet = await prisma.bet.findUnique({
        where: { signature }
    });

    if (existingBet) {
        return { success: false, message: "already processed" };
    }

    // Create new bet
    await prisma.bet.create({
        data: {
            signature,
            playerPublicKey: bet.playerPublicKey,
            amount: bet.amount,
            choice: bet.choice,
            result: bet.result,
            won: bet.won,
            payoutSignature: bet.payoutSignature
        },
    });

    return { success: true, message: "bet created" };
}

export async function getBet(signature: string) {
    return prisma.bet.findUnique({ where: { signature } });
}
