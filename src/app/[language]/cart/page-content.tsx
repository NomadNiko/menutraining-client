"use client";
import { useEffect } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "@/services/i18n/client";
import CartItem from "@/components/cart/cart-item";
import CartSummary from "@/components/cart/cart-summary";
import useAuth from "@/services/auth/use-auth";
import { useRouter } from "next/navigation";
import { useCartQuery } from "@/hooks/use-cart-query";

interface CartItemType {
  productItemId: string;
  templateId: string;       
  templateName: string;
  productName: string;
  productDescription?: string;
  price: number;
  quantity: number;
  productImageURL?: string;
  vendorId: string;
  productType: "tours" | "lessons" | "rentals" | "tickets";
  productDate: string;
  productStartTime: string;
  productDuration: number;
}

export default function CartPage() {
  const { t } = useTranslation("cart");
  const { data: cartData, isLoading: isCartLoading, refreshCart, updateItem, removeItem } = useCartQuery();
  const { user, isLoaded } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!user && isLoaded) {
      router.replace('/sign-in');
    }
  }, [isLoaded, user, router]);

  const calculateTotal = () => {
    return cartData?.items.reduce(
      (sum: number, item: CartItemType) => sum + item.price * item.quantity,
      0
    ) ?? 0;
  };

  const handleQuantityUpdate = async (productItemId: string, newQuantity: number) => {
    try {
      await updateItem(productItemId, newQuantity);
      refreshCart();
      } catch (error) {
      console.error('Error updating quantity:', error);
       }
  };

  const handleRemoveItem = async (productItemId: string) => {
    try {
      await removeItem(productItemId);
      refreshCart();
      } catch (error) {
      console.error('Error removing item:', error);
      }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (isCartLoading && user) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  const cartItems = cartData?.items || [];
  const total = calculateTotal();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t("title")}
      </Typography>
      
      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          {!cartItems.length ? (
            <Typography variant="h6" color="text.secondary" align="center" sx={{ py: 8 }}>
              {t("emptyCart")}
            </Typography>
          ) : (
            cartItems.map((item: CartItemType) => (
              <CartItem
                key={item.productItemId}
                item={item}
                onUpdate={handleQuantityUpdate}
                onRemove={handleRemoveItem}
              />
            ))
          )}
        </Grid>
        
        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Box 
            sx={{ 
              position: "sticky", 
              top: 24,
              bgcolor: 'background.paper',
              p: 2,
              borderRadius: 1
            }}
          >
            <CartSummary total={total} />
            
            {cartItems.length > 0 && (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleCheckout}
                sx={{ mt: 2 }}
              >
                {t("actions.checkout")}
              </Button>
            )}
            
            <Typography 
              variant="caption" 
              color="text.secondary" 
              display="block" 
              align="center"
              sx={{ mt: 2 }}
            >
              {t("noAdditionalFees")}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}