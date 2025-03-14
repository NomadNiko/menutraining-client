'use client';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useTranslation } from "@/services/i18n/client";
import TemplateCreateCard from '@/components/cards/create-cards/TemplateCreateCard';

export default function TemplateCreationPageContent() {
  const { t } = useTranslation("templates");

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t("templateCreation")} 
      </Typography>
      <Typography color="text.secondary" paragraph>
        {t("subtitle")}  
      </Typography>
      <TemplateCreateCard />
    </Container>
  );
}