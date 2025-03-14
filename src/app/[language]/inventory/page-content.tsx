"use client";
import { useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "@/services/i18n/client";
import { useProductItems } from "@/hooks/use-product-items";
import {
  ProductItem,
  ProductItemStatus,
} from "@/app/[language]/types/product-item";
import EnhancedInventoryTable from "@/components/product-item/EnhancedInventoryTable";

export default function InventoryPageContent() {
  const { t } = useTranslation("inventory");
  const [isUpdating, setIsUpdating] = useState(false);

  const { items, loading, updateItemQuantity } = useProductItems({
    filterStatus: ProductItemStatus.PUBLISHED,
  });

  const handleQuantityChange = async (item: ProductItem, change: number) => {
    if (isUpdating) return;

    if (item.quantityAvailable + change < 0) {
      return;
    }

    setIsUpdating(true);
    try {
      await updateItemQuantity(item._id, change);
    } catch (error) {
      console.error("Error updating quantity:", error);
      } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 64px)",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t("title")}
      </Typography>
      <Typography color="text.secondary" paragraph>
        {t("subtitle")}
      </Typography>

      <Paper sx={{ mt: 4 }}>
        <EnhancedInventoryTable
          items={items}
          onQuantityChange={handleQuantityChange}
          isUpdating={isUpdating}
          t={t}
        />
      </Paper>
    </Container>
  );
}
