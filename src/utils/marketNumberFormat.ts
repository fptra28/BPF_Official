const SYMBOL_DECIMALS: Array<[RegExp, number]> = [
  [/^HKK50\b/i, 0],
  [/^JPK50\b/i, 0],
  [/^AU10F\b/i, 4],
  [/^EU10F\b/i, 4],
  [/^GU10F\b/i, 4],
  [/^UC10F\b/i, 4],
  [/^UJ10F\b/i, 2],
  [/^BCO10\b/i, 2],
  [/^XUL10\b/i, 2],
];

export const getMarketFractionDigits = (symbol: string): number => {
  const normalized = String(symbol || "").replace(/^(IDR|USD)/i, "").trim();
  const base = normalized.split("_")[0] ?? normalized;
  for (const [pattern, digits] of SYMBOL_DECIMALS) {
    if (pattern.test(base)) return digits;
  }
  return 2;
};

export const formatMarketNumber = (value: number, fractionDigits: number) => {
  return value.toLocaleString("en-US", {
    useGrouping: false,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
};

