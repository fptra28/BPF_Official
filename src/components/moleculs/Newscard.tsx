import CardDetail from "../atoms/CardDetail";
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

export type NewsCardVariant = 'default' | 'large' | 'small';

interface NewsCardProps {
    title: string;
    date: string;
    content: string;
    slug: string;
    img?: string;
    variant?: NewsCardVariant;
    className?: string;
}

export default function NewsCard({
    title,
    date,
    content,
    slug,
    img,
    variant = 'default',
    className = '',
}: NewsCardProps) {
    const { t, i18n } = useTranslation('berita');

    // Fungsi untuk memotong teks tanpa memotong di tengah kata
    function stripHtml(html: string = ""): string {
        if (typeof html !== "string") return "";
        return html.replace(/<[^>]*>/g, "").trim();
    }

    function trimText(text: string = "", maxChars: number) {
        const plainText = stripHtml(text);
        return plainText.length > maxChars ? plainText.slice(0, maxChars).trim() + "..." : plainText;
    }

    const parseApiDateTime = (inputDate: string): Date | null => {
        if (!inputDate) return null;
        try {
            // If API sends "YYYY-MM-DD HH:mm:ss", normalize to an ISO-like string.
            const normalized = inputDate.replace(/^(\d{4}-\d{2}-\d{2})\s(\d{2}:\d{2})(:\d{2})?$/, '$1T$2$3');
            const parsed = new Date(normalized);
            if (Number.isNaN(parsed.getTime())) return null;
            return parsed;
        } catch (error) {
            console.error('Error formatting date:', error);
            return null;
        }
    };

    const formatDateTime = (inputDate: string) => {
        const parsedDate = parseApiDateTime(inputDate);
        if (!parsedDate) return inputDate;

        const locale = i18n.language === 'en' ? 'en-US' : 'id-ID';
        const options: Intl.DateTimeFormatOptions = {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: 'Asia/Jakarta',
        };

        return `${parsedDate.toLocaleString(locale, options)} WIB`;
    };

    // Pastikan slug tidak mengandung awalan /analisis/berita/
    const cleanSlug = slug.startsWith('analisis/berita/') 
        ? slug.replace('analisis/berita/', '') 
        : slug;
    const fullLink = cleanSlug.startsWith('/') 
        ? cleanSlug 
        : `/analisis/berita/${cleanSlug}`;

    // Tentukan kelas CSS berdasarkan variant
    const cardClasses = {
        default: 'group flex flex-col rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#FF0000]/30',
        large: 'group flex flex-col rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#FF0000]/30',
        small: 'group flex flex-row rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-[#FF0000]/30',
    };

    const imageClasses = {
        default: 'relative h-48 bg-[#080031]/5 overflow-hidden',
        large: 'relative h-64 md:h-80 bg-[#080031]/5 overflow-hidden',
        small: 'relative w-1/3 h-24 md:h-40 bg-[#080031]/5 overflow-hidden flex-shrink-0',
    };

    const contentClasses = {
        default: 'p-4 md:p-6 flex-1 flex flex-col bg-white',
        large: 'p-6 flex-1 flex flex-col bg-white',
        small: 'p-3 md:p-4 flex-1 flex flex-col bg-white',
    };

    const titleClasses = {
        default: 'text-lg md:text-xl font-bold text-[#080031] mb-2 group-hover:text-[#FF0000] transition-colors duration-300 line-clamp-2',
        large: 'text-xl md:text-2xl font-bold text-[#080031] mb-3 group-hover:text-[#FF0000] transition-colors duration-300 line-clamp-2',
        small: 'text-sm md:text-base font-bold text-[#080031] mb-1 group-hover:text-[#FF0000] transition-colors duration-300 line-clamp-2',
    };

    const excerptClasses = {
        default: 'text-[#080031]/80 mb-4 text-sm md:text-base line-clamp-3',
        large: 'text-[#080031]/80 mb-5 text-base md:text-lg line-clamp-4',
        small: 'text-[#080031]/80 text-xs md:text-sm line-clamp-2',
    };

    const dateClasses = {
        default: 'text-xs md:text-sm font-medium text-[#FF0000] mb-2',
        large: 'text-sm md:text-base font-medium text-[#FF0000] mb-2',
        small: 'text-xs text-[#FF0000] mb-1',
    };

    const showReadMore = variant !== 'small';
    const excerptLength = variant === 'large' ? 300 : (variant === 'small' ? 80 : 150);
    const trimmedExcerpt = trimText(content, excerptLength);

    // Combine the base classes with any additional classes passed through props
    const combinedClasses = `${cardClasses[variant]} ${className || ''} h-full`;

    // Fungsi untuk menangani klik pada kartu
    const handleCardClick = (e: React.MouseEvent) => {
        // Cegah navigasi ganda jika yang diklik adalah link atau tombol
        if ((e.target as HTMLElement).closest('a, button, [role="button"]')) {
            return;
        }
        // Gunakan window.location untuk navigasi penuh
        window.location.href = fullLink;
    };

    return (
        <div className={combinedClasses}>
            <Link 
                href={fullLink}
                className="block h-full"
                onClick={(e) => {
                    // Biarkan event bubbling untuk Link
                    e.stopPropagation();
                }}
            >
                <div 
                    className="h-full cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            window.location.href = fullLink;
                        }
                    }}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                    <div className={imageClasses[variant]}>
                        {img ? (
                            <>
                                <img 
                                    src={img} 
                                    alt={title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null;
                                        target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18bad83a944%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18bad83a944%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22290.5625%22%20y%3D%22217.7%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                            </div>
                        )}
                    </div>
                    <div className={contentClasses[variant]}>
                        <p className={dateClasses[variant]}>{formatDateTime(date)}</p>
                        <h3 className={titleClasses[variant]}>{title}</h3>
                        <p className={excerptClasses[variant]}>{trimmedExcerpt}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}
