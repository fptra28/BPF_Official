import { FaBullseye, FaChartLine, FaHandshake, FaUsers, FaShieldAlt, FaGraduationCap, FaMapMarkerAlt } from 'react-icons/fa';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import ProfilContainer from "@/components/templates/PageContainer/Container";
import PageTemplate from "@/components/templates/PageTemplate";
import Image from "next/image";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'id', ['profil_perusahaan', 'common', 'footer'])),
    },
  };
};

export default function ProfilPerusahaan() {
  const { t } = useTranslation('profil_perusahaan');
  
  // Definisikan tipe untuk item visi misi
  type VisiMisiItem = {
    icon: React.ReactNode;
    title: string;
    description?: string;
    items: string[];
    bgColor: string;
  };

  // Dapatkan data misi terlebih dahulu
  const misiItems = t('sections.mission.items', { returnObjects: true });
  
  const visiMisiItems: VisiMisiItem[] = [
    {
      icon: <FaBullseye className="text-3xl text-blue-600" />,
      title: t('sections.vision.title'),
      description: t('sections.vision.description'),
      items: [],
      bgColor: "bg-gray-50"
    },
    {
      icon: <FaChartLine className="text-3xl text-green-600" />,
      title: t('sections.mission.title'),
      description: '',
      items: Array.isArray(misiItems) ? misiItems : [],
      bgColor: "bg-gray-50"
    }
  ];

  // Definisikan tipe untuk nilai perusahaan
  type NilaiPerusahaan = {
    icon: React.ReactNode;
    title: string;
    description: string;
  };

  const nilaiPerusahaan: NilaiPerusahaan[] = [
    {
      icon: <FaHandshake className="text-2xl text-yellow-600" />,
      title: t('sections.values.items.integrity.title'),
      description: t('sections.values.items.integrity.description')
    },
    {
      icon: <FaUsers className="text-2xl text-purple-600" />,
      title: t('sections.values.items.customerSatisfaction.title'),
      description: t('sections.values.items.customerSatisfaction.description')
    },
    {
      icon: <FaShieldAlt className="text-2xl text-red-600" />,
      title: t('sections.values.items.compliance.title'),
      description: t('sections.values.items.compliance.description')
    },
    {
      icon: <FaGraduationCap className="text-2xl text-indigo-600" />,
      title: t('sections.values.items.innovation.title'),
      description: t('sections.values.items.innovation.description')
    }
  ];

  return (
    <PageTemplate title={t('pageTitle')}>
      <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-52 my-10">
        <ProfilContainer title={t('headerTitle')}>
          {/* Deskripsi Perusahaan */}
         <section className="mb-8">
            <p className="text-lg leading-relaxed text-[#080031]/90 whitespace-pre-line">
              {t('description')}
            </p>
         </section>
          {/* Highlight Cards */}
          <section className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Legal & Membership */}
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-6">
              <h3 className="text-xl font-bold text-[#080031] mb-4">{t('sections.legal.title')}</h3>
              <ul className="space-y-3 text-[#080031]/90">
                {(t('sections.legal.items', { returnObjects: true }) as string[]).map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <FaShieldAlt className="mt-1 mr-3 text-[#FF0000]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Office Network */}
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-6">
              <h3 className="text-xl font-bold text-[#080031] mb-4">{t('sections.offices.title')}</h3>
              <div className="flex flex-wrap gap-2">
                {(t('sections.offices.cities', { returnObjects: true }) as string[]).map((city, idx) => (
                  <span key={`${city}-${idx}`} className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-[#FF0000]/10 text-[#080031] border border-[#FF0000]/20">
                    <FaMapMarkerAlt className="mr-1.5 text-[#FF0000]" />
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </ProfilContainer>
      </div>
    </PageTemplate>
  );
}
