import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import ModalPopup from './ModalPopup';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('welcome');
  return (
    <ModalPopup isOpen={isOpen} onClose={onClose}>
      <div className="relative p-6 md:p-8 text-center max-w-md w-full bg-white rounded-xl overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#080031]/5 rounded-full -z-10"></div>
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-[#FF0000]/5 rounded-full -z-10"></div>
        
        {/* Logo */}
        <div className="mb-6">
          <div className="mx-auto w-32 h-32 p-2 bg-white rounded-xl shadow-md">
            <div className="relative w-full h-full flex items-center justify-center">
              <Image 
                src="/assets/bpf-logo.png" 
                alt="Bestprofit Futures" 
                width={120}
                height={96}
                className="h-full w-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-2xl md:text-3xl font-bold text-[#080031] mb-4">
          {t('title')}
        </h1>
        
        <p className="text-[#080031]/90 text-base mb-6 max-w-md mx-auto leading-relaxed">
          {t('description')}
        </p>
        
        <div className="space-y-4">
          <a 
            href="https://www.bestprofit-futures.co.id/register" 
            className="inline-block w-full max-w-[280px] mx-auto bg-[#FF0000] hover:bg-[#E60000] text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('registerButton')}
          </a>
          <button 
            onClick={onClose}
            className="w-full max-w-[280px] mx-auto text-[#9B9FA7] hover:text-[#080031] text-sm font-medium transition-colors duration-200 block mt-2"
          >
            {t('laterButton')}
          </button>
        </div>
      </div>
    </ModalPopup>
  );
};

export default WelcomeModal;
