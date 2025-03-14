import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import CircularProgress from "@mui/material/CircularProgress";
import { ShoppingCart } from "lucide-react";
import Link from "@/components/link";
import { useTranslation } from "@/services/i18n/client";
import Tooltip from "@mui/material/Tooltip";

interface CartButtonProps {
  itemCount: number;
  isLoading: boolean;
}

export const CartButton: React.FC<CartButtonProps> = ({ itemCount, isLoading }) => {
  const { t } = useTranslation("common");

  return (
    <Box sx={{ mr: 2 }}>
      <Tooltip title={t("common:navigation.cart")}>
        {isLoading ? (
          <CircularProgress size={40} color="inherit" />
        ) : (
          <IconButton
            component={Link}
            href="/cart"
            sx={{ p: 0 }}
            data-testid="cart-button"
          >
            <Badge
              badgeContent={itemCount}
              color="primary"
              sx={{
                "& .MuiBadge-badge": {
                  right: -3,
                  top: 3,
                },
              }}
            >
              <ShoppingCart size={32} />
            </Badge>
          </IconButton>
        )}
      </Tooltip>
    </Box>
  );
};