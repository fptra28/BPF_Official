import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from "next/image";
import ProfilContainer from "@/components/templates/PageContainer/Container";
import PageTemplate from "@/components/templates/PageTemplate";

type LegalitasKey =
  | 'bappebti'
  | 'ojk'
  | 'bi'
  | 'bbj'
  | 'kbi'
  | 'aspebtindo'
  | 'sitna';

type LegalitasItem = {
  id: number;
  key: LegalitasKey;
  image: string;
};

const legalitasData: LegalitasItem[] = [
  {
    id: 1,
    key: 'bappebti',
    image: "/assets/logo-kemendag.png",
  },
  {
    id: 2,
    key: 'ojk',
    image: "/assets/OJK_Logo.png",          // ⬅️ sesuaikan dengan nama file asli di project elu
  },
  {
    id: 3,
    key: 'bi',
    image: "/assets/BI_Logo.png",           // ⬅️ sesuaikan juga
  },
  {
    id: 4,
    key: 'bbj',
    image: "/assets/logo-jfx.png",
  },
  {
    id: 5,
    key: 'kbi',
    image: "/assets/logo-kbi.png",
  },
  {
    id: 6,
    key: 'aspebtindo',
    image: "/assets/logo-aspebtindo.png",   // ⬅️ sesuaikan path logo asosiasi
  },
  {
    id: 7,
    key: 'sitna',
    image: "/assets/sitna-logo.png",
  },
];

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'id', [
        'badan_regulasi',
        'common',
        'footer',
      ])),
    },
  };
}

export default function Legalitas() {
  const { t } = useTranslation('badan_regulasi');

  return (
    <PageTemplate title={t('pageTitle')} description={t('pageDescription')}>
      <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-52 my-10">
        <ProfilContainer title={t('pageTitle')}>
          <div className="space-y-16">
            <div className="mb-10 text-center">
              <p className="text-[#000000] leading-relaxed max-w-4xl mx-auto text-left">
                {t('profile_description')}
              </p>
            </div>

            <div className="space-y-12">
              {legalitasData.map((item, index) => {
                const category = t(`${item.key}.category`, {
                  defaultValue: '',
                }) as string;

                return (
                  <div
                    key={item.id}
                    className={`group flex flex-col ${
                      index % 2 === 0
                        ? 'md:flex-row'
                        : 'md:flex-row-reverse'
                    } items-center gap-8 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100`}
                  >
                    {/* Image Container */}
                    <div className="md:w-2/5 flex-shrink-0 w-full">
                      <div
                        className={`relative ${
                          item.key === 'sitna' ? 'aspect-square' : 'aspect-video'
                        } bg-white rounded-lg overflow-hidden shadow-sm p-6 border border-gray-100 transition-all duration-300 group-hover:border-[#FF0000]/20`}
                      >
                        <Image
                          src={item.image}
                          alt={t(`${item.key}.title`)}
                          fill
                          className="object-contain p-2"
                          sizes="(max-width: 768px) 100vw, 40vw"
                        />
                      </div>
                    </div>

                    {/* Text Content */}
                    <div className="md:w-3/5">
                      {/* Category Badge */}
                      {category && (
                        <span className="inline-flex items-center px-3 py-1 mb-2 text-xs font-semibold rounded-full bg-[#FF0000]/5 text-[#FF0000] border border-[#FF0000]/20 tracking-wide">
                          {category}
                        </span>
                      )}

                      <div className="flex items-center mb-3">
                        <div className="h-8 w-1 bg-[#FF0000] rounded-full mr-3"></div>
                        <h3 className="text-2xl font-bold text-[#080031] group-hover:text-[#FF0000] transition-colors duration-300">
                          {t(`${item.key}.title`)}
                        </h3>
                      </div>
                      <p className="text-[#000000]/90 text-base leading-relaxed text-justify">
                        {t(`${item.key}.description`)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ProfilContainer>
      </div>
    </PageTemplate>
  );
}
