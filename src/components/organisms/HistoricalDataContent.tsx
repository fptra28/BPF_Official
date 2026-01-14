import { useState, useEffect } from "react";
import { useTranslation } from 'next-i18next';
import { getHistoricalData, type HistoricalDataItem, type SymbolData, type HistoricalDataResponse } from '@/services/historicalDataService';
import { FiFilter, FiDownload } from 'react-icons/fi';
import Image from "next/image";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface HistoricalData extends Omit<HistoricalDataItem, 'open' | 'high' | 'low' | 'close'> {
    open: string;
    high: string;
    low: string;
    close: string;
    category: string;
    date: string;
    tanggal?: string;
}

const isHiddenInstrument = (instrument: string): boolean => {
    const key = (instrument || '').trim().toUpperCase();
    return key === 'LSI' || key === 'LSI DAILY';
};

const loadImageAsDataUrl = async (src: string): Promise<string> => {
    const response = await fetch(src);
    if (!response.ok) {
        throw new Error(`Failed to load image: ${src}`);
    }
    const blob = await response.blob();
    return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error(`Failed to read image: ${src}`));
        reader.readAsDataURL(blob);
    });
};

const renderPdfWatermark = async (doc: jsPDF) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const imgData = await loadImageAsDataUrl('/assets/bpf-logo.png');
    const anyDoc = doc as any;

    if (typeof anyDoc.GState === 'function' && typeof anyDoc.setGState === 'function') {
        anyDoc.setGState(new anyDoc.GState({ opacity: 0.08 }));
    }

    const imgSize = Math.min(pageWidth, pageHeight) * 0.72;
    doc.addImage(
        imgData,
        'PNG',
        (pageWidth - imgSize) / 2,
        (pageHeight - imgSize) / 2,
        imgSize,
        imgSize
    );

    if (typeof anyDoc.GState === 'function' && typeof anyDoc.setGState === 'function') {
        anyDoc.setGState(new anyDoc.GState({ opacity: 1 }));
    }
};

/**
 * Parses a date string in format 'DD MMM YYYY' or 'YYYY-MM-DD' to a Date object
 */
const normalizeDateKey = (dateString: string): string | null => {
    if (!dateString) return null;

    // 'YYYY-MM-DD' (or 'YYYY-M-D') format
    const isoMatch = dateString.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:$|T)/);
    if (isoMatch) {
        const year = isoMatch[1];
        const month = isoMatch[2].padStart(2, '0');
        const day = isoMatch[3].padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // 'DD MMM YYYY' format (e.g., '30 Sep 2025')
    const dateParts = dateString.match(/^(\d{1,2})\s(\w{3})\s(\d{4})$/);
    if (dateParts) {
        const months: Record<string, number> = {
            Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
            Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12
        };

        const day = dateParts[1].padStart(2, '0');
        const monthNumber = months[dateParts[2]];
        const year = dateParts[3];

        if (!monthNumber) {
            console.error('Invalid date format:', dateString);
            return null;
        }

        return `${year}-${String(monthNumber).padStart(2, '0')}-${day}`;
    }

    return null;
};

const parseDateUtc = (dateString: string): Date | null => {
    if (!dateString) return null;
    const normalized = normalizeDateKey(dateString);
    if (!normalized) {
        console.error('Unsupported date format:', dateString);
        return null;
    }

    const match = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return null;

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null;
    return new Date(Date.UTC(year, month - 1, day));
};

/**
 * Formats a date string to 'DD MMM YYYY' format in Asia/Jakarta timezone
 */
