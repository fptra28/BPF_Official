import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import PageTemplate from "@/components/templates/PageTemplate";
import ProfilContainer from "@/components/templates/PageContainer/Container";
import Image from "next/image";

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'id', ['mekanisme-perdagangan', 'common', 'footer'])),
  },
});

const MekanismePerdaganganPage = () => {
    const { t } = useTranslation('mekanisme-perdagangan');
    const tableData = t('comparison.rows', { returnObjects: true });

    return (
        <PageTemplate title={`${t('title')} - PT. Kresna Berjangka Investama`}>
            <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-52 my-10">
                <ProfilContainer title={t('title')}>
                    <div className="space-y-10">
                        {/* Explanation Section */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white p-8 rounded-xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow duration-300">
                                <h2 className="text-2xl font-bold text-[#000000] mb-4">
                                    {t('multilateral.title')}
                                </h2>
                                <p className="text-[#000000] leading-relaxed">
                                    {t('multilateral.description')}
                                </p>
                            </div>
                            <div className="bg-white p-8 rounded-xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow duration-300">
                                <h2 className="text-2xl font-bold text-[#000000] mb-4">
                                    {t('bilateral.title')}
                                </h2>
                                <p className="text-[#000000] leading-relaxed">
                                    {t('bilateral.description')}
                                </p>
                            </div>
                        </div>

                        {/* Table Section */}
                        <div className="pt-4">
                            <h2 className="text-2xl font-bold text-center text-[#000000] mb-2">
                                {t('comparison.title')}
                            </h2>
                            <div className="w-20 h-1 bg-[#FF0000] mx-auto mb-8"></div>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="border border-[#E5E7EB] p-4 font-semibold text-white text-center bg-[#080031]">
                                                {t('multilateral.tableHeader')}
                                            </th>
                                            <th className="border border-[#E5E7EB] p-4 font-semibold text-white text-center bg-[#080031]">
                                                {t('bilateral.tableHeader')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(tableData) && tableData.map((row: any, index: number) => (
                                            <tr key={index} className="hover:bg-[#F9FAFB] transition-colors">
                                                <td className="border border-[#E5E7EB] p-4 text-[#000000]">{row.multilateral}</td>
                                                <td className="border border-[#E5E7EB] p-4 text-[#000000]">{row.bilateral}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Flowchart Section */}
                        <div className="pt-4">
                            <h2 className="text-2xl font-bold text-center text-[#000000] mb-2">
                                {t('flow.title')}
                            </h2>
                            <div className="w-20 h-1 bg-[#FF0000] mx-auto mb-10"></div>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow duration-300">
                                    <h3 className="text-xl font-bold text-center text-[#000000] mb-6">
                                        {t('multilateral.flowTitle')}
                                    </h3>
                                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-[#E5E7EB]">
                                        <Image 
                                            src="/assets/MEKANISME PERDAGANGAN BPF-03.png" 
                                            alt={t('multilateral.flowTitle')} 
                                            width={600}
                                            height={450}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow duration-300">
                                    <h3 className="text-xl font-bold text-center text-[#000000] mb-6">
                                        {t('bilateral.flowTitle')}
                                    </h3>
                                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-[#E5E7EB]">
                                        <Image 
                                            src="/assets/MEKANISME PERDAGANGAN BPF-02.png"
                                            alt={t('bilateral.flowTitle')}
                                            width={600}
                                            height={450}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ProfilContainer>
            </div>
        </PageTemplate>
    );
};

export default MekanismePerdaganganPage;
