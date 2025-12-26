const API_BASE_URL = import.meta.env.VITE_FLIP_API_URL;
const FLIP_API_URL = `${API_BASE_URL}/flip`;
const BETS_API_URL = `${API_BASE_URL}/bets`;

export interface FlipRequest {
  signature: string;
  userId: string;
  side: "heads" | "tails";
  amount: number;
}

export interface FlipResponse {
  result: "heads" | "tails";
  win: boolean;
  winTxSignature?: string;
}

export interface Bet {
  id: number;
  signature: string;
  playerPublicKey: string;
  amount: number;
  choice: string;
  result: string;
  won: boolean;
  payoutSignature: string | null;
  createdAt: string;
}

export async function submitFlip(request: FlipRequest): Promise<FlipResponse> {
  const response = await fetch(FLIP_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Flip API error: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchBets(): Promise<Bet[]> {
  const response = await fetch(BETS_API_URL);

  if (!response.ok) {
    throw new Error(`Bets API error: ${response.statusText}`);
  }

  return response.json();
}
