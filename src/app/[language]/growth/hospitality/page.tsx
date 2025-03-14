import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import HospitalityPortfolioPageContainer from "./page-container";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "hospitality");
  return {
    title: t("title") || "Niko Halley - Hospitality Portfolio",
    description: t("description") || "Versatile hospitality professional with experience in customer service, hotel operations, and restaurant management across global destinations."
  };
}

export default function HospitalityPortfolioPage() {
  return <HospitalityPortfolioPageContainer />;
}