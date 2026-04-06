import { config } from "../config.js";

export interface AlturaHolderResponse {
  twitterUsername: string;
  walletAddress: string;
  holder: {
    address: string;
    totalBalance: string;
    totalBalanceFormatted: string;
    chains: Record<
      string,
      {
        balance: string;
        balanceFormatted: string;
        avgPricePerShare?: string;
        avgPricePerShareFormatted?: string;
      }
    >;
    portfolioValue: string;
    costAnalysis: {
      overall: {
        avgPricePerShareFormatted: string;
        costBasis: string;
        currentValue: string;
        unrealizedPnL: string;
      };
    };
  };
}

export interface AlturaHolderError {
  error: string;
}

export interface AlturaSummary {
  isHolder: boolean;
  totalDepositedUSD: number;
  currentValueUSD: number;
  pnlUSD: number;
  pnlPercent: number;
  walletAddress: string;
}

export async function fetchAlturaHolder(
  username: string,
): Promise<AlturaSummary | null> {
  const cleaned = username.replace(/^@/, "").trim();
  if (!cleaned) return null;

  const url = `${config.altura.apiUrl}/api/holder/x/${encodeURIComponent(cleaned)}`;
  const res = await fetch(url, {
    headers: { "x-api-key": config.altura.apiKey },
  });

  if (!res.ok) {
    // 404 / "No Privy user found" → not a holder, not an error
    if (res.status === 404 || res.status === 400) return null;
    const body = await res.text().catch(() => "");
    if (body.includes("No Privy user found")) return null;
    throw new Error(`Altura API error ${res.status}: ${body}`);
  }

  const data = (await res.json()) as AlturaHolderResponse | AlturaHolderError;
  if ("error" in data) return null;

  const costBasis = Number(data.holder.costAnalysis.overall.costBasis);
  const currentValue = Number(data.holder.costAnalysis.overall.currentValue);
  const pnl = currentValue - costBasis;
  const pnlPct = costBasis > 0 ? (pnl / costBasis) * 100 : 0;

  return {
    isHolder: true,
    totalDepositedUSD: costBasis,
    currentValueUSD: currentValue,
    pnlUSD: pnl,
    pnlPercent: pnlPct,
    walletAddress: data.walletAddress,
  };
}
