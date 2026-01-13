import React, { useState, useEffect } from 'react';
import ProfilContainer from "@/components/templates/PageContainer/Container";
import PageTemplate from "@/components/templates/PageTemplate";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';
import { fetchEconomicCalendar, EconomicCalendarFilter, EconomicEvent } from '@/services/economicCalendarService';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'id', ['economic-calendar', 'common', 'footer'])),
    },
  };
};

export default function EconomicCalendar() {
  const { t } = useTranslation('economic-calendar');
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<EconomicCalendarFilter>('today');
  const [selectedEvent, setSelectedEvent] = useState<EconomicEvent | null>(null);

  const filters = [
    { key: 'today', value: t('filters.today') },
    { key: 'thisWeek', value: t('filters.thisWeek') },
    { key: 'previousWeek', value: t('filters.previousWeek') },
    { key: 'nextWeek', value: t('filters.nextWeek') },
  ] satisfies Array<{ key: EconomicCalendarFilter; value: string }>;

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchEconomicCalendar(activeFilter);
        if (cancelled) return;
        setEvents(data);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setError('Gagal memuat data kalender ekonomi. Silakan coba lagi nanti.');
        setEvents([]);
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [activeFilter]);

  const handleFilterClick = (filterKey: EconomicCalendarFilter) => {
    setActiveFilter(filterKey);
  };

  useEffect(() => {
    if (!selectedEvent) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedEvent(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedEvent]);

  const formatDetailValue = (value?: string | null) => {
    const text = String(value ?? '').trim();
    return text ? text : '-';
  };

  // Format tanggal dari YYYY-MM-DD ke DD-MM-YYYY
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Pastikan tanggal valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Format impact menjadi bintang dengan warna yang sesuai
  const formatImpact = (impact: string) => {
    const filledStar = '\u2605';
    const emptyStar = '\u2606';
    const normalizedImpact = String(impact || '').trim();

    const renderLevel = (level: number, colorClass: string) => (
      <span className={`${colorClass} font-bold`}>
        {filledStar.repeat(level)}
        <span className="text-gray-300">{emptyStar.repeat(3 - level)}</span>
      </span>
    );

    if (!normalizedImpact) return renderLevel(1, 'text-gray-300');

    const questionMarks = (normalizedImpact.match(/\?/g) || []).length;
    const filledStars = (normalizedImpact.match(/\u2605/g) || []).length; // ★

    const levelFromSymbols = Math.min(3, Math.max(questionMarks, filledStars));
    if (levelFromSymbols > 0) {
      if (levelFromSymbols >= 3) return renderLevel(3, 'text-[#FF0000]');
      if (levelFromSymbols === 2) return renderLevel(2, 'text-[#FFA500]');
      return renderLevel(1, 'text-[#008000]');
    }

    switch (normalizedImpact.toLowerCase()) {
      case 'high':
        return renderLevel(3, 'text-[#FF0000]');
      case 'medium':
        return renderLevel(2, 'text-[#FFA500]');
      case 'low':
        return renderLevel(1, 'text-[#008000]');
      default:
        return renderLevel(1, 'text-gray-300');
    }
  };
  return (
    <PageTemplate title={t('title')}>
      <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-52 my-10">
        <ProfilContainer title={t('title')}>
          <div className="space-y-5">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => handleFilterClick(filter.key)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeFilter === filter.key
                      ? 'bg-[#FF0000] text-white shadow-md hover:bg-[#E60000]'
                      : 'bg-white text-[#080031] border border-[#080031] hover:bg-gray-50'
                  }`}
                >
                  {filter.value}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF0000]"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-[#FF0000] p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-[#FF0000]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-[#080031]">{error}</p>
                  </div>
                </div>
              </div>
            ) : events.length === 0 ? (
              <div className="bg-[#FFF5F5] border-l-4 border-[#FF0000] p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-[#FF0000]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-[#080031]">{t('noDataMessage')}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#080031]">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          {t('table.date')}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          {t('table.time')}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          {t('table.country')}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          {t('table.impact')}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          {t('table.figures')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {events.map((event) => (
                        <tr
                          key={event.id}
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => setSelectedEvent(event)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatDate(event.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {event.time}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                              {event.country}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {formatImpact(event.impact)}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="font-medium text-gray-900">{event.figures}</div>
                            {event.actual && (
                              <div className="text-xs text-gray-500 mt-1">
                                <span className="font-medium">{t('table.actual')}:</span> {event.actual}
                              </div>
                            )}
                            {event.forecast && (
                              <div className="text-xs text-gray-500">
                                <span className="font-medium">{t('table.forecast')}:</span> {event.forecast}
                              </div>
                            )}
                            {event.previous && (
                              <div className="text-xs text-gray-500">
                                <span className="font-medium">{t('table.previous')}:</span> {event.previous}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedEvent && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                role="dialog"
                aria-modal="true"
                onClick={() => setSelectedEvent(null)}
              >
                <div className="absolute inset-0 bg-black/50" />
                <div
                  className="relative w-full max-w-3xl bg-white rounded-lg shadow-xl overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src="/assets/bpf-logo.png"
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none select-none absolute inset-0 m-auto w-80 max-w-[70%] opacity-[0.06]"
                  />

                  <div className="relative z-10 flex items-start justify-between gap-4 px-6 py-4 border-b">
                    <div>
                      <h2 className="text-lg font-semibold text-[#080031]">
                        {t('details.title', { defaultValue: 'Detail Event' })}
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium text-gray-800">{selectedEvent.figures}</span>
                        <span className="mx-2 text-gray-300">•</span>
                        {formatDate(selectedEvent.date)} {selectedEvent.time}
                        <span className="mx-2 text-gray-300">•</span>
                        {selectedEvent.country}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedEvent(null)}
                      className="shrink-0 px-3 py-2 text-sm font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      {t('details.close', { defaultValue: 'Tutup' })}
                    </button>
                  </div>

                  <div className="relative z-10 px-6 py-5 max-h-[70vh] overflow-y-auto space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-gray-600">{t('table.impact')}</div>
                      <div className="text-sm">{formatImpact(selectedEvent.impact)}</div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {t('details.sources', { defaultValue: 'Sumber' })}
                        </div>
                        <div className="text-sm text-gray-800 mt-1">{formatDetailValue(selectedEvent.details?.sources)}</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {t('details.frequency', { defaultValue: 'Frekuensi' })}
                        </div>
                        <div className="text-sm text-gray-800 mt-1">{formatDetailValue(selectedEvent.details?.frequency)}</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {t('details.nextReleased', { defaultValue: 'Rilis Berikutnya' })}
                        </div>
                        <div className="text-sm text-gray-800 mt-1">{formatDetailValue(selectedEvent.details?.nextReleased)}</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {t('details.usualEffect', { defaultValue: 'Efek Umum' })}
                        </div>
                        <div className="text-sm text-gray-800 mt-1">{formatDetailValue(selectedEvent.details?.usualEffect)}</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {t('details.measures', { defaultValue: 'Mengukur' })}
                        </div>
                        <div className="text-sm text-gray-800 mt-1 whitespace-pre-line">
                          {formatDetailValue(selectedEvent.details?.measures)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {t('details.whyTraderCare', { defaultValue: 'Kenapa Penting' })}
                        </div>
                        <div className="text-sm text-gray-800 mt-1 whitespace-pre-line">
                          {formatDetailValue(selectedEvent.details?.whyTraderCare)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {t('details.notes', { defaultValue: 'Catatan' })}
                        </div>
                        <div className="text-sm text-gray-800 mt-1 whitespace-pre-line">
                          {formatDetailValue(selectedEvent.details?.notes)}
                        </div>
                      </div>
                    </div>

                    {Array.isArray(selectedEvent.details?.history) && selectedEvent.details!.history!.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {t('details.history', { defaultValue: 'Riwayat' })}
                        </div>
                        <div className="overflow-hidden rounded-lg border border-gray-200">
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">{t('table.date')}</th>
                                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">{t('table.previous')}</th>
                                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">{t('table.forecast')}</th>
                                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">{t('table.actual')}</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {selectedEvent.details!.history!.slice(0, 10).map((row, idx) => (
                                  <tr key={`${selectedEvent.id}-hist-${idx}`}>
                                    <td className="px-4 py-2 text-sm text-gray-800">{formatDate(row.date || '')}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{formatDetailValue(row.previous)}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{formatDetailValue(row.forecast)}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{formatDetailValue(row.actual)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {t('details.historyNote', { defaultValue: 'Menampilkan maksimal 10 data terakhir.' })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </ProfilContainer>
      </div>
    </PageTemplate>
  );
}
