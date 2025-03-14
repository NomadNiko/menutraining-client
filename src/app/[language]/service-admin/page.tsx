import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import ServiceAdminPageContainer from "./page-container";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "service-desk");
  return {
    title: t("adminPage.title"),
  };
}

export default function ServiceAdminPage() {
  return <ServiceAdminPageContainer />;
}