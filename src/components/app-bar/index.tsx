"use client";
// import { useTranslation } from "@/services/i18n/client";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

// Import components
import Logo from "./logo";
import DesktopNavigation from "./desktop-navigation";
import MobileNavigation from "./mobile-navigation";
import AuthSection from "./auth-section";
import ThemeSwitchButton from "@/components/switch-theme-button";

const ResponsiveAppBar = () => {
  // const { t } = useTranslation("common");

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Desktop Logo */}
          <Logo />

          {/* Mobile Navigation */}
          <MobileNavigation />

          {/* Mobile Logo */}
          <Logo isMobile />

          {/* Desktop Navigation */}
          <DesktopNavigation />

          {/* Theme Switch Button */}
          <Box
            sx={{
              display: "flex",
              mr: 1,
            }}
          >
            <ThemeSwitchButton />
          </Box>

          {/* Authentication Section */}
          <AuthSection />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default ResponsiveAppBar;
