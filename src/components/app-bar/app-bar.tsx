"use client";
import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import useAuth from "@/services/auth/use-auth";
import useAuthActions from "@/services/auth/use-auth-actions";
import { useCartQuery } from "@/hooks/use-cart-query";

import { Logo } from "@/components/app-bar/logo";
import { MobileLogo } from "@/components/app-bar/mobile-logo";
import { NavItems } from "@/components/app-bar/nav-items";
import { MobileMenu } from "@/components/app-bar/mobile-menu";
import { UserMenu } from "@/components/app-bar/user-menu";
import { CartButton } from "@/components/app-bar/cart-button";
import { GuestButtons } from "@/components/app-bar/guest-buttons";

function ResponsiveAppBar() {
  const { user, isLoaded } = useAuth();
  const { logOut } = useAuthActions();
  const { data: cartData, isLoading: isCartLoading } = useCartQuery();

  const [navMenuAnchor, setNavMenuAnchor] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setNavMenuAnchor(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setNavMenuAnchor(null);
  };

  const handleCloseUserMenu = () => {
    setUserMenuAnchor(null);
  };

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Logo />

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
            <MobileMenu
              anchorEl={navMenuAnchor}
              user={user}
              isLoaded={isLoaded}
              onClose={handleCloseNavMenu}
            />
          </Box>

          <MobileLogo />

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <NavItems user={user} onClose={handleCloseNavMenu} />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            {user && (
              <CartButton
                itemCount={cartData?.items?.length || 0}
                isLoading={isCartLoading}
                
              />
            )}

            {!isLoaded ? (
              <CircularProgress color="inherit" />
            ) : user ? (
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
                <UserMenu
                  anchorEl={userMenuAnchor}
                  onClose={handleCloseUserMenu}
                  onLogout={logOut}
                />
              </Box>
            ) : (
              <GuestButtons onClose={handleCloseNavMenu} />
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;