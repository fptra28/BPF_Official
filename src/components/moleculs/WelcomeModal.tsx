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
      <div className="relative p-4 md:p-6 text-center max-w-md w-full">
        {/* Decorative elements */}
        <div className="absolute -top-3 -right-3 w-16 h-16 bg-[#F2AC59]/20 rounded-full -z-10"></div>
        <div className="absolute -bottom-3 -left-3 w-24 h-24 bg-[#F2AC59]/10 rounded-full -z-10"></div>
        
        {/* Logo with border */}
        <div className="mb-4">
          <div className="mx-auto w-24 h-24 p-1.5 bg-white border-2 border-[#F2AC59] rounded-xl shadow-sm">
            <div className="bg-white p-2 rounded-lg h-full flex items-center justify-center">
              <Image 
                src="/assets/bpf-logo.png" 
                alt="Bestprofit Futures" 
                width={96}
                height={96}
                className="h-full w-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-2xl md:text-3xl font-bold text-[#4C4C4C] mb-4">
          {t('title')}
        </h1>
        
        <p className="text-[#4C4C4C] text-base mb-6 max-w-md mx-auto leading-relaxed">
          {t('description')}
        </p>
        
        <div className="space-y-4">
          <a 
            href="https://regol.equityworld-futures.co.id/" 
            className="inline-block w-full max-w-[280px] mx-auto bg-[#F2AC59] hover:bg-[#e69e4d] text-white font-semibold py-2.5 px-5 rounded-lg shadow-sm hover:shadow transition-all duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('registerButton')}
          </a>
          <button 
            onClick={onClose}
            className="w-full max-w-[280px] mx-auto text-[#9B9FA7] hover:text-[#4C4C4C] text-xs font-medium transition-colors duration-200 block mt-2"
          >
            {t('laterButton')}
          </button>
        </div>
      </div>
    </ModalPopup>
  );
};

export default WelcomeModal;
