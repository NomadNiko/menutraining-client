"use client";
import { useState } from "react";
import { useTranslation } from "@/services/i18n/client";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "@/components/link";
import useAuth from "@/services/auth/use-auth";
import useAuthActions from "@/services/auth/use-auth-actions";
import { IS_SIGN_UP_ENABLED } from "@/services/auth/config";

const AuthSection = () => {
  const { t } = useTranslation("common");
  const { user, isLoaded } = useAuth();
  const { logOut } = useAuthActions();
  const [anchorElementUser, setAnchorElementUser] =
    useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElementUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElementUser(null);
  };

  if (!isLoaded) {
    return <CircularProgress color="inherit" />;
  }

  if (user) {
    return (
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Profile menu">
          <IconButton
            onClick={handleOpenUserMenu}
            sx={{ p: 0 }}
            data-testid="profile-menu-item"
          >
            <Avatar
              alt={user?.firstName + " " + user?.lastName}
              src={user.photo?.path}
            />
          </IconButton>
        </Tooltip>
        <Menu
          sx={{ mt: 5.5 }}
          id="menu-appbar"
          anchorEl={anchorElementUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElementUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem
            onClick={handleCloseUserMenu}
            component={Link}
            href="/profile"
            data-testid="user-profile"
          >
            <Typography textAlign="center">
              {t("common:navigation.profile")}
            </Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              logOut();
              handleCloseUserMenu();
            }}
            data-testid="logout-menu-item"
          >
            <Typography textAlign="center">
              {t("common:navigation.logout")}
            </Typography>
          </MenuItem>
        </Menu>
      </Box>
    );
  }

  // Guest user - show login/signup buttons
  return (
    <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" } }}>
      <Button
        sx={{ my: 2, color: "white", display: "block" }}
        component={Link}
        href="/sign-in"
      >
        {t("common:navigation.signIn")}
      </Button>
      {IS_SIGN_UP_ENABLED && (
        <Button
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

export default AuthSection;
