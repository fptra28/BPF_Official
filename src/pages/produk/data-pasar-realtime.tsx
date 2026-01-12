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
        <ProfilContainer title={t("marketTitle")} description={t("marketSubtitle")}>
          <LiveQuotesTable />
        </ProfilContainer>
      </div>
    </PageTemplate>
  );
}
