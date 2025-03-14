import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useRouter } from 'next/navigation';
import { useTranslation } from "@/services/i18n/client";
import { DashboardSection } from "./common";

export const VendorOnboardingSection = () => {
  const { t } = useTranslation("onboard");
  const router = useRouter();

  return (
    <DashboardSection>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          {t("dashboard.title")}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {t("dashboard.subtitle")}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {t("dashboard.body")}
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => router.push('/onboard')}
        >
          {t("dashboard.button")}
        </Button>
      </Box>
    </DashboardSection>
  );
};