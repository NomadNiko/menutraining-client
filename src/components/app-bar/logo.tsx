import { styled } from "@mui/material/styles";
import Typography, { TypographyProps } from "@mui/material/Typography";
import { useTranslation } from "@/services/i18n/client";

type LogoTypographyProps = TypographyProps<"a", { component: "a" }>;

const StyledLogoTypography = styled(Typography)<LogoTypographyProps>(({ theme }) => ({
  marginRight: theme.spacing(2),
  display: "none",
  fontWeight: 700,
  fontFamily: "Iceland, serif",
  fontSize: "1.5rem",
  color: "inherit",
  textDecoration: "none",
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

export const Logo = () => {
  const { t } = useTranslation("common");
  return (
    <StyledLogoTypography variant="h6" noWrap component="a" href="/">
      {t("common:app-name")}
    </StyledLogoTypography>
  );
};