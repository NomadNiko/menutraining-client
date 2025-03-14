import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import DashboardPageContainer from "./page-container";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "profile");
  return {
    title: t("dashboard.title"),
  };
}

export default function DashboardPage() {
  return <DashboardPageContainer />;
}