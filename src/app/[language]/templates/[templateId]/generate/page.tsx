import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import ProductGenerationPageContainer from "./page-container";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "templates");
  return {
    title: t("generateProducts"),
  };
}

export default function ProductGenerationPage() {
  return <ProductGenerationPageContainer />;
}