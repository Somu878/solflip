-- CreateTable
CREATE TABLE "Bet" (
    "id" SERIAL NOT NULL,
    "signature" TEXT NOT NULL,
    "playerPublicKey" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "choice" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "won" BOOLEAN NOT NULL,
    "payoutSignature" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bet_signature_key" ON "Bet"("signature");
