"use client";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useTranslation } from "@/services/i18n/client";
import VendorCreateCard from "@/components/cards/create-cards/VendorCreateCard";

export default function VendorOnboardingPage() {
  const { t } = useTranslation("onboard");
  
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            {t("title")}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {t("description")}
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <VendorCreateCard />
        </Grid>
      </Grid>
    </Container>
  );
}