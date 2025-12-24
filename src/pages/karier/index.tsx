import { useEffect, useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import PageTemplate from '@/components/templates/PageTemplate';
import Container from '@/components/templates/PageContainer/Container';
import CareerCard from '@/components/moleculs/CareerCard';
import { fetchKarierList } from '@/services/karierService';
import ApplyModal from '@/components/moleculs/ApplyModal';
import ApplyForm, { ApplyFormValues } from '@/components/moleculs/ApplyForm';

type JobItem = {
  id: number;
  posisi: string;
  nama_kota: string;
  email: string;
  slug: string;
  created_at?: string;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'id', ['common', 'footer'])),
    },
  };
};

export default function KarierIndex() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [openApply, setOpenApply] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);

  const handleOpenApply = (job: JobItem) => {
    setSelectedJob(job);
    setOpenApply(true);
  };
  const handleCloseApply = () => {
    setOpenApply(false);
    setSelectedJob(null);
  };
  const handleSubmitApply = (values: ApplyFormValues) => {
    // UI-only: just log for now
    console.log('Kirim Lamaran (Index):', { job: selectedJob, ...values });
    setOpenApply(false);
    setSelectedJob(null);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await fetchKarierList();
        if (!mounted) return;
        const mapped = list.map(item => ({
          id: item.id,
          posisi: item.posisi,
          nama_kota: item.nama_kota,
          email: item.email,
          slug: item.slug,
          created_at: item.created_at,
        }));
        setJobs(mapped);
      } catch (e) {
        console.error('Gagal memuat karier:', e);
        setJobs([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const LoadingGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-28 bg-gray-200 rounded-xl mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      ))}
    </div>
  );

  return (
    <PageTemplate title="Karier">
      <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-52 my-10">
        <Container title="Karier" description="Temukan peluang karier terbaik di PT. BestProfit Futures.">
          {loading ? (
            <LoadingGrid />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {jobs.map((job, idx) => (
                <div
                  key={job.id}
                  className="transform transition-transform duration-300 hover:-translate-y-1"
                  data-aos="fade-up"
                  data-aos-delay={`${(idx % 3) * 100}`}
                >
                  <CareerCard
                    posisi={job.posisi}
                    nama_kota={job.nama_kota}
                    created_at={job.created_at}
                    email={job.email}
                    slug={job.slug}
                    onApplyClick={() => handleOpenApply(job)}
                    disabled={false}
                  />
                </div>
              ))}
            </div>
          )}
        </Container>
      </div>
      {/* Apply Modal */}
      <ApplyModal open={openApply} title={selectedJob ? `Lamar: ${selectedJob.posisi}` : 'Lamar Pekerjaan'} onClose={handleCloseApply}>
        <ApplyForm
          onCancel={handleCloseApply}
          onSubmit={handleSubmitApply}
        />
      </ApplyModal>
    </PageTemplate>
  );
}

