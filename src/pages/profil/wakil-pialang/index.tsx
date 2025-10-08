import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PageTemplate from "@/components/templates/PageTemplate";
import ProfilContainer from "@/components/templates/PageContainer/Container";
import Link from 'next/link';

interface KategoriPialang {
    id: number;
    nama_kategori: string;
    slug: string;
    image?: string;
}

export async function getStaticProps({ locale }: { locale: string }) {
    return {
        props: {
            ...(await serverSideTranslations(locale || 'id', ['common', 'footer', 'wakil_pialang'])),
        },
    };
}

export default function WakilPialang() {
    const { t } = useTranslation('wakil_pialang');
    const [kategoriList, setKategoriList] = useState<KategoriPialang[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchKategori = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/kategori-pialang');
                
                if (!response.ok) {
                    throw new Error('Gagal memuat data kategori');
                }
                
                const data = await response.json();
                // Tambahkan gambar default untuk setiap kategori
                const kategoriDenganGambar = data.map((kategori: KategoriPialang) => ({
                    ...kategori,
                    image: `/images/cities/${kategori.slug.toLowerCase()}.jpg`
                }));
                
                setKategoriList(kategoriDenganGambar);
            } catch (err) {
                console.error('Error fetching kategori:', err);
                setError('Gagal memuat data. Silakan coba lagi nanti.');
            } finally {
                setLoading(false);
            }
        };

        fetchKategori();
    }, []);

    if (loading) {
        return (
            <PageTemplate title={t('pageTitle')}>
                <div className="px-4 sm:px-6 py-6 max-w-4xl mx-auto">
                    <ProfilContainer title={t('pageTitle')}>
                        <div className="flex justify-center items-center py-16">
                            <div className="animate-pulse flex space-x-4 items-center">
                                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                            </div>
                        </div>
                    </ProfilContainer>
                </div>
            </PageTemplate>
        );
    }

    if (error) {
        return (
            <PageTemplate title={t('pageTitle')}>
                <div className="px-4 sm:px-6 py-6 max-w-4xl mx-auto">
                    <ProfilContainer title={t('pageTitle')}>
                        <div className="text-center py-10">
                            <div className="text-red-500 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <p className="mt-2 text-lg font-medium">Terjadi Kesalahan</p>
                                <p className="mt-1 text-sm text-gray-600">{error}</p>
                            </div>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-6 px-6 py-2 bg-[#FF0000] text-white rounded-lg hover:bg-[#E60000] transition-colors duration-300 flex items-center mx-auto"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Coba Lagi
                            </button>
                        </div>
                    </ProfilContainer>
                </div>
            </PageTemplate>
        );
    }

    return (
        <PageTemplate title={t('pageTitle')}>
            <div className="px-4 sm:px-6 py-6 max-w-4xl mx-auto">
                <ProfilContainer title={t('pageTitle')}>
                    <div className="text-center mb-6">
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {kategoriList.map((kategori) => (
                            <Link 
                                key={kategori.id} 
                                href={`/profil/wakil-pialang/${kategori.slug}`}
                                className="group block transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden h-full transition-all duration-300 hover:shadow-md hover:border-[#FF0000]/20">
                                    <div className="p-4">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-[#FF0000]/10 text-[#FF0000] mr-4 group-hover:bg-[#FF0000] group-hover:text-white transition-colors duration-300">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-base font-medium text-[#080031] group-hover:text-[#FF0000] transition-colors duration-300">
                                                    {kategori.nama_kategori}
                                                </h3>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    {t('viewAllText', 'Lihat daftar lengkap')}
                                                </p>
                                            </div>
                                            <div className="text-gray-300 group-hover:text-[#FF0000] transition-colors duration-300">
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
                </ProfilContainer>
            </div>
        </PageTemplate>
    );
}
