// src/components/cart/cart-summary.tsx
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTranslation } from "@/services/i18n/client";

type CartSummaryProps = {
  total: number;
};

export default function CartSummary({ total }: CartSummaryProps) {
  const { t } = useTranslation("cart");
  
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t("orderSummary")}
        </Typography>
        
        <Box 
          sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            mb: 2,
            pt: 2,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="h6">{t("total")}</Typography>
          <Typography variant="h6">${total.toFixed(2)}</Typography>
        </Box>
        
        <Typography variant="caption" color="text.secondary" display="block">
          {t("thankCustomer")}
        </Typography>
      </CardContent>
    </Card>
  );
}