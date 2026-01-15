export type EconomicImpactLevel = 1 | 2 | 3;

export const getEconomicImpactLevel = (impact: unknown): EconomicImpactLevel | null => {
  const raw = String(impact ?? '').trim();
  if (!raw) return null;

  // Common API format: ?, ??, ???
  const questionMarks = (raw.match(/\?/g) || []).length;
  if (questionMarks > 0) return Math.min(3, questionMarks) as EconomicImpactLevel;

  // Sometimes impact can be "★", "★★", etc.
  const stars = (raw.match(/\u2605/g) || []).length;
  if (stars > 0) return Math.min(3, stars) as EconomicImpactLevel;

  // Numeric strings like "1", "2", "3"
  const digit = raw.match(/\b([1-3])\b/);
  if (digit) return Number(digit[1]) as EconomicImpactLevel;

  // Text variants like "High", "High Impact", etc.
  const normalized = raw.toLowerCase();
  if (/\bhigh\b/.test(normalized)) return 3;
  if (/\bmedium\b/.test(normalized) || /\bmed\b/.test(normalized)) return 2;
  if (/\blow\b/.test(normalized)) return 1;

  return 1;
};

export const getEconomicImpactLabel = (level: EconomicImpactLevel | null) => {
  if (!level) return '-';
  if (level === 3) return 'High';
  if (level === 2) return 'Medium';
  return 'Low';
};

