'use client';
import { useState, useEffect } from 'react';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/services/i18n/client";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import ProductItemEditCard from '@/components/product-item/product-item-edit-card';
import { ProductItem, ProductItemStatus } from '@/app/[language]/types/product-item';

interface ProductItemEditPageContentProps {
  itemId: string;
}

export default function ProductItemEditPageContent({ itemId }: ProductItemEditPageContentProps) {
  const { t } = useTranslation("product-items");
  const router = useRouter();
   const [item, setItem] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadItem = async () => {
      try {
        const tokensInfo = getTokensInfo();
        if (!tokensInfo?.token) {
          router.push('/sign-in');
          return;
        }

        const response = await fetch(`${API_URL}/product-items/${itemId}`, {
          headers: {
            Authorization: `Bearer ${tokensInfo.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to load product item');
        }

        const data = await response.json();
        setItem(data.data);
      } catch (error) {
        console.error('Error loading product item:', error);
        router.push('/product-items');
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [itemId, router, t]);

  const handleDelete = async (itemId: string) => {
    try {
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        return;
      }

      const response = await fetch(`${API_URL}/product-items/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${tokensInfo.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete product item');
      }
      router.push('/product-items');
    } catch (error) {
      console.error('Error deleting product item:', error);
      }
  };

  const handleStatusChange = async (itemId: string, status: ProductItemStatus) => {
    try {
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
         return;
      }

      const response = await fetch(`${API_URL}/product-items/${itemId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokensInfo.token}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update product item status');
      }
      const data = await response.json();
      setItem(data.data);
    } catch (error) {
      console.error('Error updating product item status:', error);
      }
  };

  if (loading) {
    return (
      <Container sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 'calc(100vh - 64px)'
      }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!item) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Alert severity="error">
            {t('itemNotFound')}
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t("editItem")}
      </Typography>
      <Typography color="text.secondary" paragraph>
        {t("editSubtitle")}
      </Typography>

      <ProductItemEditCard 
        item={item}
        onSave={() => router.push('/product-items')}
        onCancel={() => router.push('/product-items')}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />
    </Container>
  );
}