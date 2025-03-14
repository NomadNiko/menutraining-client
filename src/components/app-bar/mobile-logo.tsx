import Typography from "@mui/material/Typography";
import { useTranslation } from "@/services/i18n/client";

export const MobileLogo = () => {
  const { t } = useTranslation("common");
  return (
    <Typography
      variant="h5"
      noWrap
      component="a"
      href="/"
      sx={{
        mr: 2,
        display: { xs: "flex", md: "none" },
        flexGrow: 1,
        fontSize: "1.5rem",
        fontFamily: "Iceland, serif",
        fontWeight: 700,
        color: "inherit",
        textDecoration: "none",
      }}
    >
      {t("common:app-name")}
    </Typography>
  );
};