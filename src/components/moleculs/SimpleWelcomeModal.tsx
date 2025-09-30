import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';

interface SimpleWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SimpleWelcomeModal: React.FC<SimpleWelcomeModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('welcome');
  const modalRef = useRef<HTMLDivElement>(null);
  const scrollY = useRef(0);

  // Handle scroll when modal is open
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (isOpen) {
      // Save current scroll position
      scrollY.current = window.scrollY;
      // Disable scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY.current}px`;
      document.body.style.width = '100%';
    } else {
      // Re-enable scroll and restore position
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY.current);
    }

    return () => {
      if (isOpen) {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY.current);
      }
    };
  }, [isOpen]);

  if (typeof window === 'undefined' || !isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      style={{
        WebkitTapHighlightColor: 'transparent',
      }}
      onClick={onClose}
    >
      <div 
        className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 max-w-md w-full mx-4 overflow-hidden shadow-xl transform transition-all border border-white/20"
        onClick={(e) => e.stopPropagation()}
        style={{
          WebkitTransform: 'translateZ(0)',
          transform: 'translateZ(0)',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
          backdropFilter: 'blur(10px)'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 text-2xl"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-6 relative">
            <Image
              src="/assets/bpf-logo.png"
              alt="Bestprofit Futures"
              fill
              className="object-contain"
              priority
              unoptimized={process.env.NODE_ENV !== 'production'}
            />
          </div>
          
          <h1 className="text-2xl font-bold text-[#080031] mb-4">
            {t('title')}
          </h1>
          
          <p className="text-[#080031]/90 mb-6">
            {t('description')}
          </p>
          
          <div className="space-y-4">
            <a
              href="https://www.bestprofit-futures.co.id/register"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-[#FF0000] hover:bg-[#E60000] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {t('registerButton')}
            </a>
            
            <button
              onClick={onClose}
              className="text-[#9B9FA7] hover:text-[#080031] text-sm font-medium transition-colors"
            >
              {t('laterButton')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SimpleWelcomeModal);
