import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { LifeBuoy } from "lucide-react";

interface ServiceAdminHeaderProps {
  t: (key: string) => string;
}

const ServiceAdminHeader = ({ t }: ServiceAdminHeaderProps) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <LifeBuoy size={32} />
        <Typography variant="h4">{t("title")}</Typography>
      </Box>
      <Typography color="text.secondary" paragraph>
        {t("subtitle")}
      </Typography>
    </Box>
  );
};

export default ServiceAdminHeader;
