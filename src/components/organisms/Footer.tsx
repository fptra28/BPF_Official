import React from "react";
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Ikon SVG inline
interface IconProps extends React.SVGProps<SVGSVGElement> {}

const Icons = {
    Warning: (props: IconProps) => (
        <svg {...props} className="h-5 w-5 text-[#FF0000] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
    ),
    Home: (props: IconProps) => (
        <svg {...props} className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    ),
    Cube: (props: IconProps) => (
        <svg {...props} className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    ),
    Envelope: (props: IconProps) => (
        <svg {...props} className="h-5 w-5 flex-shrink-0 text-[#FF0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" />
        </svg>
    ),
    MapPin: (props: IconProps) => (
        <svg {...props} className="h-5 w-5 flex-shrink-0 text-[#FF0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" />
        </svg>
    ),
    Phone: (props: IconProps) => (
        <svg {...props} className="h-5 w-5 flex-shrink-0 text-[#FF0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke="currentColor" />
        </svg>
    ),
    Document: (props: IconProps) => (
        <svg {...props} className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    )
};

const Footer = () => {
    const { t } = useTranslation('footer');
    const router = useRouter();
    const [isClient, setIsClient] = React.useState(false);
    const currentYear = new Date().getFullYear();
    
    // Get current locale
    const { locale, locales, asPath } = router;
    
    // Function to get localized path
    const getLocalizedPath = (path: string) => {
        return `/${locale}${path === '/' ? '' : path}`;
    };
    
    React.useEffect(() => {
        setIsClient(true);
    }, []);

    // Fallback values untuk semua terjemahan
    const warningTitle = t('warningTitle', 'PERHATIAN');
    const warningMessage = t('warningMessage', 'Manajemen PT. BestProfit Futures menghimbau kepada seluruh masyarakat untuk lebih berhati-hati terhadap beberapa bentuk penipuan yang berkedok investasi mengatasnamakan PT. BestProfit Futures dengan menggunakan media elektronik ataupun sosial media. Untuk itu harus dipastikan bahwa transfer dana ke rekening tujuan (Segregated Account) guna melaksanakan transaksi Perdagangan Berjangka adalah atas nama PT Equityworld Futures, bukan atas nama individu.');
    const quickLinks = t('quickLinks', 'Tautan Cepat');
    const contactUs = t('contactUs', 'Kontak Kami');
    const legal = t('legal', 'Legalitas');
    const headOffice = t('headOffice', 'Kantor Pusat');
    const address = t('address', 'Equity Tower Lt. 47, Kawasan Niaga Terpadu Sudirman (SCBD) Jl. Jend. Sudirman Kav. 52-53 Jakarta 12190');
    const komdigiDesc = t('komdigiDesc', 'Terdaftar dan diawasi oleh Kementerian Komunikasi dan Informatika Republik Indonesia');
    const isoDesc = t('isoDesc', 'Bersertifikat ISO 9001:2015');
    const copyright = t('copyright', '&copy; {{year}} PT. BestProfit Futures. All rights reserved.');
    const termsConditions = t('termsConditions', 'Syarat & Ketentuan');
    const privacyPolicy = t('privacyPolicy', 'Kebijakan Privasi');
    const disclaimer = t('disclaimer', 'Disclaimer');

    // Tampilkan loading sederhana di server
    if (!isClient) {
        return (
            <footer className="bg-white">
                <div className="animate-pulse h-64 bg-gray-100"></div>
            </footer>
        );
    }

    return (
        <footer className="bg-white border-t border-gray-100">
            {/* Warning Banner */}
            <div className="bg-[#FF0000]/5 py-4 px-4 sm:px-6 lg:px-8 border-b border-[#FF0000]/20">
                <div className="max-w-7xl mx-auto flex items-start">
                    <Icons.Warning className="mt-0.5" />
                    <div className="ml-3">
                        <h3 className="text-sm font-bold text-[#080031] mb-1">{warningTitle}</h3>
                        <p className="text-xs text-black leading-relaxed">
                            {warningMessage}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-8 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Quick Links */}
                    <div className="md:col-span-2">
                        <h3 className="text-sm font-bold text-black mb-4 uppercase tracking-wider border-b border-[#080031]/10 pb-2">{quickLinks}</h3>
                        <ul className="space-y-3">
                            {[
                                { icon: <Icons.Home />, text: t('home', 'Beranda'), href: '/' },
                                { icon: <Icons.Cube />, text: t('viewProducts', 'Produk'), href: '/produk' },
                                { icon: <Icons.Envelope />, text: t('contact', 'Kontak'), href: '/hubungi-kami' }
                            ].map((item, index) => (
                                <li key={index} className="group">
                                    <Link 
                                        href={item.href} 
                                        locale={locale}
                                        className="flex items-center text-sm text-black hover:text-[#FF0000] transition-colors"
                                    >
                                        <span className="mr-2 text-[#FF0000] group-hover:translate-x-1 transition-transform">
                                            {item.icon}
                                        </span>
                                        {item.text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="md:col-span-4">
                        <h3 className="text-sm font-bold text-black mb-4 uppercase tracking-wider border-b border-[#080031]/10 pb-2">{contactUs}</h3>
                        <div className="space-y-4">
                            <div className="flex group">
                                <Icons.MapPin className="mt-0.5 flex-shrink-0" />
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-black mb-1 group-hover:text-[#FF0000] transition-colors">{headOffice}</p>
                                    <p className="text-sm text-black leading-relaxed">{address}</p>
                                </div>
                            </div>
                            <div className="flex items-center group">
                                <Icons.Phone />
                                <a href="tel:+622129035005" className="ml-3 text-sm text-black hover:text-[#FF0000] transition-colors">
                                +62 21 2903 5005
                                </a>
                            </div>
                            <div className="flex items-center group">
                                <Icons.Envelope />
                                <a 
                                    href="mailto:corporate@bestprofit-futures.co.id" 
                                    className="ml-3 text-sm text-black hover:text-[#FF0000] transition-colors break-all"
                                >
                                    corporate@bestprofit-futures.co.id
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Legal Info */}
                    <div className="md:col-span-6">
                        <h3 className="text-sm font-bold text-black mb-4 uppercase tracking-wider border-b border-[#080031]/10 pb-2">{legal}</h3>
                        <div className="flex flex-wrap gap-4">
                            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex-1 min-w-[200px] hover:border-[#FF0000]/30 hover:shadow-md transition-all duration-300">
                                <img 
                                    src="/assets/BrandLogo.org-KOMDIGI-Logo-2024.png" 
                                    alt="Kementerian Komunikasi dan Informatika" 
                                    className="h-10 w-auto object-contain mb-2 mx-auto"
                                />
                                <p className="text-xs text-center text-black">{komdigiDesc}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex-1 min-w-[200px] hover:border-[#FF0000]/30 hover:shadow-md transition-all duration-300">
                                <img 
                                    src="/assets/iso_tsi.png" 
                                    alt="ISO 9001:2015 Certified" 
                                    className="h-10 w-auto object-contain mb-2 mx-auto"
                                />
                                <p className="text-xs text-center text-black">{isoDesc}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-6 border-t border-gray-100">
                    <div className="flex justify-center">
                        <p 
                            className="text-xs text-black text-center"
                            dangerouslySetInnerHTML={{ 
                                __html: copyright.replace('{{year}}', currentYear.toString())
                            }} 
                        />
                        {/* <div className="flex items-center gap-4">
                            <a href="/syarat-ketentuan" className="text-xs text-[#4C4C4C] hover:text-[#FF0000] transition-colors whitespace-nowrap">
                                {termsConditions}
                            </a>
                            <span className="w-1 h-1 bg-[#4C4C4C] rounded-full"></span>
                            <a href="/kebijakan-privasi" className="text-xs text-[#4C4C4C] hover:text-[#FF0000] transition-colors whitespace-nowrap">
                                {privacyPolicy}
                            </a>
                            <span className="w-1 h-1 bg-[#4C4C4C] rounded-full"></span>
                            <a href="/disclaimer" className="text-xs text-[#4C4C4C] hover:text-[#FF0000] transition-colors whitespace-nowrap">
                                {disclaimer}
                            </a>
                        </div> */}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
