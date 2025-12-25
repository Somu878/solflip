const bets = new Map<string, any>();

export function storeBet(signature: string, bet: any) {
    bets.set(signature, { ...bet, settled: false });
}

export function getBet(signature: string) {
    return bets.get(signature);
}

export function markSettled(signature: string) {
    const bet = bets.get(signature);
    if (bet) bet.settled = true;
}
