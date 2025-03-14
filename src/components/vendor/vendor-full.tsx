import { useState, useEffect, useCallback, JSX } from 'react';
import dynamic from 'next/dynamic';
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import { Phone, Mail, X, Globe } from "lucide-react";
import { Image } from "@nextui-org/react";
import { useTranslation } from "@/services/i18n/client";
import { Vendor } from "@/app/[language]/types/vendor";
import { ProductItem, ProductItemStatus } from '@/app/[language]/types/product-item';
import { API_URL } from "@/services/api/config";
import { useCartQuery } from '@/hooks/use-cart-query';
import useAuth from '@/services/auth/use-auth';
import { useAddToCartService } from '@/services/api/services/cart';

// Dynamically import components
const PublicWeeklyCalendar = dynamic(
  () => import('../calendar/PublicWeeklyCalendar'),
  { 
    ssr: false,
    loading: () => (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }
);

const PublicItemDetailModal = dynamic(
  () => import('../calendar/PublicItemDetailModal'),
  { ssr: false }
);

interface VendorFullViewProps {
  vendor: Vendor;
  onClose: () => void;
}

interface PublicProductItemsResponse {
  data: ProductItem[];
  message?: string;
}

export const VendorFullView = ({ vendor, onClose }: VendorFullViewProps): JSX.Element => {
  const addToCart = useAddToCartService();
  const { t } = useTranslation("vendor");
  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<ProductItem | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  const { refreshCart } = useCartQuery();
  const { user } = useAuth();

  const fetchItems = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/product-items/by-vendor/${vendor._id}/public`);
      if (!response.ok) throw new Error('Failed to fetch items');
      
      const data: PublicProductItemsResponse = await response.json();
      const activeItems = data.data.filter((item: ProductItem) => 
        item.itemStatus === ProductItemStatus.PUBLISHED
      );
      setItems(activeItems);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  }, [vendor._id]);

  const refreshItems = useCallback(async (): Promise<void> => {
    await fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    const loadInitialItems = async (): Promise<void> => {
      setLoading(true);
      await fetchItems();
      setLoading(false);
    };

    loadInitialItems();
  }, [fetchItems]);

  const handleAddToCart = async (item: ProductItem): Promise<void> => {
    try {
      setAddingToCart(item._id);
      
      if (user) {
        await addToCart({ 
          productItemId: item._id,
          productDate: new Date(item.productDate),
          quantity: 1,
          vendorId: vendor._id,
          templateId: item.templateId
        });
        await refreshCart();
      }
      
      setSelectedItem(null);
      await refreshItems();
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(8px)',
      zIndex: 200,
      padding: { xs: 1, sm: 2 },
      pt: {xs: "60px", md:"70px"},
      overflow: 'auto'
    }}>
      <Card sx={{
        maxWidth: 'sm',
        margin: '0 auto',
        minHeight: '100%'
      }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            mb: 2 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 60, height: 60 }}>
                {vendor.logoUrl && (
                  <Image 
                    src={vendor.logoUrl} 
                    alt={vendor.businessName}
                    style={{ 
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain'
                    }}
                  />
                )}
              </Box>
              <Box>
                <Typography variant="h5" gutterBottom>
                  {vendor.businessName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {vendor.description}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={onClose} size="small">
              <X size={16} />
            </IconButton>
          </Box>

          <Grid container spacing={3}>
            {/* Contact Info */}
            <Grid item xs={12}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {t("contact")}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone size={14} />
                    <Link href={`tel:${vendor.phone}`} color="inherit">{vendor.phone}</Link>
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Mail size={14} />
                    <Link href={`mailto:${vendor.email}`} color="inherit">{vendor.email}</Link>
                  </Typography>
                  {vendor.website && (
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Globe size={14} />
                      <Link href={vendor.website} target="_blank" rel="noopener noreferrer" color="inherit">
                        {t("visitWebsite")}
                      </Link>
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Location Info */}
              <Typography variant="subtitle1" gutterBottom>
                {t("location")}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {vendor.address}<br />
                {vendor.city}, {vendor.state} {vendor.postalCode}
              </Typography>
            </Grid>

            {/* Calendar/Products View */}
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {t("availableProducts")}
                </Typography>

                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : items.length > 0 ? (
                  <PublicWeeklyCalendar
                    items={items}
                    onItemClick={setSelectedItem}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary" align="center">
                    {t("noProducts")}
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {selectedItem && (
        <PublicItemDetailModal
          item={selectedItem}
          open={true}
          onClose={() => setSelectedItem(null)}
          onAddToCart={handleAddToCart}
          isAddingToCart={addingToCart === selectedItem._id}
        />
      )}
    </Box>
  );
};

export default VendorFullView;