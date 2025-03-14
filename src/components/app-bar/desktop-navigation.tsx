"use client";
import { useTranslation } from "@/services/i18n/client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@/components/link";
import { getNavigationConfig } from "@/config/navigation";
import useAuth from "@/services/auth/use-auth";

interface DesktopNavigationProps {
  onCloseMenu?: () => void;
}

const DesktopNavigation = ({ onCloseMenu }: DesktopNavigationProps) => {
  const { t } = useTranslation("common");
  const { user } = useAuth();
  const navItems = getNavigationConfig();

  // Check if the user has the required role to view the nav item
  const hasRequiredRole = (roles?: number[]): boolean => {
    if (!roles || roles.length === 0) return true;
    if (!user?.role?.id) return false;
    return roles.map(String).includes(String(user.role.id));
  };

  return (
    <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
      {navItems.map((item) => {
        if (item.mobileOnly || !hasRequiredRole(item.roles)) return null;

        return (
          <Button
            key={item.path}
            onClick={onCloseMenu}
            sx={{ my: 2, color: "white", display: "block" }}
            component={Link}
            href={item.path}
          >
            {t(item.label)}
          </Button>
        );
      })}
    </Box>
  );
};

export default DesktopNavigation;
