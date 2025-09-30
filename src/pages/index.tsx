// Home

import { useState, useEffect, useRef } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PageTemplate from "@/components/templates/PageTemplate";
import CarouselWithContent from "@/components/organisms/CarouselWithContent";
import ProdukContainer from "@/components/organisms/ProdukContainer";
import AboutUs from "@/components/organisms/AboutUs";
import Iso from "@/components/organisms/Market";
import Pengumuman from "@/components/organisms/Pengumuman";
import dynamic from 'next/dynamic';

// Gunakan dynamic import dengan ssr: false untuk mencegah masalah dengan window object
const WelcomeModal = dynamic(
  () => import('@/components/moleculs/SimpleWelcomeModal'),
  { ssr: false }
);
import WakilPialangSection from "@/components/organisms/WakilPialangSection";
import BeritaSection from "@/components/organisms/BeritaSection";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'id', [
        'common', 
        'pengumuman', 
        'market',
        'berita',
        'produk',
        'aboutus',
        'welcome',
        'footer',
        'wakil_pialang'
      ])),
    },
  };
};


// Gunakan dynamic import untuk mencegah error SSR
const DynamicWelcomeModal = dynamic(
  () => import('@/components/moleculs/SimpleWelcomeModal'),
  { ssr: false, loading: () => null }
);

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const hasShownModal = useRef(false);
  
  useEffect(() => {
    // Pastikan kode ini hanya berjalan di client-side
    if (typeof window === 'undefined' || hasShownModal.current) return;
    
    // Cek apakah modal sudah pernah ditampilkan di session ini
    const hasSeenModal = sessionStorage.getItem('hasSeenWelcomeModal');
    
    if (!hasSeenModal) {
      // Tampilkan modal setelah 1 detik
      const timer = setTimeout(() => {
        // Tampilkan modal di semua perangkat
        setShowModal(true);
        sessionStorage.setItem('hasSeenWelcomeModal', 'true');
        hasShownModal.current = true;
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseModal = () => setShowModal(false);

  return (
    <PageTemplate>
      <div className="fixed top-4 right-4 z-50">
      </div>
      
      {/* Welcome Modal */}
      <DynamicWelcomeModal isOpen={showModal} onClose={handleCloseModal} />

      {/* Carousel */}
      <CarouselWithContent />

      {/* Content */}
      <div className="py-10 bg-gray-50 space-y-10">
        <div className="space-y-10 mb-20">
          <div className="sm:px-6 md:px-10 lg:px-20 xl:px-36 2xl:px-52">
            <AboutUs />
          </div>

          <hr className="border-gray-200" />

          <div className="sm:px-6 md:px-10 lg:px-20 xl:px-36 2xl:px-52">
            <ProdukContainer />
          </div>

          <hr className="border-gray-200" />

          <div className="sm:px-6 md:px-10 lg:px-20 xl:px-36 2xl:px-52">
            <BeritaSection limit={3} className="mx-auto flex flex-col gap-7" />
          </div>
        </div>

        <hr className="border-gray-200 " />

        <Iso />

        <hr className="border-gray-200" />

        <div className="sm:px-6 md:px-10 lg:px-20 xl:px-36 2xl:px-52">
          <WakilPialangSection />
        </div>

        <hr className="border-gray-200" />

        <div className="sm:px-6 md:px-10 lg:px-20 xl:px-36 2xl:px-52 my-5">
          <Pengumuman showHeader={true} className="mx-auto px-4" />
        </div>
      </div>
    </PageTemplate>
  );
}
