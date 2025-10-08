import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { KategoriWakilPialang, fetchKategoriWakilPialang } from '@/services/kategoriWakilPialangService';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface WakilPialangSectionProps {
  limit?: number;
  showHeader?: boolean;
  className?: string;
}

export default function WakilPialangSection({
  className = '',
  showHeader = true
}: WakilPialangSectionProps) {
  const { t } = useTranslation('wakil_pialang');
  const router = useRouter();
  const [kota, setKota] = useState<KategoriWakilPialang[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadKota = async () => {
      try {
        setIsLoading(true);
        const data = await fetchKategoriWakilPialang();
        // Menampilkan semua data tanpa batasan limit
        setKota(data);
        setError(null);
      } catch (err) {
        console.error('Error loading kategori wakil pialang:', err);
        setError(t('errorText', 'Gagal memuat data. Silakan coba lagi nanti.'));
      } finally {
        setIsLoading(false);
      }
    };

    loadKota();
  }, []);

  if (isLoading) {
    return (
      <div className={`${className} relative py-16`}>
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[80%] h-64 bg-gradient-to-r from-[#080031]/5 to-[#FF0000]/5 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {showHeader && (
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 text-sm font-medium text-[#080031] bg-[#080031]/5 rounded-full mb-4">
                {t('pageSubtitle', 'Daftar Wilayah')}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#080031] mb-4">
                {t('pageTitle')}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#080031] to-[#FF0000] rounded-full mx-auto mb-6"></div>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t('pageDescription')}
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-[#080031]/5 rounded w-3/4"></div>
                  <div className="h-4 bg-[#080031]/5 rounded w-1/2"></div>
                  <div className="h-10 bg-[#080031]/5 rounded-lg mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} relative py-16`}>
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[80%] h-64 bg-gradient-to-r from-[#080031]/5 to-[#FF0000]/5 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-xl shadow-sm border border-red-100">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 mb-4">
            <svg className="h-8 w-8 text-[#FF0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-[#080031] mb-2">{t('errorTitle', 'Terjadi Kesalahan')}</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-6 py-2.5 text-sm font-medium rounded-lg shadow-sm text-white bg-[#FF0000] hover:bg-[#CC0000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF0000] transition-colors duration-300"
          >
            {t('tryAgain', 'Coba Lagi')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative py-16`}>
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[80%] h-64 bg-gradient-to-r from-[#080031]/5 to-[#FF0000]/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 text-sm font-medium text-[#080031] bg-[#080031]/5 rounded-full mb-4">
              {t('pageSubtitle', 'Daftar Wilayah')}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#080031] mb-4">
              {t('pageTitle')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#080031] to-[#FF0000] rounded-full mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('pageDescription')}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {kota.map((item) => (
            <Link 
              key={item.id} 
              href={`/profil/wakil-pialang/${item.slug}`}
              className="group block transition-all duration-300 hover:-translate-y-1"
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:border-[#FF0000]/20">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-[#FF0000]/10 text-[#FF0000] mr-4 group-hover:bg-[#FF0000] group-hover:text-white transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#080031] group-hover:text-[#FF0000] transition-colors duration-300">
                        {item.nama_kategori}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {t('viewAllText', 'Lihat daftar lengkap')}
                      </p>
                    </div>
                    <div className="flex items-center justify-center text-gray-300 group-hover:text-[#FF0000] transition-colors duration-300 ml-2">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
