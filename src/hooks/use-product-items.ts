import { useState, useEffect, useCallback } from 'react';
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { ProductItem, ProductItemStatus } from '@/app/[language]/types/product-item';
import useAuth from '@/services/auth/use-auth';

export function useProductItems({ filterStatus }: { filterStatus?: ProductItemStatus } = {}) {
  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        return;
      }

      // Get vendor ID first
      const vendorResponse = await fetch(`${API_URL}/v1/vendors/user/${user?.id}/owned`, {
        headers: {
          Authorization: `Bearer ${tokensInfo.token}`
        }
      });

      if (!vendorResponse.ok) throw new Error('Failed to fetch vendor information');
      const vendorData = await vendorResponse.json();
      
      if (vendorData.data.length === 0) {
        setItems([]);
        return;
      }

      const vendorId = vendorData.data[0]._id;
      const response = await fetch(`${API_URL}/product-items/by-vendor/${vendorId}`, {
        headers: {
          Authorization: `Bearer ${tokensInfo.token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch product items');
      const data = await response.json();

      let filteredItems = data.data;
      if (filterStatus) {
        filteredItems = filteredItems.filter((item: ProductItem) => 
          item.itemStatus === filterStatus
        );
      }

      filteredItems.sort((a: ProductItem, b: ProductItem) => {
        const dateA = new Date(`${a.productDate}T${a.startTime}`);
        const dateB = new Date(`${b.productDate}T${b.startTime}`);
        return dateA.getTime() - dateB.getTime();
      });

      setItems(filteredItems);
      setError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const updateItemQuantity = useCallback(async (itemId: string, quantityChange: number) => {
    try {
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) throw new Error('Unauthorized');

      const response = await fetch(`${API_URL}/product-items/${itemId}/quantity`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokensInfo.token}`,
        },
        body: JSON.stringify({ quantityChange }),
      });

      if (!response.ok) throw new Error('Failed to update quantity');
      
      // Update local state instead of reloading
      setItems(prevItems => 
        prevItems.map(item => 
          item._id === itemId
            ? { ...item, quantityAvailable: item.quantityAvailable + quantityChange }
            : item
        )
      );

      return true;
    } catch (error) {
      throw error;
    }
  }, []); // Remove loadItems dependency

  return {
    items,
    loading,
    error,
    refreshItems: loadItems,
    updateItemQuantity
  };
}