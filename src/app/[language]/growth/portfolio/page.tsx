import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import PortfolioPageContainer from "./page-container";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "portfolio");
  return {
    title: t("title"),
    description: t("description")
  };
}

export default function PortfolioPage() {
  return <PortfolioPageContainer />;
}