import { useState } from 'react';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Link from "@/components/link";
import { useTranslation } from "@/services/i18n/client";
import { IS_SIGN_UP_ENABLED } from "@/services/auth/config";
import Divider from "@mui/material/Divider";
import { User } from "@/services/api/types/user";
import { getNavItems } from "./nav-items";
import { ChevronDown } from 'lucide-react';
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";

interface MobileMenuProps {
  anchorEl: HTMLElement | null;
  user: User | null;
  isLoaded: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  anchorEl,
  user,
  isLoaded,
  onClose,
}) => {
  const { t } = useTranslation("common");
  const { regularItems, adminGroup, productGroup } = getNavItems(user);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(false);

  const handleAdminClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsAdminOpen(!isAdminOpen);
  };

  const handleProductClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsProductOpen(!isProductOpen);
  };

  const handleMenuClose = () => {
    setIsAdminOpen(false);
    setIsProductOpen(false);
    onClose();
  };

  return (
    <Menu
      id="menu-appbar"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      sx={{
        display: { xs: "block", md: "none" },
      }}
    >
      {regularItems.map((item) => (
        <MenuItem key={item.key} onClick={handleMenuClose} component={Link} href={item.path}>
          <Typography textAlign="center">
            {t(`common:navigation.${item.key}`)}
          </Typography>
        </MenuItem>
      ))}

      {productGroup && (
        <>
          <Divider />
          <MenuItem
            onClick={handleProductClick}
            sx={{
              color: 'primary.main',
              fontWeight: 'bold'
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              width: '100%',
              justifyContent: 'space-between'
            }}>
              <Typography>
                {t(`common:navigation.${productGroup.groupName.toLowerCase()}`)}
              </Typography>
              <ChevronDown 
                size={16}
                style={{ 
                  transform: isProductOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s'
                }}
              />
            </Box>
          </MenuItem>
          <Collapse in={isProductOpen}>
            {productGroup.items.map((item) => (
              <MenuItem
                key={item.key}
                onClick={handleMenuClose}
                component={Link}
                href={item.path}
                sx={{ 
                  pl: 4,
                  bgcolor: 'rgba(0, 0, 0, 0.1)'
                }}
              >
                <Typography textAlign="center">
                  {t(`common:navigation.${item.key}`)}
                </Typography>
              </MenuItem>
            ))}
          </Collapse>
        </>
      )}

      {adminGroup && (
        <>
          <Divider />
          <MenuItem
            onClick={handleAdminClick}
            sx={{
              color: 'primary.main',
              fontWeight: 'bold'
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              width: '100%',
              justifyContent: 'space-between'
            }}>
              <Typography>
                {t(`common:navigation.${adminGroup.groupName.toLowerCase()}`)}
              </Typography>
              <ChevronDown 
                size={16}
                style={{ 
                  transform: isAdminOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s'
                }}
              />
            </Box>
          </MenuItem>
          <Collapse in={isAdminOpen}>
            {adminGroup.items.map((item) => (
              <MenuItem
                key={item.key}
                onClick={handleMenuClose}
                component={Link}
                href={item.path}
                sx={{ 
                  pl: 4,
                  bgcolor: 'rgba(0, 0, 0, 0.1)'
                }}
              >
                <Typography textAlign="center">
                  {t(`common:navigation.${item.key}`)}
                </Typography>
              </MenuItem>
            ))}
          </Collapse>
        </>
      )}

      {isLoaded && !user && (
        <>
          <Divider />
          <MenuItem onClick={handleMenuClose} component={Link} href="/sign-in">
            <Typography textAlign="center">
              {t("common:navigation.signIn")}
            </Typography>
          </MenuItem>
          {IS_SIGN_UP_ENABLED && (
            <MenuItem onClick={handleMenuClose} component={Link} href="/sign-up">
              <Typography textAlign="center">
                {t("common:navigation.signUp")}
              </Typography>
            </MenuItem>
          )}
        </>
      )}
    </Menu>
  );
};