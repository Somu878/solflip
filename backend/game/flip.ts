import crypto from "crypto";

export enum Side {
    Heads = "heads",
    Tails = "tails",
}

export function flipCoin(userSide: Side): {
    result: Side;
    win: boolean;
} {
    const random = crypto.randomInt(0, 2);
    const result: Side = random === 0 ? Side.Heads : Side.Tails;

    return {
        result,
        win: result === userSide,
    };
}
