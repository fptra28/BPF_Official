import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface DetailBeritaProps {
    date: string;
    title: string;
    kategori?: string;
    img: string | string[];
    content: string;
}

const formatDate = (inputDate: string) => {
    const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: 'Asia/Jakarta',
    };
    const parsedDate = new Date(inputDate);
    if (isNaN(parsedDate.getTime())) return inputDate;
    return `${parsedDate.toLocaleString("id-ID", options)} WIB`;
};

const getFullImageUrl = (imagePath: string) => {
    if (!imagePath) return '/images/placeholder-news.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `https://portalnews.newsmaker.id/${imagePath.replace(/^\/+/, '')}`;
};

export default function DetailBerita({ date, title, img, content, kategori = 'Berita' }: DetailBeritaProps) {
    const images = Array.isArray(img) ? img : [img];
    const mainImage = images[0] || '/images/placeholder-news.jpg';
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);

    const openModal = (index: number) => {
        // Pastikan index tidak melebihi jumlah gambar yang ada
        const safeIndex = Math.min(Math.max(0, index), images.length - 1);
        setSelectedImage(safeIndex);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    return (
        <div>
            {/* Header dengan judul dan metadata */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                    <div className="flex items-center">
                        <i className="far fa-calendar-alt mr-2"></i>
                        <span>{formatDate(date)}</span>
                    </div>
                    <div className="hidden md:block">•</div>
                    <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                        {kategori}
                    </div>
                </div>
            </div>

            {/* Gambar utama */}
            <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
                <div className="relative w-full h-96 md:h-[500px] bg-gray-100">
                    <Image
                        src={getFullImageUrl(mainImage)}
                        alt={title}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, 80vw"
                    />
                </div>
                {images.length > 1 && (
                    <div className="bg-gray-50 p-3 text-center text-sm text-gray-500">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-white text-xs font-medium text-gray-600">
                            <i className="far fa-images mr-1"></i>
                            Gambar 1 dari {images.length}
                        </span>
                    </div>
                )}
            </div>

            {/* Konten artikel */}
            <article className="prose prose-lg max-w-none text-gray-800">
                <div 
                    className="leading-relaxed [&>p]:mb-6 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-10 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mt-8 [&>h3]:mb-3 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:my-4 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:my-4 [&>blockquote]:border-l-4 [&>blockquote]:border-green-500 [&>blockquote]:pl-4 [&>blockquote]:py-1 [&>blockquote]:my-6 [&>blockquote]:text-gray-600"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </article>

            {/* Galeri gambar tambahan */}
            {images.length > 1 && (
                <div className="mt-16">
                    <h2 className="text-2xl font-bold mb-8 pb-4 border-b border-gray-100 flex items-center">
                        <i className="far fa-images mr-3 text-green-600"></i>
                        Galeri Foto
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-6">
                        {images.map((image, index) => {
                            // Skip gambar utama (index 0) karena sudah ditampilkan di atas
                            if (index === 0) return null;
                            
                            return (
                                <div 
                                    key={index} 
                                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
                                >
                                    <div 
                                        className="relative aspect-video w-full h-48 bg-gray-100 flex items-center justify-center cursor-pointer" 
                                        onClick={() => openModal(index)}
                                    >
                                        <Image 
                                            src={getFullImageUrl(image)}
                                            alt={`${title} - Gambar ${index}`}
                                            fill
                                            className="object-contain p-2"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/images/placeholder-news.jpg';
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Tombol Lihat Semua Berita */}
            <div className="mt-10 pt-6 border-t border-gray-200 w-full">
                <button 
                    onClick={() => router.push('/analisis/berita', undefined, { locale: router.locale })}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center mx-auto"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                    Lihat Semua Berita
                </button>
            </div>

            {/* Share buttons */}
            <div className="mt-12 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap items-center justify-between">
                    <div className="text-sm text-gray-500 mb-4 md:mb-0">
                        Bagikan artikel ini:
                    </div>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-500 hover:text-blue-500">
                            <i className="fab fa-facebook-f text-xl"></i>
                        </a>
                        <a href="#" className="text-gray-500 hover:text-blue-400">
                            <i className="fab fa-twitter text-xl"></i>
                        </a>
                        <a href="#" className="text-gray-500 hover:text-red-500">
                            <i className="fab fa-tiktok text-xl"></i>
                        </a>
                        <a href="#" className="text-gray-500 hover:text-pink-600">
                            <i className="fab fa-instagram text-xl"></i>
                        </a>
                    </div>
                </div>
            </div>

            {/* Image Modal */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 transition-opacity duration-300"
                    onClick={closeModal}
                >
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="absolute -top-4 -right-4 z-10 bg-white rounded-full p-1 text-gray-700 hover:text-black shadow-lg"
                            onClick={closeModal}
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                        <div className="bg-white p-1 rounded-lg shadow-xl inline-block">
                            <Image 
                                src={getFullImageUrl(images[selectedImage])}
                                alt={`${title} - Gambar ${selectedImage + 2}`}
                                width={800}
                                height={600}
                                className="block max-w-[85vw] max-h-[85vh] object-contain rounded-md"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/images/placeholder-news.jpg';
                                }}
                                priority
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
