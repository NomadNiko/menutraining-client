import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import TemplateEditPageContainer from "./page-container";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "templates");
  return {
    title: t("editTemplate"),
  };
}

export default function TemplateEditPage() {
  return <TemplateEditPageContainer />;
}
