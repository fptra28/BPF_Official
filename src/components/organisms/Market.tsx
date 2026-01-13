import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { connectMarketSocket, MarketTick } from '@/services/marketSocket';

const LastUpdatedTime = () => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const { t } = useTranslation('market');
  
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    };
    
    updateTime();
    const timer = setInterval(updateTime, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  if (!currentTime) return null;
  
  return (
    <div className="text-center">
      <div className="inline-flex items-center bg-white px-5 py-2.5 rounded-full shadow-sm border border-gray-100">
        <div className="w-2.5 h-2.5 rounded-full bg-[#FF0000] mr-3 animate-pulse"></div>
        <span className="text-sm text-gray-600 font-medium">
          {t('lastUpdated')} <span className="text-[#080031] font-semibold">{currentTime}</span>
        </span>
      </div>
    </div>
  );
};

type Direction = 'up' | 'down' | 'neutral';

interface MarketItem {
  symbol: string;
  displayName: string;
  last: number;
  percentChange: number;
  open: number | null;
  high: number | null;
  low: number | null;
  direction?: Direction;
}

const MarketCard = ({
  item,
  index,
  showOhlc,
}: {
  item: MarketItem;
  index: number;
  showOhlc: boolean;
}) => {
  const isPositive = item.percentChange >= 0;
  const [currentTime, setCurrentTime] = useState<string>('');
  
  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }));
    
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }));
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format symbol for display (remove IDR/USD prefix if exists)
  const formatSymbol = (symbol: string) => {
    if (!symbol) return '';
    return symbol.replace(/^(IDR|USD)/, '').trim();
  };
  
  const formatPrice = (symbol: string, price: number | null | undefined): string => {
    // Handle undefined or null price
    if (price === undefined || price === null) return '-.-';
    
    try {
      if (symbol?.includes('IDR')) return `Rp${price.toLocaleString('id-ID')}`;
      if (symbol?.includes('USD')) return `$${price.toLocaleString('en-US')}`;
      return price.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } catch (error) {
      console.error('Error formatting price:', { symbol, price, error });
      return price.toString();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ 
        y: -5,
        boxShadow: '0 8px 25px rgba(0,0,0,0.08)'
      }}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-50"
    >
      {/* Card Header with Gradient */}
      <div className={`h-2 ${isPositive ? 'bg-gradient-to-r from-[#00C853]/90 to-[#4CAF50]' : 'bg-gradient-to-r from-[#FF3D00]/90 to-[#F44336]'}`}></div>
      
      {/* Card Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center mb-1">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {item.symbol.includes('IDR') ? 'IDR' : item.symbol.includes('USD') ? 'USD' : ''}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#080031] mb-1">
              {formatPrice(item.symbol, item.last)}
            </h3>
            <p className="text-sm text-gray-500">{item.displayName}</p>
          </div>
          
          {/* Status Indicator */}
          <div className={`p-2 rounded-lg ${
            isPositive ? 'bg-green-50' : 'bg-red-50'
          }`}>
            <span className={`text-sm font-semibold ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {isPositive ? '▲' : '▼'} {Math.abs(item.percentChange).toFixed(2)}%
            </span>
          </div>
        </div>
        
        {/* Mini Chart */}
        <div className="mt-4 h-12 relative">
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-100"></div>
          <div className="flex items-end h-full space-x-1">
            {[3, 6, 4, 8, 5, 9, 7, 5, 6, 4].map((h, i) => {
              const height = Math.max(4, h);
              return (
                <div 
                  key={i}
                  className={`flex-1 rounded-t-sm ${
                    isPositive 
                      ? i % 2 === 0 ? 'bg-[#4CAF50]' : 'bg-[#00C853]' 
                      : i % 2 === 0 ? 'bg-[#F44336]' : 'bg-[#FF3D00]'
                  }`}
                  style={{ 
                    height: `${(height / 10) * 100}%`,
                    opacity: 0.8 - (i * 0.08)
                  }}
                ></div>
              );
            })}
          </div>
        </div>

        {showOhlc && (
          <div className="mt-4 grid grid-cols-3 gap-3 text-[10px] uppercase tracking-[0.2em] text-gray-500">
            <div className="space-y-1">
              <p>Open</p>
              <p className="text-sm font-semibold text-gray-900">{formatPrice(item.symbol, item.open)}</p>
            </div>
            <div className="space-y-1">
              <p>Low</p>
              <p className="text-sm font-semibold text-gray-900">{formatPrice(item.symbol, item.low)}</p>
            </div>
            <div className="space-y-1">
              <p>Close</p>
              <p className="text-sm font-semibold text-gray-900">{formatPrice(item.symbol, item.last)}</p>
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {isPositive ? '▲ Naik' : '▼ Turun'} • {currentTime}
          </span>
          <div className="text-xs px-2 py-1 rounded-full bg-gray-50 text-gray-600">
            Live
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Market({ showOhlc = true }: { showOhlc?: boolean }) {
  const [marketData, setMarketData] = useState<MarketItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const prevDataRef = useRef<MarketItem[]>([]);
  const { t } = useTranslation('market');

  const ORDERED_BASES = ['XUL10', 'BCO10', 'HKK50', 'JPK50', 'AU10F', 'EU10F', 'GU10F', 'UC10F', 'UJ10F'] as const;
  const BASE_ORDER_INDEX = new Map<string, number>(ORDERED_BASES.map((b, i) => [b, i]));
  const ORDERED_BASES_SET = new Set<string>(ORDERED_BASES);
  const CANONICAL_BASE_MAP: Record<string, string> = {
    AU1010: 'AU10F',
    EU1010: 'EU10F',
    GU1010: 'GU10F',
    UC1010: 'UC10F',
    UJ1010: 'UJ10F',
    HKK5U: 'HKK50',
    JPK5U: 'JPK50',
    XULF: 'XUL10',
  };
  const SYMBOL_PREFERENCE: Record<string, RegExp> = {
    XUL10: /^XUL10_/i,
    BCO10: /^BCO10_/i,
    HKK50: /^HKK50_/i,
    JPK50: /^JPK50_/i,
    AU10F: /^AU10F_/i,
    EU10F: /^EU10F_/i,
    GU10F: /^GU10F_/i,
    UC10F: /^UC10F_/i,
    UJ10F: /^UJ10F_/i,
  };

  const SYMBOL_LABELS: Record<string, string> = {
    HKK50: 'Hanseng',
    JPK50: 'Nikkei',
    XUL10: 'Gold',
    BCO10: 'BCO',
    AU1010: 'AUD/USD',
    EU1010: 'EUR/USD',
    GU1010: 'GBP/USD',
    UC1010: 'USD/CHF',
    UJ1010: 'USD/JPY',
    AU10F: 'AUD/USD',
    EU10F: 'EUR/USD',
    GU10F: 'GBP/USD',
    UC10F: 'USD/CHF',
    UJ10F: 'USD/JPY',
  };

  const normalizeBaseSymbol = (symbol: string) => {
    if (!symbol) return '';
    const withoutPrefix = symbol.replace(/^(IDR|USD)/i, '');
    const beforeSuffix = withoutPrefix.split('_')[0] ?? '';
    return beforeSuffix.toUpperCase().trim();
  };

  const canonicalizeBaseSymbol = (baseSymbol: string) => {
    return CANONICAL_BASE_MAP[baseSymbol] ?? baseSymbol;
  };

  const canonicalizeFullSymbol = (symbol: string) => {
    if (!symbol) return '';
    const prefixMatch = symbol.match(/^(IDR|USD)/i)?.[0] ?? '';
    const rest = symbol.replace(/^(IDR|USD)/i, '');
    const base = normalizeBaseSymbol(symbol);
    const canonical = canonicalizeBaseSymbol(base);
    if (!base || base === canonical) return symbol;
    const replaced = rest.replace(new RegExp(`^${base}`, 'i'), canonical);
    return `${prefixMatch}${replaced}`;
  };

  const pickPreferredTick = (canonicalBase: string, ticks: MarketTick[]) => {
    const pattern = SYMBOL_PREFERENCE[canonicalBase];
    if (!pattern) return ticks[0] ?? null;
    const preferred = ticks.find((t) => pattern.test((t.symbol || '').replace(/^(IDR|USD)/i, '')));
    return preferred ?? ticks[0] ?? null;
  };

  useEffect(() => {
    const disconnectSocket = connectMarketSocket({
      onData: (ticks: MarketTick[]) => {
        const grouped = new Map<string, MarketTick[]>();
        for (const tick of ticks) {
          const canonicalBase = canonicalizeBaseSymbol(normalizeBaseSymbol(tick.symbol || ''));
          if (!ORDERED_BASES_SET.has(canonicalBase)) continue;
          const existing = grouped.get(canonicalBase);
          if (existing) existing.push(tick);
          else grouped.set(canonicalBase, [tick]);
        }

        const processedData: MarketItem[] = [];
        for (const canonicalBase of ORDERED_BASES) {
          const candidates = grouped.get(canonicalBase);
          if (!candidates || candidates.length === 0) continue;
          const chosen = pickPreferredTick(canonicalBase, candidates);
          if (!chosen) continue;

          const displayName = SYMBOL_LABELS[canonicalBase];
          if (!displayName) continue;
          processedData.push({
            symbol: canonicalizeFullSymbol(chosen.symbol || ''),
            displayName,
            last: Number(chosen.last) || 0,
            percentChange: Number(chosen.percentChange) || 0,
            open: chosen.open ?? null,
            high: chosen.high ?? null,
            low: chosen.low ?? null,
          });
        }

        const dataWithDirection = processedData.map((item: MarketItem) => {
          const prevItem = prevDataRef.current.find(prev => prev.symbol === item.symbol);
          let direction: Direction = 'neutral';
          
          if (prevItem) {
            if (item.last > prevItem.last) direction = 'up';
            else if (item.last < prevItem.last) direction = 'down';
          }
          
          return { ...item, direction };
        });

        dataWithDirection.sort((a, b) => {
          const ai =
            BASE_ORDER_INDEX.get(canonicalizeBaseSymbol(normalizeBaseSymbol(a.symbol))) ?? Number.MAX_SAFE_INTEGER;
          const bi =
            BASE_ORDER_INDEX.get(canonicalizeBaseSymbol(normalizeBaseSymbol(b.symbol))) ?? Number.MAX_SAFE_INTEGER;
          return ai - bi;
        });
        
        setMarketData(dataWithDirection);
        prevDataRef.current = dataWithDirection;
        setIsLoading(false);
        setIsReconnecting(false);
      },
      onError: () => {
        setIsReconnecting(true);
        if (prevDataRef.current.length === 0) {
          setIsLoading(true);
        }
      }
    });

    return () => {
      disconnectSocket();
    };
  }, [t]);

  return (
    <section className="py-16 bg-gradient-to-b from-white to-[#F8F9FF] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#FF0000]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#080031]/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#080031]/5 mb-4">
            <span className="w-2 h-2 bg-[#FF0000] rounded-full mr-2"></span>
            <span className="text-sm font-medium text-[#080031]">
              {t('marketUpdate', 'Market Update')}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#080031] mb-4">
            {t('marketTitle')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#080031] to-[#FF0000] rounded-full mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('marketSubtitle')}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 animate-pulse">
                <div className="h-6 bg-[#080031]/5 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-[#080031]/5 rounded w-1/2 mb-6"></div>
                <div className="h-3 bg-[#080031]/5 rounded w-full mb-2"></div>
                <div className="h-3 bg-[#080031]/5 rounded w-5/6 mb-6"></div>
                <div className="h-2 bg-[#080031]/5 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {marketData.map((item, index) => (
                <MarketCard key={item.symbol} item={item} index={index} showOhlc={showOhlc} />
              ))}
            </AnimatePresence>
          </div>
        )}
        
        <div className="mt-12 space-y-3">
          {isReconnecting && (
            <div className="mx-auto max-w-md">
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-gradient-to-r from-[#080031] to-[#FF0000] rounded-full animate-pulse" />
              </div>
            </div>
          )}
          <LastUpdatedTime />
        </div>
      </div>
    </section>
  );
}
