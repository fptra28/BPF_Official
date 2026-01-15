import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import PageTemplate from "@/components/templates/PageTemplate";
import ProfilContainer from "@/components/templates/PageContainer/Container";
import LiveQuotesTable from "@/components/organisms/LiveQuotesTable";

export const getStaticProps: GetStaticProps = async ({ locale = "id" }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "footer", "market"])),
    },
  };
};

export default function LiveQuotesPage() {
  const { t } = useTranslation("market");

  return (
    <PageTemplate title={t("marketTitle")}>
      <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-52 my-10">
        <ProfilContainer
          title={t("marketTitle")}
          description={t("marketSubtitle")}
          descriptionClassName="sm:max-w-none sm:whitespace-nowrap sm:overflow-hidden sm:text-ellipsis"
        >
          <LiveQuotesTable />
          <div className="mt-8 overflow-hidden rounded-lg border border-gray-200 bg-[#0F0F0F]">
            <iframe
              title="nm-chart"
              allow="fullscreen"
              allowFullScreen
              loading="lazy"
              style={{ width: "100%", height: 520 }}
              src="https://s.tradingview.com/embed-widget/advanced-chart/?symbol=OANDA:XAUUSD&interval=D&theme=dark&style=1&locale=en&allow_symbol_change=true&hide_side_toolbar=true&hide_top_toolbar=false&hide_legend=false&hide_volume=true&exclude_studies=STD%3BVolume&details=true&autosize=true&backgroundColor=%230F0F0F&gridColor=rgba(242,242,242,0.06)&timezone=Etc/UTC&studies=STD%3BStochastic_RSI"
            />
          </div>
        </ProfilContainer>
      </div>
    </PageTemplate>
  );
}
