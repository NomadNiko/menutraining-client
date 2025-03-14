"use client";
import Typography from "@mui/material/Typography";
import { useTranslation } from "@/services/i18n/client";

interface LogoProps {
  isMobile?: boolean;
}

const Logo = ({ isMobile = false }: LogoProps) => {
  const { t } = useTranslation("common");

  return (
    <Typography
      variant={isMobile ? "h5" : "h6"}
      noWrap
      component="a"
      href="/"
      sx={{
        mr: 2,
        display: isMobile
          ? { xs: "flex", md: "none" }
          : { xs: "none", md: "flex" },
        flexGrow: isMobile ? 1 : 0,
        fontWeight: 600,
        color: "inherit",
        textDecoration: "none",
      }}
    >
      {t("common:app-name")}
    </Typography>
  );
};

export default Logo;
