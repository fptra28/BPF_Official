import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import ProfilContainer from "@/components/templates/PageContainer/Container";
import PageTemplate from "@/components/templates/PageTemplate";
import RegistrationFlow from '@/components/organisms/RegistrationFlow';

export const getStaticProps: GetStaticProps = async ({ locale = 'id' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'prosedur', 'footer'])),
    },
  };
};

const RegistrasiOnline = () => {
  const { t } = useTranslation('prosedur');

  return (
    <PageTemplate title={t('registrasiOnline.title', 'Registrasi Online')}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 my-6">
        <ProfilContainer title={t('registrasiOnline.pageTitle', 'PROSEDUR PEMBUKAAN REKENING (REGISTRASI ONLINE)')}>
          <div className="space-y-8 text-[#080031] text-sm sm:text-base leading-relaxed">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative w-full">
                <Image
                  src="/assets/regol-bpf.jpg"
                  alt="Registrasi Online BPF"
                  width={1200}
                  height={800}
                  layout="responsive"
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
              <RegistrationFlow />
            </div>
          </div>
        </ProfilContainer>
      </div>
    </PageTemplate>
  );
};

export default RegistrasiOnline;
