import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import ProductItemEditPageContainer from "./page-container";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "product-items");
  return {
    title: t("editItem"),
  };
}

export default function ProductItemEditPage() {
  return <ProductItemEditPageContainer />;
}