const API_URL = 'https://portalnews.newsmaker.id/api/v1/pivot-history';
const API_TOKEN = 'BPF-91e516ac4fe2e8ae';

// Interface for the data item in the API response
export interface HistoricalDataItem {
  id: number;
  symbol: string;
  date: string;
  event: string | null;
  open: number | string;
  high: number | string;
  low: number | string;
  close: number | string;
  change: string | null;
  volume: number | null;
  openInterest: number | null;
  createdAt: string;
  updatedAt: string;
}

// Interface for the symbol data in the API response
export interface SymbolData {
  symbol: string;
  data: HistoricalDataItem[];
  updatedAt: string;
}

// Interface for the API response
export interface HistoricalDataResponse {
  status: string;
  totalSymbols: number;
  data: SymbolData[];
}

type UnknownRecord = Record<string, unknown>;

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
};

const toNullableNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null;
  const n = toNumber(value, Number.NaN);
  return Number.isFinite(n) ? n : null;
};

const toStringOrEmpty = (value: unknown): string => (typeof value === 'string' ? value : '');

const toNumberOrString = (value: unknown): number | string => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') return value;
  const numeric = toNumber(value, Number.NaN);
  return Number.isFinite(numeric) ? numeric : '';
};

const normalizeHistoricalResponse = (payload: unknown): HistoricalDataResponse => {
  const raw = payload as UnknownRecord;
  const container = (raw && typeof raw === 'object' && 'data' in raw) ? (raw.data as unknown) : payload;

  // Case A: API already returns the same shape we expect.
  if (
    container &&
    typeof container === 'object' &&
    !Array.isArray(container) &&
    'status' in (container as UnknownRecord) &&
    'data' in (container as UnknownRecord)
  ) {
    return container as HistoricalDataResponse;
  }

  // Case B: API returns a flat array of rows -> group by symbol.
  const rows = Array.isArray(container) ? (container as UnknownRecord[]) : [];
  const bySymbol = new Map<string, HistoricalDataItem[]>();

  for (const row of rows) {
    const symbol =
      toStringOrEmpty(row.symbol) ||
      toStringOrEmpty(row.category) ||
      toStringOrEmpty(row.instrument) ||
      'UNKNOWN';

    const item: HistoricalDataItem = {
      id: toNumber(row.id, 0),
      symbol,
      date: toStringOrEmpty(row.date) || toStringOrEmpty(row.tanggal) || toStringOrEmpty(row.created_at) || '',
      event: (typeof row.event === 'string' ? row.event : null),
      // Preserve raw API formatting when provided as string (e.g. trailing zeros)
      open: toNumberOrString(row.open),
      high: toNumberOrString(row.high),
      low: toNumberOrString(row.low),
      close: toNumberOrString(row.close),
      change: (typeof row.change === 'string' ? row.change : null),
      volume: toNullableNumber(row.volume),
      openInterest: toNullableNumber(row.openInterest ?? row.open_interest),
      createdAt: toStringOrEmpty(row.createdAt ?? row.created_at),
      updatedAt: toStringOrEmpty(row.updatedAt ?? row.updated_at),
    };

    if (!bySymbol.has(symbol)) bySymbol.set(symbol, []);
    bySymbol.get(symbol)!.push(item);
  }

  const data: SymbolData[] = Array.from(bySymbol.entries()).map(([symbol, items]) => {
    const updatedAt =
      items
        .map((i) => i.updatedAt || i.createdAt)
        .filter(Boolean)
        .sort()
        .at(-1) || '';
    return { symbol, data: items, updatedAt };
  });

  return {
    status: 'ok',
    totalSymbols: data.length,
    data,
  };
};

// Format date to YYYY-MM-DD for the API
export const getThreeMonthsAgoDate = (): string => {
  const date = new Date();
  date.setMonth(date.getMonth() - 3);
  // Set to the first day of the month
  date.setDate(1);
  return date.toISOString().split('T')[0];
};

export const getHistoricalData = async (): Promise<HistoricalDataResponse> => {
  try {
    const dateFrom = getThreeMonthsAgoDate();
    const url = new URL(API_URL);
    url.searchParams.set('dateFrom', dateFrom);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const payload = await response.json();
    return normalizeHistoricalResponse(payload);
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
};
