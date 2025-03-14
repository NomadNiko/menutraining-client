"use client";
import { useState } from "react";
import { useTranslation } from "@/services/i18n/client";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Link from "@/components/link";
import { getNavigationConfig } from "@/config/navigation";
import useAuth from "@/services/auth/use-auth";
import { IS_SIGN_UP_ENABLED } from "@/services/auth/config";

const MobileNavigation = () => {
  const { t } = useTranslation("common");
  const { user, isLoaded } = useAuth();
  const [anchorElementNav, setAnchorElementNav] = useState<null | HTMLElement>(
    null
  );

  const navItems = getNavigationConfig();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElementNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElementNav(null);
  };

  // Check if the user has the required role to view the nav item
  const hasRequiredRole = (roles?: number[]): boolean => {
    if (!roles || roles.length === 0) return true;
    if (!user?.role?.id) return false;
    return roles.map(String).includes(String(user.role.id));
  };

  return (
    <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleOpenNavMenu}
        color="inherit"
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorElementNav}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={Boolean(anchorElementNav)}
        onClose={handleCloseNavMenu}
        sx={{
          display: { xs: "block", md: "none" },
        }}
      >
        {/* Navigation Items */}
        {navItems.map((item) => {
          if (item.desktopOnly || !hasRequiredRole(item.roles)) return null;

          return (
            <MenuItem
              key={item.path}
              onClick={handleCloseNavMenu}
              component={Link}
              href={item.path}
            >
              <Typography textAlign="center">{t(item.label)}</Typography>
            </MenuItem>
          );
        })}

        {/* Authentication Items (mobile only) */}
        {isLoaded && !user && (
          <>
            <Divider />
            <MenuItem
              onClick={handleCloseNavMenu}
              component={Link}
              href="/sign-in"
            >
              <Typography textAlign="center">
                {t("common:navigation.signIn")}
              </Typography>
            </MenuItem>
            {IS_SIGN_UP_ENABLED && (
              <MenuItem
                onClick={handleCloseNavMenu}
                component={Link}
                href="/sign-up"
              >
                <Typography textAlign="center">
                  {t("common:navigation.signUp")}
                </Typography>
              </MenuItem>
            )}
          </>
        )}
      </Menu>
    </Box>
  );
};

export default MobileNavigation;
