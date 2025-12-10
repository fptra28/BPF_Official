import ProfilContainer from "@/components/templates/PageContainer/Container";
import PageTemplate from "@/components/templates/PageTemplate";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'id', ['prosedur', 'common', 'footer'])),
    },
  };
};

export default function Penarikan() {
  const { t } = useTranslation('prosedur');
  const prosesSteps = t('penarikanDana.prosesSteps', { returnObjects: true }) as string[];

  const stepsList = prosesSteps.slice(0, -1);      // langkah dengan tanda centang
  const lastStep = prosesSteps[prosesSteps.length - 1]; // kalimat penutup (T+3 / T+1)

  return (
    <PageTemplate title={t('penarikanDana.title', 'Prosedur Penarikan Dana')}>
      <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-52 my-10">
        <ProfilContainer title={t('penarikanDana.title', 'Prosedur Penarikan Dana')}>
          <div className="space-y-6 text-black text-sm sm:text-base leading-relaxed">
            {/* Paragraf pembuka */}
            <div
              className="text-justify"
              dangerouslySetInnerHTML={{
                __html: t(
                  'penarikanDana.description',
                  "Nasabah dapat melakukan penarikan dana kapan saja, dengan catatan jumlah yang ditarik tidak melebihi <span class='font-medium'>Effective Margin</span> yang tercantum dalam laporan transaksi harian (<span class='italic'>Statement Report</span>)."
                ),
              }}
            />

            {/* Langkah-langkah Penarikan Dana */}
            <div
              className="font-semibold text-black"
              dangerouslySetInnerHTML={{
                __html: t(
                  'penarikanDana.prosesTitle',
                  'Langkah-langkah Penarikan Dana:'
                ),
              }}
            />

            {/* List dengan tanda centang */}
            <ul className="space-y-2">
              {stepsList.map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 mt-0.5 text-green-600">✓</span>
                  <p
                    className="text-justify"
                    dangerouslySetInnerHTML={{ __html: step }}
                  />
                </li>
              ))}
            </ul>

            {/* Kalimat penutup di bawah list */}
            {lastStep && (
              <p
                className="text-justify"
                dangerouslySetInnerHTML={{ __html: lastStep }}
              />
            )}
          </div>
        </ProfilContainer>
      </div>
    </PageTemplate>
  );
}
