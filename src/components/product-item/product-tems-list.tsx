import { useState, useEffect, useCallback } from 'react';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useTranslation } from "@/services/i18n/client";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import useAuth from '@/services/auth/use-auth';
import { ProductItem, ProductItemStatus, FilterOptions } from '@/app/[language]/types/product-item';
import { ProductItemCard } from './product-item-card';
import { ProductItemFilters } from './product-item-filters';

export const ProductItemsList = () => {
  const { user } = useAuth();
  const { t } = useTranslation("product-items");
  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    filterType: '', 
    filterStatus: '',
    sortOrder: 'desc'
  });

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        return;
      }
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      
      const vendorResponse = await fetch(`${API_URL}/v1/vendors/user/${user.id}/owned`, {
        headers: {
          Authorization: `Bearer ${tokensInfo.token}`,
        },
      });
      if (!vendorResponse.ok) {
        throw new Error('Failed to fetch vendor information');
      }
      const vendorData = await vendorResponse.json();
      if (!vendorData.data.length) {
        setItems([]);
        return;
      }
      const vendorId = vendorData.data[0]._id;
      const response = await fetch(`${API_URL}/product-items/by-vendor/${vendorId}`, {
        headers: {
          Authorization: `Bearer ${tokensInfo.token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to load items');
      }
      const data = await response.json();
      setItems(data.data);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, t]);

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
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      loadItems();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleFilterChange = (field: keyof FilterOptions, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const filteredAndSortedItems = items
    .filter(item => {
      const searchFields = [
        item.templateName || '',
        item.description || '',
        item.notes || ''
      ].map(field => field.toLowerCase());
      
      const matchesSearch = filters.searchTerm === '' || 
        searchFields.some(field => field.includes(filters.searchTerm.toLowerCase()));
      const matchesType = !filters.filterType || item.productType === filters.filterType;
      const matchesStatus = !filters.filterStatus || item.itemStatus === filters.filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.productDate + 'T' + a.startTime);
      const dateB = new Date(b.productDate + 'T' + b.startTime);
      return filters.sortOrder === 'asc' ? 
        dateA.getTime() - dateB.getTime() : 
        dateB.getTime() - dateA.getTime();
    });

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  if (loading) {
    return (
      <Container sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 64px)',
      }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {t('title')}
        </Typography>
        <Typography color="text.secondary">
          {t('subtitle')}
        </Typography>
      </Box>

      <ProductItemFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <Grid container spacing={3}>
        {filteredAndSortedItems.map((item) => (
          <Grid item xs={12} md={6} lg={4} key={item._id}>
            <ProductItemCard
              item={item}
              onUpdateStatus={handleUpdateStatus}
            />
          </Grid>
        ))}
        {filteredAndSortedItems.length === 0 && (
          <Grid item xs={12}>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              align="center"
              sx={{ py: 8 }}
            >
              {t('noItems')}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};