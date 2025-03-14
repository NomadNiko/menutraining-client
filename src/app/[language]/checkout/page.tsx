import type { Metadata } from "next";
import CheckoutPageContainer from "./page-container";
import { getServerTranslation } from "@/services/i18n";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "checkout");
  return {
    title: t("title"),
  };
}

export default function CheckoutPage() {
  return <CheckoutPageContainer />;
}