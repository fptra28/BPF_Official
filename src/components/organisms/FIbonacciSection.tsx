import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

// Definisikan tipe untuk hasil perhitungan
interface Result {
    [key: string]: number;
}

// Komponen kalkulator tunggal yang bisa digunakan kembali
const CalculatorSection = ({ trend }: { trend: 'Uptrend' | 'Downtrend' }) => {
    const { t } = useTranslation('pivot-fibonacci');
    const [priceA, setPriceA] = useState(""); // Low untuk Uptrend, High untuk Downtrend
    const [priceB, setPriceB] = useState(""); // High untuk Uptrend, Low untuk Downtrend
    const [results, setResults] = useState<{ retracement: Result; projection: Result }>({ retracement: {}, projection: {} });

    const retracementLevels = [23.6, 38.2, 50.0, 61.8, 78.6];
    const projectionLevels = [
        { level: 138.2, factor: 0.382 }, { level: 150.0, factor: 0.5 },
        { level: 161.8, factor: 0.618 }, { level: 200.0, factor: 1.0 },
        { level: 238.2, factor: 1.382 }, { level: 261.8, factor: 1.618 },
    ];

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setter(value);
        }
    };

    const handleCalculate = () => {
        const pA = parseFloat(priceA);
        const pB = parseFloat(priceB);
        
        if (!isNaN(pA) && !isNaN(pB)) {
            const high = Math.max(pA, pB);
            const low = Math.min(pA, pB);
            const diff = high - low;

            const newRetracement: Result = {};
            const newProjection: Result = {};

            if (trend === "Uptrend") {
                retracementLevels.forEach(level => { newRetracement[level] = high - diff * (level / 100); });
                projectionLevels.forEach(({ level, factor }) => { newProjection[level] = high + diff * factor; });
            } else { // Downtrend
                retracementLevels.forEach(level => { newRetracement[level] = low + diff * (level / 100); });
                projectionLevels.forEach(({ level, factor }) => { newProjection[level] = low - diff * factor; });
            }
            setResults(prev => ({
                retracement: { ...prev.retracement, ...newRetracement },
                projection: { ...prev.projection, ...newProjection }
            }));
        } else {
            alert(t('fibonacci.fillAllFields', 'Mohon masukkan angka yang valid untuk kedua harga.'));
        }
    };

    const formatNumber = (num: number | undefined) => num !== undefined ? num.toFixed(2) : "0.00";
    const isUptrend = trend === 'Uptrend';

    return (
        <div className={`bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-300 h-full`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-600">
                        {isUptrend ? t('fibonacci.low', 'Low') : t('fibonacci.high', 'High')}
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={priceA}
                            onChange={(e) => handleInputChange(setPriceA, e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-[#FF0000] transition-all duration-200"
                            placeholder={isUptrend ? t('fibonacci.low', 'Low') : t('fibonacci.high', 'High')}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-gray-400">$</span>
                        </div>
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-600">
                        {isUptrend ? t('fibonacci.high', 'High') : t('fibonacci.low', 'Low')}
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={priceB}
                            onChange={(e) => handleInputChange(setPriceB, e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF0000] focus:border-[#FF0000] transition-all duration-200"
                            placeholder={isUptrend ? t('fibonacci.high', 'High') : t('fibonacci.low', 'Low')}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-gray-400">$</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button
                    onClick={handleCalculate}
                    className={`px-6 py-3 bg-[#080031] hover:bg-[#000033] focus:ring-[#080031] text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md hover:shadow-lg flex-1 flex items-center justify-center transition-colors`}
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    {t('fibonacci.calculate', 'Hitung')}
                </button>
                <button
                    onClick={() => {
                        setPriceA("");
                        setPriceB("");
                        setResults({ retracement: {}, projection: {} });
                    }}
                    className="px-6 py-3 bg-white border-2 border-[#080031] text-[#080031] font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#080031] focus:ring-offset-2 flex items-center justify-center transition-colors hover:bg-gray-100"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {t('pivot.reset', 'Reset')}
                </button>
            </div>

            {results && (
                <div className="mt-6">
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-semibold text-[#4C4C4C] mb-4">{t(`fibonacci.${trend}`, trend)}</h3>
                        <h4 className="text-lg font-semibold text-gray-800">{t('fibonacci.retracementLevels', 'Tingkat Retracement')}</h4>
                        <div className={`w-24 h-1 ${isUptrend ? 'bg-[#FF0000]' : 'bg-[#080031]'} mx-auto mt-2 rounded-full`}></div>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden mb-8">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-[#080031] text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                        {t('fibonacci.level', 'Level')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider text-right">
                                        {t('fibonacci.price', 'Harga')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {retracementLevels.map(level => (
                                    <tr key={`retrace-${level}`} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-3 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <span className="w-2 h-2 rounded-full mr-2 bg-[#4C4C4C]"></span>
                                                <span className="text-sm font-medium text-gray-800">{level}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm font-mono text-gray-700 text-right">
                                            {formatNumber(results.retracement[level])}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="text-center mb-6">
                        <h4 className="text-lg font-semibold text-gray-800">{t('fibonacci.projectionLevels', 'Tingkat Proyeksi')}</h4>
                        <div className={`w-24 h-1 ${isUptrend ? 'bg-[#FF0000]' : 'bg-[#080031]'} mx-auto mt-2 rounded-full`}></div>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-[#080031] text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                        {t('fibonacci.level', 'Level')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider text-right">
                                        {t('fibonacci.price', 'Harga')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {projectionLevels.map(({ level }) => (
                                    <tr key={`projection-${level}`} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-3 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <span className="w-2 h-2 rounded-full mr-2 bg-[#4C4C4C]"></span>
                                                <span className="text-sm font-medium text-gray-800">{level}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm font-mono text-gray-700 text-right">
                                            {formatNumber(results.projection[level])}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default function FibonacciSection() {
    const { t } = useTranslation('pivot-fibonacci');
    
    return (
        <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-[#080031]">{t('fibonacci.title', 'Kalkulator Fibonacci')}</h2>
                <p className="mt-2 text-lg text-gray-700">
                    {t('fibonacci.subtitle', 'Hitung level retracement dan proyeksi Fibonacci untuk analisis teknis Anda')}
                </p>
                <div className="w-24 h-1 bg-[#FF0000] mx-auto mt-4 rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
                <div className="transform transition-all duration-300 hover:-translate-y-1">
                    <CalculatorSection trend="Uptrend" />
                </div>
                <div className="transform transition-all duration-300 hover:-translate-y-1">
                    <CalculatorSection trend="Downtrend" />
                </div>
            </div>
        </div>
    );
}
