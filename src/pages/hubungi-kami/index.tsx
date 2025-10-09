import { FaMapMarkerAlt, FaPhone, FaFax, FaEnvelope, FaExternalLinkAlt, FaHeadset } from 'react-icons/fa';
import { useTranslation, TFunction } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import PageTemplate from "@/components/templates/PageTemplate";
import ProfilContainer from "@/components/templates/PageContainer/Container";

export const getStaticProps: GetStaticProps = async ({ locale = 'id' }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'hubungi-kami', 'footer'])),
  },
});

interface Kantor {
  kota: string;
  alamat: string;
  telepon: string;
  fax: string;
  email?: string;
  mapLink: string;
}

const kantorPusat: Kantor = {
  kota: "JAKARTA",
  alamat: "Equity Tower Lt. 47, Kawasan Niaga Terpadu Sudirman (SCBD)\nJl. Jend. Sudirman Kav. 52-53 Jakarta 12190",
  telepon: "+62 21 2903 5005 (Hunting)",
  fax: "+62 21 2903 5132",
  email: "corporate@bestprofit-futures.co.id",
  mapLink: "https://maps.google.com/?q=Equity+Tower+Jakarta"
};

const kantorCabang: Kantor[] = [
  {
    kota: "JAMBI",
    alamat: "Jl. Kolonel Abunjani No. 29 C, Sipin\nKelurahan Selamat, Kecamatan Danau Sipin, Jambi 36129",
    telepon: "0741 - 668288",
    fax: "0741 - 669100",
    mapLink: "https://maps.google.com/?q=Jl.+Kolonel+Abunjani+No.+29+C,+Jambi"
  },
  {
    kota: "JAKARTA - Pacific Place Mall",
    alamat: "Pacific Place Mall Shop Lt. 3, Unit 3 - 99\nJl. Jend. Sudirman Kav. 52-53, SCBD - Jakarta Selatan 12190",
    telepon: "021 - 5797 3015",
    fax: "021 - 5797 3515",
    mapLink: "https://maps.google.com/?q=Pacific+Place+Mall+Jakarta"
  },
  {
    kota: "PONTIANAK",
    alamat: "Komplek Sentra Bisnis A. Yani Megamall C1-C5\nJl. A. Yani, Pontianak 78121",
    telepon: "0561 - 766133",
    fax: "0561 - 766072",
    mapLink: "https://maps.google.com/?q=Sentra+Bisnis+A.+Yani+Megamall+Pontianak"
  },
  {
    kota: "MALANG",
    alamat: "BPF Tower, Jl. Letjen S. Parman No. 59 Kav. 1, 3, 4 - 5\nMalang - Jawa Timur 65122",
    telepon: "0341 - 4345999",
    fax: "0341 - 4345333",
    mapLink: "https://maps.google.com/?q=BPF+Tower+Malang"
  },
  {
    kota: "SURABAYA",
    alamat: "Graha Bukopin, Lantai 11\nJl. Panglima Sudirman No. 10 - 18, Surabaya 60271",
    telepon: "031 - 5349888",
    fax: "031 - 5340777",
    mapLink: "https://maps.google.com/?q=Graha+Bukopin+Surabaya"
  },
  {
    kota: "MEDAN",
    alamat: "Ruko Jati Junction, Jl. Perintis Kemerdekaan No. P9A-10A\nKel. Perintis, Kec. Medan Timur, Medan 20218",
    telepon: "061 - 80501610",
    fax: "061 - 80501699",
    mapLink: "https://maps.google.com/?q=Jati+Junction+Medan"
  },
  {
    kota: "BANDUNG",
    alamat: "Jl. Jakarta No. 21, Kel. Kacapiring\nKec. Batununggal, Kota Bandung 40271",
    telepon: "022 - 20504000",
    fax: "022 - 20504444",
    mapLink: "https://maps.google.com/?q=Jl.+Jakarta+No.+21+Bandung"
  },
  {
    kota: "PEKANBARU",
    alamat: "Komplek Sudirman City Square\nJl. Jend. Sudirman Blok C5-C10, Bukit Raya\nTengkerang Selatan, Pekanbaru, Riau 28288",
    telepon: "0761 - 888828",
    fax: "0761 - 888829",
    mapLink: "https://maps.google.com/?q=Sudirman+City+Square+Pekanbaru"
  },
  {
    kota: "BANJARMASIN",
    alamat: "Jl. Ahmad Yani KM. 4.5 No. 71/339, Kel. Kebun Bunga\nKec. Banjarmasin Timur - Kalimantan Selatan 70235",
    telepon: "0511 - 3263838",
    fax: "0511 - 3270808",
    mapLink: "https://maps.google.com/?q=Jl.+Ahmad+Yani+KM+4.5+Banjarmasin"
  },
  {
    kota: "BANDAR LAMPUNG",
    alamat: "Jl. Jenderal Ahmad Yani No.55\nKel. Pelita, Kec. Enggal, Kota Bandar Lampung\nLampung - 35117",
    telepon: "0721 - 5608000",
    fax: "0721 - 5605000",
    mapLink: "https://maps.google.com/?q=Jl.+Jenderal+Ahmad+Yani+No.55+Bandar+Lampung"
  },
  {
    kota: "SEMARANG",
    alamat: "Jl. Veteran No. 61, RT 5/RW 6, Kel. Lempongsari,\nKec. Gajahmungkur, Kota Semarang - Jawa Tengah 50231",
    telepon: "024 - 76444722",
    fax: "024 - 76444733",
    mapLink: "https://maps.google.com/?q=Jl.+Veteran+No.+61+Semarang"
  }
];

