import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import CardDetail from "../atoms/CardDetail";

interface NewsCard2Props {
    date: string;
    title: string;
    content: string;
    link?: string;
    image?: string;
    category?: string;
    index?: number;
}

export default function NewsCard2({ date, title, content, link, image, category, index = 0 }: NewsCard2Props) {
    const { t, i18n } = useTranslation(['common', 'pengumuman', 'footer']);
    const { locale } = useRouter();
    
    // Default category translation
    const defaultCategory = t('pengumuman:category', { defaultValue: 'Announcement' });
    const displayCategory = category || defaultCategory;
    
    // Format date based on current locale
    const formatDate = (inputDate: string) => {
        if (!inputDate) return '';
        
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        };
        
        try {
            const parsedDate = new Date(inputDate);
            return parsedDate.toLocaleDateString(locale || 'id-ID', options);
        } catch (e) {
            console.error('Invalid date format:', inputDate);
            return '';
        }
    };

    // Fungsi truncate
    const truncate = (text: string, maxLength: number) =>
        text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

    // Fungsi hapus HTML tag
    const stripHtml = (html: string) => {
        if (!html) return '';

        const withoutTags = html.replace(/<[^>]+>/g, '');

        const decodeEntities = (text: string) => {
            const named: Record<string, string> = {
                nbsp: '\u00A0',
                amp: '&',
                lt: '<',
                gt: '>',
                quot: '"',
                apos: "'",
            };

            return text
                .replace(/&([a-zA-Z]+);/g, (match, name) => named[name] ?? match)
                .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(Number(num)))
                .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
        };

        return decodeEntities(withoutTags).replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
    };

    // Function to handle image error with localized text
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const target = e.target as HTMLImageElement;
        target.onerror = null;
        const noImageText = t('common:noImage', { defaultValue: 'No Image' });
        target.src = `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23EEEEEE%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22220%22%20font-family%3D%22Arial%2C%20Helvetica%2C%20sans-serif%22%20font-size%3D%2220%22%20text-anchor%3D%22middle%22%20fill%3D%22%23AAAAAA%22%3E${encodeURIComponent(noImageText)}%3C%2Ftext%3E%3C%2Fsvg%3E`;
    };

    const formattedDate = formatDate(date);
    const cleanContent = stripHtml(content);
    const truncatedContent = truncate(cleanContent, 150);
    const truncatedTitle = truncate(stripHtml(title), 70);

    return (
        <div className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#FF0000]/20 relative">
            {/* Category Badge */}
            <div className="absolute top-4 right-4 z-10">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#FF0000] text-white">
                    {displayCategory}
                </span>
            </div>
            
            {/* Image Container */}
            <div className="relative w-full h-48 overflow-hidden">
                {image ? (
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={index < 3}
                        unoptimized={!image.startsWith('http')}
                        style={{
                            objectFit: 'cover',
                            objectPosition: 'center',
                            maxWidth: '100%',
                            height: '100%',
                        }}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#080031]/5 to-[#080031]/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#080031]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                    </div>
                )}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            {/* Content Container */}
            <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-[#FF0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <time dateTime={date} title={formattedDate}>
                        {formattedDate}
                    </time>
                </div>
                
                <h3 className="text-xl font-bold text-[#080031] group-hover:text-[#FF0000] transition-colors duration-300 line-clamp-2 mb-3">
                    {truncatedTitle}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {truncatedContent}
                </p>
            </div>
        </div>
    );
}
