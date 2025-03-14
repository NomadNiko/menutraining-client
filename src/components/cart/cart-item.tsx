import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Minus, Plus, X, Calendar, Clock } from "lucide-react";
import { useTranslation } from "@/services/i18n/client";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import {
  useUpdateCartItemService,
  useRemoveFromCartService,
} from "@/services/api/services/cart";
import { format } from "date-fns";
import { formatDuration } from "@/components/utils/duration-utils";

type CartItemProps = {
  item: {
    productItemId: string;
    productName: string;
    price: number;
    quantity: number;
    productDate: string;
    productStartTime: string;
    productDuration: number;
    vendorId: string;
  };
  onUpdate: (productItemId: string, quantity: number) => void;
  onRemove: (productItemId: string) => void;
};

export default function CartItem({
  item,
  onUpdate,
  onRemove,
}: CartItemProps) {
  const { t } = useTranslation("cart");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(false);

  const updateCartItem = useUpdateCartItemService();
  const removeFromCart = useRemoveFromCartService();

  const handleQuantityChange = async (newQuantity: number) => {
    try {
      setLoading(true);

      // If new quantity would be 0, use remove function instead
      if (newQuantity <= 0) {
        await handleRemove();
        return;
      }

      await updateCartItem({
        productItemId: item.productItemId,
        quantity: newQuantity,
      });
      onUpdate(item.productItemId, newQuantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    try {
      setLoading(true);
      await removeFromCart(item.productItemId);
      onRemove(item.productItemId);
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          gap: isMobile ? 1 : 2,
          position: "relative",
          px: isMobile ? 1 : 2,
          py: isMobile ? 1 : 2,
        }}
      >
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              borderRadius: 1,
              zIndex: 1,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {isMobile && (
          <IconButton
            onClick={handleRemove}
            disabled={loading}
            sx={{
              position: "absolute",
              top: 4,
              right: 4,
              zIndex: 1,
            }}
          >
            <X size={16} />
          </IconButton>
        )}

        <Box
          flex={1}
          sx={{
            width: "100%",
            textAlign: isMobile ? "center" : "left",
            mb: isMobile ? 1 : 0,
          }}
        >
          <Typography variant={isMobile ? "subtitle1" : "h6"}>
            {item.productName}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
              mt: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Calendar size={16} />
              <Typography variant="body2" color="text.secondary">
                {format(new Date(item.productDate), "PPP")}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Clock size={16} />
              <Typography variant="body2" color="text.secondary">
                {format(
                  new Date(`2000-01-01T${item.productStartTime}`),
                  "h:mm a"
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ({formatDuration(item.productDuration)})
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            mb: isMobile ? 1 : 0,
          }}
        >
          <IconButton
            size="small"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={loading}
          >
            <Minus size={16} />
          </IconButton>
          <Typography variant={isMobile ? "body2" : "body1"}>
            {item.quantity}
          </Typography>
          <IconButton
            size="small"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={loading}
          >
            <Plus size={16} />
          </IconButton>
        </Box>

        <Box
          sx={{
            textAlign: isMobile ? "center" : "right",
            minWidth: isMobile ? "100%" : 100,
          }}
        >
          <Typography variant={isMobile ? "subtitle1" : "h6"}>
            ${(item.price * item.quantity).toFixed(2)}
          </Typography>
          <Typography
            variant={isMobile ? "caption" : "body2"}
            color="text.secondary"
          >
            ${item.price.toFixed(2)} {t("each")}
          </Typography>
        </Box>

        {!isMobile && (
          <IconButton onClick={handleRemove} disabled={loading}>
            <X size={16} />
          </IconButton>
        )}
      </CardContent>
    </Card>
  );
}
