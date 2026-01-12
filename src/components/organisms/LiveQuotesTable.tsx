import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { connectMarketSocket, MarketTick } from "@/services/marketSocket";

type Direction = "up" | "down" | "neutral";

interface MarketRow {
  symbol: string;
  last: number;
  percentChange: number;
  open: number | null;
  high: number | null;
  low: number | null;
  buy: number | null;
  sell: number | null;
  direction: Direction;
}

const formatSymbol = (symbol: string) => {
  if (!symbol) return "";
  return symbol.replace(/^(IDR|USD)/, "").trim();
};

const formatPrice = (symbol: string, price: number | null | undefined): string => {
  if (price === undefined || price === null) return "-.-";
  try {
    if (symbol?.includes("IDR")) return `Rp${price.toLocaleString("id-ID")}`;
    if (symbol?.includes("USD")) return `$${price.toLocaleString("en-US")}`;
    return price.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } catch {
    return String(price);
  }
};

export default function LiveQuotesTable() {
  const { t } = useTranslation("market");
  const [rows, setRows] = useState<MarketRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const prevLastRef = useRef<Map<string, number>>(new Map());
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const disconnectSocket = connectMarketSocket({
      onData: (ticks: MarketTick[]) => {
        const nextRows: MarketRow[] = ticks.map((tick) => {
          const symbol = tick.symbol || "";
          const last = Number(tick.last) || 0;
          const prevLast = prevLastRef.current.get(symbol);
          let direction: Direction = "neutral";
          if (prevLast !== undefined) {
            if (last > prevLast) direction = "up";
            else if (last < prevLast) direction = "down";
          }
          prevLastRef.current.set(symbol, last);

          return {
            symbol,
            last,
            percentChange: Number(tick.percentChange) || 0,
            open: tick.open ?? null,
            high: tick.high ?? null,
            low: tick.low ?? null,
            buy: tick.buy ?? null,
            sell: tick.sell ?? null,
            direction,
          };
        });

        nextRows.sort((a, b) => a.symbol.localeCompare(b.symbol));
        setRows(nextRows);
        setIsLoading(false);
        setIsReconnecting(false);
      },
      onError: () => {
        setIsReconnecting(true);
        if (rows.length === 0) setIsLoading(true);
      },
    });

    return () => {
      disconnectSocket();
    };
  }, [t]);

  const tableBody = useMemo(() => {
    return rows.map((row) => {
      const isPositive = row.percentChange >= 0;
      const flashClass =
        row.direction === "up"
          ? "bg-green-50"
          : row.direction === "down"
          ? "bg-red-50"
          : "bg-white";

      return (
        <tr key={row.symbol} className={`border-b border-gray-100 ${flashClass}`}>
          <td className="px-4 py-3 font-semibold text-[#080031] whitespace-nowrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase">
                {row.symbol.includes("IDR") ? "IDR" : row.symbol.includes("USD") ? "USD" : ""}
              </span>
              <span className="text-sm">{formatSymbol(row.symbol)}</span>
            </div>
          </td>
          <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{formatPrice(row.symbol, row.buy)}</td>
          <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{formatPrice(row.symbol, row.sell)}</td>
          <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{formatPrice(row.symbol, row.open)}</td>
          <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{formatPrice(row.symbol, row.high)}</td>
          <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{formatPrice(row.symbol, row.low)}</td>
          <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{formatPrice(row.symbol, row.last)}</td>
          <td className="px-4 py-3 text-sm font-semibold whitespace-nowrap">
            <span className={isPositive ? "text-green-600" : "text-red-600"}>
              {isPositive ? "▲" : "▼"} {Math.abs(row.percentChange).toFixed(2)}%
            </span>
          </td>
        </tr>
      );
    });
  }, [rows]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="text-sm text-gray-600">
          {t("tableUpdatedAt")}{" "}
          <span className="font-semibold text-[#080031]">{currentTime || "-.-"}</span>
        </div>
        <div className="flex items-center gap-3">
          {isReconnecting && (
            <div className="h-2 w-2 rounded-full bg-[#FF0000] animate-pulse" aria-label="Reconnecting" />
          )}
          <div className="text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-full w-fit">Live</div>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-xl border border-gray-100">
        <table className="min-w-[940px] w-full bg-white">
          <thead className="bg-[#F8F9FF]">
            <tr className="text-left text-xs font-bold uppercase tracking-wider text-gray-600">
              <th className="px-4 py-3">{t("tableSymbol")}</th>
              <th className="px-4 py-3">{t("tableBuy")}</th>
              <th className="px-4 py-3">{t("tableSell")}</th>
              <th className="px-4 py-3">{t("tableOpen")}</th>
              <th className="px-4 py-3">{t("tableHigh")}</th>
              <th className="px-4 py-3">{t("tableLow")}</th>
              <th className="px-4 py-3">{t("tableClose")}</th>
              <th className="px-4 py-3">{t("tableChange")}</th>
            </tr>
          </thead>
          <tbody>{tableBody}</tbody>
        </table>
      </div>
    </div>
  );
}
