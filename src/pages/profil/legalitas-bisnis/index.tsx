import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ProfilContainer from "@/components/templates/PageContainer/Container";
import PageTemplate from "@/components/templates/PageTemplate";
import { FaCheckCircle } from 'react-icons/fa';

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'id', ['legalitas_bisnis', 'common', 'footer'])),
    },
  };
}

type LegalitasItem = string;

export default function LegalitasBisnis() {
  const { t } = useTranslation('legalitas_bisnis');
  const legalitasItems = t('legalitasItems', { returnObjects: true }) as LegalitasItem[];

  return (
    <PageTemplate 
      title={t('pageTitle')}
      description={t('pageDescription')}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-12 max-w-5xl mx-auto">
        <ProfilContainer title={t('pageTitle')}>
          {/* Heading */}
          <div className="mb-8">
            {/* <span className="inline-flex items-center w-fit px-4 py-2 text-xs font-bold tracking-wide uppercase text-[#080031] bg-[#FF0000]/10 rounded-full">
              <span className="w-2 h-2 bg-[#FF0000] rounded-full mr-2"></span>
              {t('importantNotice.title')}
            </span> */}
          </div>

          {/* Legalitas Items */}
          <div className="space-y-4">
            {Array.isArray(legalitasItems) && legalitasItems.map((text: string, index: number) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md hover:border-[#FF0000]/30 transition-all duration-300"
              >
                <div className="flex items-start">
                  <FaCheckCircle className="mt-1.5 mr-3 text-[#FF0000] flex-shrink-0" />
                  <p className="text-[#080031]/90 leading-relaxed">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ProfilContainer>
      </div>
    </PageTemplate>
  );
}