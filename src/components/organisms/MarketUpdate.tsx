import React, { useEffect, useState, useCallback } from "react";
import { fetchLatestNews, NewsItem } from "@/services/newsService";
import { connectMarketSocket, MarketTick } from "@/services/marketSocket";
import { formatMarketNumber, getMarketFractionDigits } from "@/utils/marketNumberFormat";

interface MarketItem {
  symbol: string;
  last: number;
  percentChange: number;
}

interface NewsItemWithCategory extends Omit<NewsItem, 'category_id'> {
  kategori: {
    id: number;
    name: string;
    slug: string;
  };
}

export default function MarketUpdate() {
    const [marketData, setMarketData] = useState<MarketItem[]>([]);
    const [latestNews, setLatestNews] = useState<NewsItemWithCategory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>("");

    // Fungsi untuk update berita
    const updateNews = useCallback((news: NewsItem[]) => {
        const newsWithCategory = news
            .sort((a, b) => a.id - b.id) // Sort by ID in ascending order (oldest first)
            .slice(-3) // Take the 3 most recent news (last 3 items)
            .map(item => ({
                ...item,
                kategori: item.kategori || { 
                    id: 0, 
                    name: 'Berita', 
                    slug: 'berita' 
                }
            }));
        setLatestNews(newsWithCategory);
    }, []);

    // Gunakan useRef untuk menyimpan interval ID
    const intervalRef = React.useRef<{news: NodeJS.Timeout | null}>({news: null});

    const handleSocketData = useCallback((ticks: MarketTick[]) => {
        const filteredData = ticks
            .filter((item) => item?.symbol)
            .map((item): MarketItem => ({
                symbol: String(item.symbol),
                last: Number(item.last) || 0,
                percentChange: Number(item.percentChange) || 0
            }));

        setMarketData(filteredData);
        setErrorMessage("");
        setLoading(false);
    }, [updateNews]);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            await Promise.all([
                fetchLatestNews(5).then(updateNews),
            ]);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Hanya jalankan di client-side
        if (typeof window !== 'undefined') {
            fetchData();

            const disconnectSocket = connectMarketSocket({
                onData: handleSocketData,
                onError: (message) => {
                    setErrorMessage(message);
                    setLoading(false);
                }
            });

            const startNewsUpdates = () => {
                if (intervalRef.current.news) clearInterval(intervalRef.current.news);
                intervalRef.current.news = setInterval(() => {
                    fetchLatestNews(5).then(updateNews);
                }, 10 * 60 * 1000); // 10 menit
            };

            // Mulai interval dengan delay untuk menghindari race condition
            const newsTimer = setTimeout(startNewsUpdates, 5000);

            return () => {
                clearTimeout(newsTimer);
                if (intervalRef.current.news) clearInterval(intervalRef.current.news);
                disconnectSocket();
            };
        }
    }, [fetchData, handleSocketData]);

    const formatPrice = (symbol: string, price: number): string => {
        if (price === null || price === undefined) return '-';
        if (symbol.includes('IDR')) return `Rp${price.toLocaleString('en-US', { useGrouping: false, maximumFractionDigits: 0 })}`;
        if (symbol.includes('BTC')) return `$${price.toLocaleString('en-US')}`;
        if (symbol.includes('USD')) return `$${formatMarketNumber(price, 2)}`;

        return formatMarketNumber(price, getMarketFractionDigits(symbol));
    };

    const formatPercent = (percent: number): string => {
        if (percent === null || percent === undefined) return '0.00%';
        const formatted = Number(percent).toFixed(2);
        const sign = percent > 0 ? '+' : '';
        return `${sign}${formatted}%`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // Sort news by ID in descending order (newest first)
    const sortedNews = [...latestNews].sort((a, b) => b.id - a.id);

    // Combine news and market data into a single array of items to display (news first, then market data)
    const tickerItems = [
        ...sortedNews.map(news => ({
            type: 'news',
            id: `news-${news.id}`,
            content: (
                <div key={`news-${news.id}`} className="flex items-center h-full">
                    <div className="flex items-center gap-2 px-4">
                        <span className="text-[#FF0000] font-semibold">
                            {news.kategori?.name || 'Berita'}:
                        </span>
                        <span className="whitespace-nowrap">
                            {news.title}
                        </span>
                    </div>
                    <span className="mx-4 h-full text-[#9B9FA7]">|</span>
                </div>
            )
        })),
        ...marketData.map(item => ({
            type: 'market',
            id: `market-${item.symbol}`,
            content: (
                <div key={`market-${item.symbol}`} className="flex items-center h-full">
                    <div className="flex items-center gap-2 px-4">
                        <span className="font-semibold">{item.symbol}:</span>
                        <span>{formatPrice(item.symbol, item.last)}</span>
                        <span className={`font-medium ${item.percentChange > 0 ? 'text-green-400' :
                                item.percentChange < 0 ? 'text-red-400' :
                                    'text-[#9B9FA7]'
                            }`}>
                            ({formatPercent(item.percentChange)})
                        </span>
                    </div>
                    <span className="mx-4 h-full text-[#9B9FA7]">|</span>
                </div>
            )
        }))
    ];

    return (
        <div className="bg-[#080031] text-white overflow-hidden shadow group">
            <div className="flex items-center h-10">
                <div className="bg-[#FF0000] px-4 h-full flex items-center font-bold text-xs sm:text-sm md:text-base whitespace-nowrap text-white">
                    TOP NEWS
                </div>

                <div className="relative overflow-hidden w-full bg-[#080031] h-10 flex items-center min-w-0">
                    {errorMessage ? (
                        <div className="px-4 text-xs sm:text-sm md:text-base font-semibold text-white">
                            {errorMessage}
                        </div>
                    ) : loading ? (
                        <div className="px-4 text-xs sm:text-sm md:text-base font-semibold text-white">
                            Memuat data...
                        </div>
                    ) : tickerItems.length === 0 ? (
                        <div className="px-4 text-xs sm:text-sm md:text-base font-semibold text-white">
                            Tidak ada data yang tersedia
                        </div>
                    ) : (
                        <div 
                        className="relative flex whitespace-nowrap items-center text-xs sm:text-sm md:text-base h-full"
                        onMouseEnter={() => {
                            const container = document.querySelector('.marquee-container');
                            container?.classList.add('paused');
                        }}
                        onMouseLeave={() => {
                            const container = document.querySelector('.marquee-container');
                            container?.classList.remove('paused');
                        }}
                    >
                        <style jsx>{`
                            .marquee-container {
                                display: flex;
                                animation: scroll 60s linear infinite;
                            }
                            @keyframes scroll {
                                0% { transform: translateX(0); }
                                100% { transform: translateX(-50%); }
                            }
                            .marquee-container.paused {
                                animation-play-state: paused;
                            }
                            .marquee-item {
                                white-space: nowrap;
                                padding-right: 2rem;
                            }
                        `}</style>
                        <div className="marquee-container">
                            {[...tickerItems, ...tickerItems].map((item, idx) => (
                                <div key={`${item.id}-${idx}`} className="marquee-item flex items-center">
                                    {item.content}
                                </div>
                            ))}
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </div>
    );
}
