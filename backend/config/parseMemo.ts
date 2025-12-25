export function parseMemo(memo: string) {
    const parts = memo.split("-");
    if (parts.length !== 4) return null;

    const [tag, side, amount, userId] = parts;
    if (tag !== "flip") return null;
    if (![Side.Heads, Side.Tails].includes(side as Side)) return null;

    return {
        side,
        amount: Number(amount),
        userId,
    };
}


enum Side {
    Heads = "heads",
    Tails = "tails",
}