const formatDate = (dateString: string): string => {
    const date = parseDateUtc(dateString);
    if (!date) return dateString;
    
    try {
        const options: Intl.DateTimeFormatOptions = { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric',
            timeZone: 'Asia/Jakarta'
        };
        
        return date.toLocaleDateString('en-GB', options);
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
};

// Convert API data to the format expected by the component
const transformData = (apiData: SymbolData[]): HistoricalData[] => {
    return apiData.flatMap(symbolData => 
        symbolData.data.map(item => ({
            ...item,
            // Show values as-is from API (no rounding/padding)
            open: item.open?.toString() || '',
            high: item.high?.toString() || '',
            low: item.low?.toString() || '',
            close: item.close?.toString() || '',
            category: symbolData.symbol,
            date: item.date,
            tanggal: item.date
        }))
    );
};

const HistoricalDataContent = () => {
    const { t } = useTranslation('historical-data');
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [dataHistorical, setDataHistorical] = useState<HistoricalData[]>([]);
    const [apiData, setApiData] = useState<SymbolData[]>([]);
    const [filteredData, setFilteredData] = useState<HistoricalData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedInstrument, setSelectedInstrument] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 8;
    
    const [instruments, setInstruments] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await getHistoricalData();
                setApiData(response.data);
                
                // Transform API data to match the expected format
                const transformedData = transformData(response.data).filter((item) => !isHiddenInstrument(item.category));
                
                // Sort data by date (newest first)
                const sortedData = [...transformedData].sort((a, b) => {
                    const timeA = parseDateUtc(a.date)?.getTime() ?? 0;
                    const timeB = parseDateUtc(b.date)?.getTime() ?? 0;
                    return timeB - timeA;
                });
                
                // Define the instrument order
                const instrumentOrder = [
                    'LGD Daily',
                    'BCO Daily',
                    'HSI Daily',
                    'SNI Daily',
                    'USD/CHF',
                    'USD/JPY',
                    'GBP/USD',
                    'AUD/USD',
                    'EUR/USD'
                ];
                
                // Get unique instruments from the API response
                const uniqueInstruments = Array.from(new Set(response.data.map(item => item.symbol))).filter(
                    (symbol) => !isHiddenInstrument(symbol)
                );
                
                // Sort the instruments based on the defined order
                const sortedInstruments = uniqueInstruments.sort((a, b) => {
                    const indexA = instrumentOrder.indexOf(a);
                    const indexB = instrumentOrder.indexOf(b);
                    
                    // If both are in the order list, sort them according to the list
                    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                    // If only a is in the list, it comes first
                    if (indexA !== -1) return -1;
                    // If only b is in the list, it comes first
                    if (indexB !== -1) return 1;
                    // If neither is in the list, sort alphabetically
                    return a.localeCompare(b);
                });
                
                setInstruments(sortedInstruments);
                
                // Determine default instrument (prefer 'LGD Daily' if available)
                const defaultInstrument = sortedInstruments.includes('LGD Daily')
                    ? 'LGD Daily'
                    : (sortedInstruments[0] || '');

                // Set selected instrument and filter data accordingly
                if (defaultInstrument) {
                    setSelectedInstrument(defaultInstrument);
                }

                setDataHistorical(sortedData);
                setFilteredData(
                    defaultInstrument
                        ? sortedData.filter(item => item.category === defaultInstrument)
                        : sortedData
                );
                setError(null);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Gagal memuat data. Silakan coba lagi nanti.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
        // Apply filters when any filter changes
        if (dataHistorical.length > 0) {
            applyFilters();
        }
    }, [selectedInstrument, fromDate, toDate, dataHistorical]);

    const applyFilters = () => {
        try {
            let result = [...dataHistorical];
            
            // Filter by instrument
            if (selectedInstrument && selectedInstrument.trim() !== '') {
                result = result.filter(item => 
                    item.category === selectedInstrument
                );
            }
            
            // Filter by date range
            if (fromDate) {
                const startKey = normalizeDateKey(fromDate);
                result = result.filter(item => {
                    const itemKey = normalizeDateKey(item.date);
                    if (!startKey || !itemKey) return true;
                    return itemKey >= startKey;
                });
            }
            
            if (toDate) {
                const endKey = normalizeDateKey(toDate);
                result = result.filter(item => {
                    const itemKey = normalizeDateKey(item.date);
                    if (!endKey || !itemKey) return true;
                    return itemKey <= endKey;
                });
            }
            
            setFilteredData(result);
            // Reset to first page after filtering
            setCurrentPage(1);
        } catch (error) {
            console.error('Error in applyFilters:', error);
            setError('Terjadi kesalahan saat memproses filter.');
        }
    };

    const resetFilters = () => {
        setFromDate('');
        setToDate('');
        // Default back to LGD Daily or first instrument
        const defaultInstrument = instruments.includes('LGD Daily') ? 'LGD Daily' : (instruments[0] || '');
        setSelectedInstrument(defaultInstrument);
        setFilteredData(
            defaultInstrument
                ? dataHistorical.filter(item => item.category === defaultInstrument)
                : [...dataHistorical]
        );
        setCurrentPage(1);
    };

    const handleDownload = (filtered = false) => {
        try {
            const dataToDownload = filtered ? [...filteredData] : [...dataHistorical].slice(-30);
            if (dataToDownload.length === 0) {
                throw new Error('Tidak ada data yang tersedia untuk diunduh');
            }
            
            // Create CSV header and rows
            const headerColumns = [
                t('table.date'),
                t('table.symbol'),
                t('table.open'),
                t('table.high'),
                t('table.low'),
                t('table.close')
            ];
            const header = `${headerColumns.join(',')}\n`;
            
            const rows = dataToDownload.map((row: HistoricalData) => {
                // Format values, handling null/undefined
                const formatValue = (value: any) => value !== null && value !== undefined ? value : '';
                
                const baseRow = [
                    formatDate(row.date),
                    `"${row.symbol}"`,
                    formatValue(row.open),
                    formatValue(row.high),
                    formatValue(row.low),
                    formatValue(row.close),
                ];

                return baseRow.join(',');
            }).join('\n');

            const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `historical-data-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error downloading data:', err);
            setError('Gagal mengunduh data. ' + (err instanceof Error ? err.message : ''));
        }
    };

    const handleDownloadPdf = async () => {
        try {
            // PDF download is per current page (matches UI pagination)
            const dataToDownload = [...currentItems];
            if (dataToDownload.length === 0) {
                throw new Error('Tidak ada data yang tersedia untuk diunduh');
            }

            const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            doc.setTextColor(8, 0, 49);
            doc.setFontSize(16);
            doc.text('Data Historis', pageWidth / 2, 44, { align: 'center' });

            doc.setFontSize(10);
            doc.setTextColor(60, 60, 60);
            doc.text(`Instrument: ${selectedInstrument || '-'}`, 40, 64);
            if (fromDate || toDate) {
                doc.text(`Periode: ${fromDate || '-'} s/d ${toDate || '-'}`, 40, 80);
            }
            doc.text(`Halaman: ${currentPage} / ${totalPages || 1}`, pageWidth - 40, 64, { align: 'right' });

            const head = [['Date', 'Open', 'High', 'Low', 'Close']];
            const body = dataToDownload.map((row) => [
                formatDate(row.date),
                row.open,
                row.high,
                row.low,
                row.close,
            ]);

            autoTable(doc, {
                head,
                body,
                startY: fromDate || toDate ? 96 : 80,
                styles: { fontSize: 9, cellPadding: 6 },
                headStyles: { fillColor: [8, 0, 49], textColor: 255 },
                alternateRowStyles: { fillColor: [245, 245, 245] },
                margin: { left: 40, right: 40 },
            });

            // Watermark overlay (best-effort) so it stays visible like the UI watermark.
            try {
                await renderPdfWatermark(doc);
            } catch (e) {
                console.warn('Failed to render PDF watermark:', e);
            }

            const fileDate = new Date().toISOString().split('T')[0];
            const safeInstrument = (selectedInstrument || 'all').replace(/[^\w\-]+/g, '-');
            doc.save(`historical-data-${safeInstrument}-page-${currentPage}-${fileDate}.pdf`);
        } catch (err) {
            console.error('Error downloading PDF:', err);
            setError('Gagal mengunduh PDF. ' + (err instanceof Error ? err.message : ''));
        }
    };

    // Hitung total halaman
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    
    // Ambil data untuk halaman saat ini
    const currentItems = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Fungsi untuk navigasi halaman
    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="space-y-4 px-1 py-2 md:p-4">
            {/* Filter Section */}
            <div className="flex flex-col md:flex-row gap-2 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="flex flex-1 flex-col md:flex-row gap-2">
                    {/* Instrument Selector */}
                    <div className="w-full md:w-auto">
                        <select
                            id="instrument"
                            value={selectedInstrument}
                            onChange={(e) => setSelectedInstrument(e.target.value)}
                            className="w-full text-xs md:text-sm px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-[#FF0000]"
                        >
                            {instruments.map((instrument: string) => (
                                <option key={instrument} value={instrument}>
                                    {instrument}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date Range */}
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <input
                            type="date"
                            id="from"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="text-xs md:text-sm px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-[#FF0000] w-full md:w-36"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                            type="date"
                            id="to"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="text-xs md:text-sm px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-[#FF0000] w-full md:w-36"
                        />
                    </div>

                    {/* Apply & Reset Buttons */}
                    <div className="flex gap-2 w-full md:w-auto">
                        <button
                            onClick={applyFilters}
                            disabled={isLoading}
                            className="flex-1 md:flex-none px-3 py-1.5 bg-[#FF0000] text-white rounded-md hover:bg-[#E60000] transition-colors text-xs md:text-sm whitespace-nowrap flex items-center justify-center gap-1.5"
                        >
                            <FiFilter className="w-3.5 h-3.5" />
                            <span className="truncate">Apply</span>
                        </button>
                        <button
                            onClick={resetFilters}
                            disabled={isLoading || (!fromDate && !toDate && !selectedInstrument)}
                            className="flex-1 md:flex-none px-3 py-1.5 bg-[#FF0000] text-white rounded-md hover:bg-[#E60000] transition-colors text-xs md:text-sm whitespace-nowrap flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="truncate">Reset</span>
                        </button>
                    </div>
                </div>
                
                {/* Download Button */}
                <div className="flex justify-end">
                    <div className="flex gap-2 w-full md:w-auto">
                        <button
                            onClick={() => handleDownloadPdf()}
                            disabled={isLoading || filteredData.length === 0}
                            className="flex-1 md:flex-none px-3 py-1.5 bg-[#FF0000] text-white rounded-md hover:bg-[#E60000] transition-colors text-xs md:text-sm whitespace-nowrap flex items-center gap-1.5 justify-center"
                        >
                            <FiDownload className="w-3.5 h-3.5" />
                            Download PDF (Page)
                        </button>
                        <button
                            onClick={() => handleDownload(true)}
                            disabled={isLoading || filteredData.length === 0}
                            className="flex-1 md:flex-none px-3 py-1.5 bg-[#FF0000] text-white rounded-md hover:bg-[#E60000] transition-colors text-xs md:text-sm whitespace-nowrap flex items-center gap-1.5 justify-center"
                        >
                            <FiDownload className="w-3.5 h-3.5" />
                            Download CSV
                        </button>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 text-sm text-red-600 bg-red-50 rounded-md">
                    {error}
                </div>
            )}

            {/* Loading State */}
            {isLoading ? (
                <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F2AC59]"></div>
                </div>
            ) : (
                /* Data Table */
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
                    {/* Watermark (overlay) */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-20">
                        <Image
                            src="/assets/bpf-logo.png"
                            alt="BPF watermark"
                            width={420}
                            height={420}
                            className="opacity-[0.12] select-none"
                            priority={false}
                        />
                    </div>

                    <div className="overflow-x-auto relative z-10">
                        <table className="min-w-full divide-y divide-[#E5E7EB]">
                            <thead className="bg-[#080031]">
                                <tr>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Open
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        High
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Low
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Close
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-[#E5E7EB]">
                                {currentItems.map((item, index) => (
                                    <tr key={`${item.id}-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                                            {formatDate(item.date)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                                            {item.open}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                                            {item.high}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                                            {item.low}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                                            {item.close}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {filteredData.length > itemsPerPage && (
                        <div className="flex items-center justify-between px-2 py-3 bg-white border-t border-[#E5E7EB] sm:px-6">
                            {/* Mobile Pagination */}
                            <div className="w-full sm:hidden">
                                <div className="flex justify-between items-center">
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-[#080031] hover:bg-gray-100'}`}
                                    >
                                        &larr; Previous
                                    </button>
                                    
                                    <div className="text-sm text-[#4C4C4C]">
                                        Page {currentPage} of {totalPages}
                                    </div>
                                    
                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'text-[#9B9FA7] cursor-not-allowed' : 'text-[#4C4C4C] hover:bg-[#F5F5F5]'}`}
                                    >
                                        Next &rarr;
                                    </button>
                                </div>
                            </div>
                            
                            {/* Desktop Pagination */}
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-[#4C4C4C]">
                                        Showing <span className="font-medium">
                                            {(currentPage - 1) * itemsPerPage + 1}
                                        </span> to <span className="font-medium">
                                            {Math.min(currentPage * itemsPerPage, filteredData.length)}
                                        </span> of <span className="font-medium">
                                            {filteredData.length}
                                        </span> results
                                    </p>
                                </div>
                                
                                <div>
                                    <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                        <button
                                            onClick={() => paginate(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-[#080031] bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="sr-only">Previous</span>
                                            &larr;
                                        </button>
                                        
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }
                                            
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => paginate(pageNum)}
                                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                                                        currentPage === pageNum
                                                            ? 'z-10 bg-[#FF0000] border-[#FF0000] text-white'
                                                            : 'bg-white border-gray-300 text-[#080031] hover:bg-gray-50'
                                                    } border`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                        
                                        <button
                                            onClick={() => paginate(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-[#080031] bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="sr-only">Next</span>
                                            &rarr;
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            
            {/* No Data Message */}
            {!isLoading && filteredData.length === 0 && (
                <div className="text-center py-8">No data available</div>
            )}
        </div>
    );
};

export default HistoricalDataContent;
