import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@/components/link";
import { useTranslation } from "@/services/i18n/client";
import { IS_SIGN_UP_ENABLED } from "@/services/auth/config";

interface GuestButtonsProps {
  onClose: () => void;
}

export const GuestButtons: React.FC<GuestButtonsProps> = ({ onClose }) => {
  const { t } = useTranslation("common");

  return (
    <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" } }}>
      <Button
        onClick={onClose}
        sx={{ my: 2, color: "white", display: "block" }}
        component={Link}
        href="/sign-in"
      >
        {t("common:navigation.signIn")}
      </Button>
      {IS_SIGN_UP_ENABLED && (
        <Button
          onClick={onClose}
          sx={{ my: 2, color: "white", display: "block" }}
          component={Link}
          href="/sign-up"
        >
          {t("common:navigation.signUp")}
        </Button>
      )}
    </Box>
  );
};