import type { Metadata } from "next";
import { getServerTranslation } from "@/services/i18n";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";
import { COMPANY_EMAIL } from "@/config/constants";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "privacy-policy");
  return {
    title: t("title"),
  };
}

async function PrivacyPolicy(props: Props) {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "privacy-policy");

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography
        variant="h2"
        component="h1"
        data-testid="privacy-policy-title"
        gutterBottom
        sx={{ fontWeight: "bold" }}
      >
        {t("title")}
      </Typography>

      <Typography gutterBottom paragraph>
        {t("lastUpdated")}
      </Typography>

      <Typography
        data-testid="privacy-policy-description"
        gutterBottom
        paragraph
      >
        {t("description1")}
      </Typography>

      <Typography gutterBottom paragraph>
        {t("description2")}
      </Typography>

      <Typography gutterBottom paragraph sx={{ mt: 4 }}>
        {t("contact_info")}
      </Typography>

      <Typography paragraph>
        <MuiLink
          target="_blank"
          rel="external noopener noreferrer"
          href={`mailto:${COMPANY_EMAIL}`}
        >
          {COMPANY_EMAIL}
        </MuiLink>
      </Typography>
    </Container>
  );
}

export default PrivacyPolicy;
