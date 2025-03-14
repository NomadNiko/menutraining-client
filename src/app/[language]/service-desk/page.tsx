import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import ServiceDeskPageContainer from "./page-container";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "service-desk");
  return {
    title: t("title"),
  };
}

export default function ServiceDeskPage() {
  return <ServiceDeskPageContainer />;
}
