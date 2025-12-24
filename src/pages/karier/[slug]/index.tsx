import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import PageTemplate from '@/components/templates/PageTemplate';
import Container from '@/components/templates/PageContainer/Container';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import { fetchKarierDetail, KarierItem } from '@/services/karierService';
import ApplyModal from '@/components/moleculs/ApplyModal';
import ApplyForm, { ApplyFormValues } from '@/components/moleculs/ApplyForm';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'id', ['common', 'footer'])),
    },
  };
};

export default function KarierDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<KarierItem | null>(null);
  const [openApply, setOpenApply] = useState(false);

  const handleOpenApply = () => setOpenApply(true);
  const handleCloseApply = () => setOpenApply(false);
  const handleSubmitApply = (values: ApplyFormValues) => {
    // UI-only: for now just log and close
    console.log('Kirim Lamaran:', { slug, ...values });
    setOpenApply(false);
  };

  // Load detail from backend
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!slug) return;
      try {
        const detail = await fetchKarierDetail(String(slug));
        if (!mounted) return;
        setData(detail);
      } catch (e) {
        console.error('Gagal memuat detail karier:', e);
        setData(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [slug]);

  const TitleSkeleton = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-7 bg-gray-200 rounded w-2/3"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      <div className="h-5 bg-gray-200 rounded w-1/4 mt-4"></div>
      <div className="h-40 bg-gray-100 rounded mt-6"></div>
      <div className="h-40 bg-gray-100 rounded mt-4"></div>
    </div>
  );

  const formatHtml = (html: string) => {
    if (!html) return html;
    try {
      return html
        .replace(/<p(\s+[^>]*)?>/g, (match, p1) => `<p class="mb-4 leading-relaxed"${p1 || ''}>`)
        .replace(/<h2/g, '<h2 class="text-2xl font-bold mt-6 mb-3 text-gray-800"')
        .replace(/<h3/g, '<h3 class="text-xl font-semibold mt-5 mb-2 text-gray-800"')
        .replace(/<ul/g, '<ul class="list-disc pl-6 space-y-2 my-3"')
        .replace(/<ol/g, '<ol class="list-decimal pl-6 space-y-2 my-3"')
        .replace(/<a/g, '<a class="text-[#FF0000] hover:text-[#e60000] hover:underline"')
        .replace(/<blockquote/g, '<blockquote class="border-l-4 border-[#080031] pl-4 italic my-4 text-gray-600"')
        .replace(/<img/g, '<img class="my-4 rounded-lg shadow-md w-full h-auto"');
    } catch {
      return html;
    }
  };

  const formatDateShort = (input?: string) => {
    if (!input) return '';
    try {
      return new Date(input).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return input || '';
    }
  };

  return (
    <PageTemplate title={"Karier"}>
      <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-52 my-10">
        <Container title={"Bergabunglah dengan tim kami"}>
          {loading || !data ? (
            <TitleSkeleton />
          ) : (
            <div className="space-y-8">
              {/* Header Card */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{data.posisi}</h1>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-[#080031]/10 text-[#080031]">
                      {data.nama_kota}
                    </span>
                  </div>
                </div>
                <div className="w-full sm:w-auto flex flex-col items-start sm:items-end gap-2">
                  {data.created_at && (
                    <div className="text-sm text-gray-600">
                      Dibuat: <span className="font-medium text-gray-800">{formatDateShort(data.created_at)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <section className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Responsibilities</h2>
                  <div className="h-1 w-16 bg-[#FF0000] rounded mb-4"></div>
                  <div
                    className="prose max-w-none text-gray-800"
                    dangerouslySetInnerHTML={{ __html: formatHtml(data.responsibilities) }}
                  />
                </section>

                <section className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Qualifications</h2>
                  <div className="h-1 w-16 bg-[#FF0000] rounded mb-4"></div>
                  <div
                    className="prose max-w-none text-gray-800"
                    dangerouslySetInnerHTML={{ __html: formatHtml(data.qualifications) }}
                  />
                </section>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleOpenApply}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-[#080031] text-white hover:bg-[#0a0045] transition-colors"
                >
                  Lamar Sekarang
                </button>

                <Link
                  href="/karier"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Kembali
                </Link>
              </div>

              {/* Apply Modal */}
              <ApplyModal open={openApply} title={`Lamar: ${data.posisi}`} onClose={handleCloseApply}>
                <ApplyForm
                  onCancel={handleCloseApply}
                  onSubmit={handleSubmitApply}
                />
              </ApplyModal>
            </div>
          )}
        </Container>
      </div>
    </PageTemplate>
  );
}

