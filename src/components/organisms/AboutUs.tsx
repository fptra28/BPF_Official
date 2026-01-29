import { Building, CheckCircle, MapPin, ArrowRight } from "lucide-react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Organization {
  name: string;
  logo: string;
  url: string;
}

interface AboutUsTranslation {
  title: string;
  welcome: string;
  companyName: string;
  trustedPartner: string;
  aboutText: string;
  ourPresence: string;
  presenceText: string;
  locations: string[];
  learnMore: string;
  partnersTitle: string;
  organizations: Organization[];
}

function AboutUs() {
  const { t, i18n, ready } = useTranslation("aboutus");
  const router = useRouter();
  const { locale } = router;

  useEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale, i18n]);

  if (!ready) {
    return (
      <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-[#9B9FA7]/20 rounded w-1/3 mx-auto"></div>
            <div className="h-4 bg-[#9B9FA7]/20 rounded w-1/2 mt-4 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  const organizations = t("organizations", {
    returnObjects: true,
  }) as Organization[];

  return (
    <section className="relative py-16">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[80%] h-64 bg-gradient-to-r from-[#080031]/5 to-[#FF0000]/5 rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 text-sm font-semibold text-[#FF0000] bg-[#FF0000]/10 rounded-full mb-4">
            {t("title")}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#080031] mb-6">
            {t("welcome")}{" "}
            <span className="text-[#FF0000]">{t("companyName")}</span>
          </h2>
          <div className="w-24 h-1.5 bg-[#FF0000] mx-auto rounded-full"></div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12">
          {/* Mobile Image Section */}
          <div className="lg:hidden relative h-[32rem] w-full rounded-xl overflow-hidden shadow-xl border-4 border-white">
            <Image
              src="/assets/gedung-kpf.png"
              alt="Bestprofit Futures Office"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>

          {/* Content Section */}
          <div className="space-y-8 order-2">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[#080031]">
                {t("trustedPartner")}
              </h3>
              <div className="space-y-4 text-[#080031]/90 leading-relaxed text-lg">
                {t("aboutText")
                  .split("\n")
                  .map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h4 className="text-lg font-semibold text-[#080031] mb-4 flex items-center">
                <Building className="h-5 w-5 text-[#FF0000] mr-2" />
                {t("ourPresence")}
              </h4>
              <p className="text-[#080031]/80 mb-4">{t("presenceText")}</p>
              <div className="grid grid-cols-2 gap-3">
                {(t("locations", { returnObjects: true }) as string[]).map(
                  (location: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <MapPin className="h-5 w-5 text-[#FF0000] mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-[#080031]/90">{location}</span>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/profil/perusahaan"
                className="flex items-center justify-center px-8 py-3.5 bg-[#FF0000] hover:bg-[#FF3333] text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg lg:inline-flex lg:justify-start"
              >
                {t("learnMore")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Desktop Image Section */}
          <div className="hidden lg:block order-1">
            <div className="relative h-full rounded-xl overflow-hidden shadow-xl border-4 border-white">
              <Image
                src="/assets/gedung-kpf.png"
                alt="Bestprofit Futures Office"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            </div>
          </div>
        </div>

        {/* Organizations Section */}
        <div className="mt-20 pt-12 border-t border-gray-100">
          <h2 className="text-2xl font-bold text-center text-[#080031] mb-8 relative">
            <span className="relative z-10 px-6 py-1 bg-white">
              {t("partnersTitle")}
            </span>
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -z-0"></div>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.map((org: Organization, index: number) => (
              <a
                key={index}
                href={org.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#FF0000]/50 hover:-translate-y-1"
              >
                <div className="relative w-48 h-16">
                  <Image
                    src={org.logo}
                    alt={org.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
