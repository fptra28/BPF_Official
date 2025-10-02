'use client';

import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useEffect, useRef, useState } from 'react';

export default function LanguageSwitcher() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const currentLang = i18n.language === 'id' ? 'ID' : 'EN';
  
  // Toggle dropdown
  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);
  
  // Handle klik di luar dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const changeLanguage = (newLocale: string) => {
    // Tutup dropdown
    closeDropdown();
    
    // Jika locale sama, tidak perlu melakukan apa-apa
    if (newLocale === i18n.language) {
      return;
    }
    
    // Dapatkan path saat ini tanpa locale prefix
    const { asPath } = router;
    const cleanPath = asPath.replace(/^\/(id|en)(\/|$)/, '/') || '/';
    
    // Buat path baru berdasarkan locale yang dipilih
    const newPath = newLocale === 'id' 
      ? cleanPath === '/' ? '/' : cleanPath
      : `/${newLocale}${cleanPath === '/' ? '' : cleanPath}`;
    
    console.log('Changing language to:', newLocale, 'Path:', newPath);
    
    // Gunakan window.location untuk navigasi langsung
    // Ini mencegah masalah dengan router Next.js
    window.location.href = newPath;
  };

  // Tampilkan loading sederhana di server
  if (typeof window === 'undefined') {
    return (
      <div className="relative w-16">
        <div className="h-8 bg-[#080031] rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="relative group" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between w-16 px-3 py-1 text-sm font-medium text-white bg-[#080031] border border-[#9B9FA7] rounded hover:bg-[#FF0000] hover:text-white focus:outline-none focus:ring-1 focus:ring-[#FF0000]"
      >
        {currentLang}
        <svg 
          className={`w-3 h-3 ml-1 text-white transition-all duration-200 group-hover:text-white ${isOpen ? 'transform rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 20 20"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-[60] w-32 mt-1 bg-[#080031] rounded-md shadow-lg border border-[#9B9FA7]">
          <div className="py-1">
            <button
              onClick={() => changeLanguage('id')}
              className={`w-full text-left px-3 py-2 text-sm ${
                i18n.language === 'id' 
                  ? 'bg-[#FF0000] text-white font-medium' 
                  : 'text-white hover:bg-[#FF0000] hover:text-white'
              }`}
            >
              Indonesian
            </button>
            <button
              onClick={() => changeLanguage('en')}
              className={`w-full text-left px-3 py-2 text-sm ${
                i18n.language === 'en' 
                  ? 'bg-[#FF0000] text-white font-medium' 
                  : 'text-white hover:bg-[#FF0000] hover:text-white'
              }`}
            >
              English
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
