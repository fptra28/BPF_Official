export interface MarketSocketItem {
  price_change: string;
  price: string;
  sell: string;
  buy: string;
  oprice: string;
  hprice: string;
  lprice: string;
  time: string;
  date_time: string;
}

export interface MarketTick {
  symbol: string;
  last: number;
  percentChange: number;
  open: number | null;
  high: number | null;
  low: number | null;
  buy: number | null;
  sell: number | null;
}

const WS_URL = 'wss://wsprc.royalassetindo.co.id';
const HIDDEN_SYMBOLS = new Set(['XAG10_BBJ', 'XAGF_BBJ']);

const toNumber = (value: unknown): number => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '');
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : 0;
};

const toNumberOrNull = (value: unknown): number | null => {
  if (value === null || value === undefined) return null;
  const cleaned = String(value).replace(/,/g, '');
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : null;
};

const computePercentChange = (item: MarketSocketItem): number => {
  const direct = toNumberOrNull(item.price_change);
  if (direct !== null) return direct;

  const price = toNumberOrNull(item.price);
  const open = toNumberOrNull(item.oprice);
  if (price === null || open === null || open === 0) return 0;

  return ((price - open) / open) * 100;
};

export const parseMarketSocketData = (raw: unknown): MarketTick[] | null => {
  if (typeof raw !== 'string') return null;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) return null;

  const entries = Object.entries(data as Record<string, MarketSocketItem>);
  if (entries.length === 0) return null;

  const ticks = entries
    .filter(([symbol, item]) => Boolean(symbol) && item && typeof item === 'object')
    .filter(([symbol]) => !HIDDEN_SYMBOLS.has(String(symbol)))
    .map(([symbol, item]) => {
      const last = toNumber(item.price) || toNumber(item.buy) || toNumber(item.sell);
      const percentChange = computePercentChange(item);
      const open = toNumberOrNull(item.oprice);
      const high = toNumberOrNull(item.hprice);
      const low = toNumberOrNull(item.lprice);
      const buy = toNumberOrNull(item.buy);
      const sell = toNumberOrNull(item.sell);
      return {
        symbol: String(symbol),
        last,
        percentChange,
        open,
        high,
        low,
        buy,
        sell
      };
    });

  return ticks.length > 0 ? ticks : null;
};

export const connectMarketSocket = (handlers: {
  onData: (data: MarketTick[]) => void;
  onError?: (message: string) => void;
  onOpen?: () => void;
}) => {
  let ws: WebSocket | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let closedByUser = false;

  const connect = () => {
    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      handlers.onOpen?.();
    };

    ws.onmessage = (event) => {
      const parsed = parseMarketSocketData(event.data);
      if (parsed) {
        handlers.onData(parsed);
      }
    };

    ws.onerror = () => {
      handlers.onError?.('');
    };

    ws.onclose = () => {
      if (closedByUser) return;
      reconnectTimer = setTimeout(connect, 3000);
    };
  };

  connect();

  return () => {
    closedByUser = true;
    if (reconnectTimer) clearTimeout(reconnectTimer);
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
      ws.close();
    }
  };
};