interface OfficeProps {
  office: typeof kantorPusat | Kantor;
  isHeadOffice?: boolean;
  t: TFunction;
}

const OfficeCard = ({ office, isHeadOffice = false, t }: OfficeProps) => (
  <div className="bg-white p-6 rounded-lg shadow">
    {isHeadOffice && (
      <p className="font-semibold mb-2">{t('companyName')}</p>
    )}
    <div className="space-y-2">
      <div className="flex items-start">
        <FaMapMarkerAlt className="text-[#FF0000] mt-0.5 mr-1.5 flex-shrink-0" size={14} />
        <p className="whitespace-pre-line text-gray-700">{office.alamat}</p>
      </div>
      <p className="text-gray-700">
        <span className="font-medium">{t('phone')}:</span> {office.telepon}
      </p>
      <p className="text-gray-700">
        <span className="font-medium">{t('fax')}:</span> {office.fax}
      </p>
      {office.email && (
        <p className="text-gray-700">
          <span className="font-medium">{t('email')}:</span>{' '}
          <a href={`mailto:${office.email}`} className="text-[#FF0000] hover:underline">
            {office.email}
          </a>
        </p>
      )}
    </div>
  </div>
);

export default function HubungiKami() {
  const { t } = useTranslation('hubungi-kami');
  
  return (
    <PageTemplate title={t('title')}>
      <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-52 my-10">
        <ProfilContainer title={t('title')}>
        
        {/* Head Office */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {t('headOffice')}
          </h2>
          <OfficeCard office={kantorPusat} isHeadOffice t={t} />
        </div>



        {/* Branch Offices */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
            {t('branchOffice')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {kantorCabang.map((cabang, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{cabang.kota}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="text-[#FF0000] mt-0.5 mr-1.5 flex-shrink-0" size={14} />
                    <p className="whitespace-pre-line text-gray-700">{cabang.alamat}</p>
                  </div>
                  <p className="text-gray-700">
                    <span className="font-medium">{t('phone')}:</span> {cabang.telepon}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">{t('fax')}:</span> {cabang.fax}
                  </p>
                  <a 
                    href={cabang.mapLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[#FF0000] hover:underline text-xs mt-1"
                  >
                    {t('viewOnMap', 'Lihat di Peta')} <FaExternalLinkAlt className="ml-1" size={10} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Online Complaint */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {t('complaintTitle')}
          </h3>
          <p className="text-gray-700 mb-4">
            {t('complaintDescription')}
          </p>
          <a 
            href="mailto:customer.care@bestprofit-futures.co.id"
            className="inline-flex items-center bg-[#FF0000] hover:bg-[#cc0000] text-white font-medium py-2 px-4 rounded transition-colors duration-300"
          >
            <FaEnvelope className="mr-2" /> {t('sendEmail')}
          </a>
        </div>
        </ProfilContainer>
      </div>
    </PageTemplate>
  );
}
