const FLIP_API_URL = `${import.meta.env.VITE_FLIP_API_URL}/flip`;

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
