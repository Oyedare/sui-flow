export function getDecimals(coinType: string) {
  if (coinType.includes("::sui::SUI")) return 9;
  if (coinType.includes("::wusdc::WUSDC") || coinType.includes("::usdc::USDC")) return 6;
  return 9; // default fallback
}

export function getSymbol(coinType: string) {
  if (coinType.includes("::sui::SUI")) return "SUI";
  if (coinType.includes("::wusdc::WUSDC")) return "USDC";
  return coinType.split("::").pop() || "UNK";
}

export function formatBalance(amount: string | number, decimals: number) {
  const val = typeof amount === 'string' ? parseInt(amount) : amount;
  return val / Math.pow(10, decimals);
}

export function formatAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
