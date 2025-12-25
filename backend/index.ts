import express from "express";
import cors from "cors";

import { fetchTx } from "./solana/fetchTx";
import { ESCROW_PUBKEY } from "./config/wallet";
import { ManageFlip } from "./game/flipManager";
import { Side } from "./game/flip";


const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());



app.post("/flip", async (req, res) => {
    const { signature, userId, side, amount } = req.body;
    // userId should be the user's public key as a string
    const data = await ManageFlip(side as Side, signature, userId, amount);
    res.json(data);
})


app.listen(3000, () => {
    console.log("Server started on port 3000");
});