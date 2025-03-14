"use client";
import { useState, useEffect, useCallback } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useTranslation } from "@/services/i18n/client";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import useAuth from "@/services/auth/use-auth";
import {
  ProductItem,
  ProductItemStatus,
} from "@/app/[language]/types/product-item";
import WeeklyCalendar from "@/components/calendar/WeeklyCalendar";
import ProductItemDetailModal from "@/components/calendar/ProductItemDetailModal";
import { useCalendarNavigation } from "@/hooks/use-calendar-navigation";
import { Calendar, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductItemsContent() {
  const { user } = useAuth();
  const { t } = useTranslation("product-items");
  const router = useRouter();
  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ProductItem | null>(null);
  const { currentWeek, nextWeek, previousWeek, goToToday } = useCalendarNavigation();

  const handleUpdateStatus = async (itemId: string, newStatus: ProductItemStatus) => {
    try {
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        return;
      }
      
      const response = await fetch(`${API_URL}/product-items/${itemId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokensInfo.token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) throw new Error('Failed to update status');
      loadItems();
      setSelectedItem(null);
    } catch (error) {
      console.error('Error updating status:', error);
      }
  };

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
         return;
      }

      const vendorResponse = await fetch(
        `${API_URL}/v1/vendors/user/${user?.id}/owned`,
        {
          headers: {
            Authorization: `Bearer ${tokensInfo.token}`,
          },
        }
      );
      if (!vendorResponse.ok) throw new Error("Failed to fetch vendor information");
      const vendorData = await vendorResponse.json();
      
      if (!vendorData.data.length) {
        setItems([]);
        return;
      }

      const response = await fetch(
        `${API_URL}/product-items/by-vendor/${vendorData.data[0]._id}`,
        {
          headers: {
            Authorization: `Bearer ${tokensInfo.token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to load items");
      const data = await response.json();
      setItems(data.data);
    } catch (error) {
      console.error("Error loading items:", error);
      } finally {
      setLoading(false);
    }
  }, [user?.id, t]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  if (loading) {
    return (
      <Container sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)'}}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', sm: 'center' },
        mb: 4,
        gap: { xs: 2, sm: 0 }
      }}>
        <Typography variant="h4" sx={{ mb: { xs: 2, sm: 0 } }}>{t("title")}</Typography>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          gap: 2, 
          alignItems: { xs: 'stretch', sm: 'center' } 
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: { xs: 2, sm: 0 }
          }}>
            <IconButton onClick={previousWeek} size="small">
              <ChevronLeft />
            </IconButton>
            <Button
              variant="outlined"
              startIcon={<Calendar />}
              onClick={goToToday}
              sx={{ mx: 1 }}
            >
              {t("today")}
            </Button>
            <IconButton onClick={nextWeek} size="small">
              <ChevronRight />
            </IconButton>
          </Box>
          <Button
            variant="contained"
            startIcon={<Plus />}
            onClick={() => router.push("/templates")}
            fullWidth={false}
            sx={{ 
              alignSelf: { xs: 'stretch', sm: 'center' } 
            }}
          >
            {t("createProduct")}
          </Button>
        </Box>
      </Box>

      <WeeklyCalendar
        items={items}
        onItemClick={setSelectedItem}
        currentWeek={currentWeek}
        isVendorView={true}
      />

      <ProductItemDetailModal
        item={selectedItem}
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        isVendorView={true}
        onUpdateStatus={handleUpdateStatus}
      />
    </Container>
  );
}