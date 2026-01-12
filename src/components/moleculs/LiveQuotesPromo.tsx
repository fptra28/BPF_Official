import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "next-i18next";

export default function LiveQuotesPromo() {
  const { t } = useTranslation("produk", { useSuspense: false });

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl border border-dashed border-[#FF0000]/30 px-6 py-5 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="space-y-3 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#FF0000]/90">
            {t("liveQuotesSection.title")}
          </p>
          <h3 className="text-2xl md:text-3xl font-bold text-[#080031] leading-snug">
            {t("liveQuotesSection.description")}
          </h3>
        </div>
        <Link
          href="/produk/data-pasar-realtime"
          className="inline-flex items-center gap-3 px-6 py-3 bg-[#080031] text-white font-semibold rounded-full shadow hover:bg-[#080031]/90 transition"
        >
          {t("liveQuotesSection.cta")}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
