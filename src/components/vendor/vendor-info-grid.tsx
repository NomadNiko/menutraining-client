import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTranslation } from "@/services/i18n/client";
import { VendorInfoGridProps } from "./types";

export const VendorInfoGrid: React.FC<VendorInfoGridProps> = ({
  email,
  phone,
  address,
  city,
  state,
  postalCode,
  adminNotes,
  vendorStatus,
}) => {
  const { t } = useTranslation("vendor-admin");

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
        gap: 2,
      }}
    >
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          {t("contact")}
        </Typography>
        <Typography>{email}</Typography>
        <Typography>{phone}</Typography>
      </Box>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          {t("location")}
        </Typography>
        <Typography>{address}</Typography>
        <Typography>
          {city}, {state} {postalCode}
        </Typography>
      </Box>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          {t("adminNotes")}
        </Typography>
        <Typography>
          {adminNotes || t("noAdminNotes")}
        </Typography>
      </Box>
      <Box>
        <Typography
          sx={{
            fontSize: "1.2rem",
          }}
          variant="subtitle2"
          color="success.light"
        >
          {t("status")}
        </Typography>
        <Typography
          sx={{
            fontSize: "1.2rem",
          }}
          color="warning.main"
        >
          {vendorStatus}
        </Typography>
      </Box>
    </Box>
  );
};