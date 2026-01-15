import { useTranslation } from 'next-i18next';
import React from 'react';

interface StepProps {
  title: string;
  description?: string;
  items?: string[];
}

interface BankAccount {
  bank: string;
  idr: string;
  usd?: string;
}

export default function RegistrationFlow() {
  const { t } = useTranslation('prosedur');
  const steps = t('registrationFlow.steps', { returnObjects: true }) as StepProps[];

  const bankAccounts = (t('bankAccounts', { returnObjects: true }) as BankAccount[]) || [];

  const renderStepContent = (step: StepProps) => {
    if (step.items && step.items.length > 0) {
      return (
        <div className="mt-2 text-gray-600">
          {step.description && <p className="mb-2">{step.description}</p>}
          <ul className="list-disc ml-5 space-y-1">
            {step.items.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      );
    }
    
    return step.description ? <p className="mt-2 text-gray-600">{step.description}</p> : null;
  };

  return (
    <div className="space-y-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        {t('registrationFlow.title', 'Alur Pendaftaran')}
      </h2>
      <div className="w-20 h-1 bg-[#FF0000] mb-8"></div>
      
      <div className="relative">
        {/* Garis vertikal */}
        <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-300"></div>
        
        <div className="space-y-12">
          {steps.map((step: StepProps, index: number) => (
            <div key={index} className="relative flex">
              {/* Bulatan */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FF0000] flex items-center justify-center text-white font-bold z-10">
                {index + 1}
              </div>
              
              {/* Konten */}
              <div className="ml-6 pb-12">
                <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
                {renderStepContent(step)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Informasi Rekening Bank */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-4">
          {t('registrationFlow.bankAccounts.title', 'Rekening Bank Perusahaan')}
        </h3>
        {Array.isArray(bankAccounts) && bankAccounts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {bankAccounts.map((bank: BankAccount, index: number) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow">
                <p className="font-semibold">{bank.bank}</p>
                <p className="mt-2">{bank.idr}</p>
                {bank.usd && <p>{bank.usd}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">{t('noDataMessage', { defaultValue: 'Data belum tersedia.' })}</p>
        )}
      </div>
    </div>
  );
}
