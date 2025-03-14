import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useGetCartService, useAddToCartService, useUpdateCartItemService, useRemoveFromCartService, useClearCartService } from '@/services/api/services/cart';
import { cartKeys } from '@/src/services/react-query/keys/cart';
import useAuth from '@/services/auth/use-auth';
import { useTranslation } from "@/services/i18n/client";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";

export interface CartItem {
  productItemId: string;
  productName: string;
  productDescription?: string;
  price: number;
  quantity: number;
  productImageURL?: string;
  vendorId: string;
  productType: 'tours' | 'lessons' | 'rentals' | 'tickets';
  productDate?: string;
  productStartTime?: string;
  productDuration?: number;
  quantityAvailable?: number;
  templateId: string;
  templateName: string;
}

export interface CartResponse {
  userId: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartData {
  productItemId: string;
  productDate: Date;
  quantity: number;
  vendorId: string;
  templateId: string;
}

export interface UpdateCartItemData {
  productItemId: string;
  quantity: number;
}

interface ValidationError {
  type: 'INSUFFICIENT_QUANTITY' | 'ITEM_UNAVAILABLE' | 'TIME_CONFLICT' | 'VALIDATION_ERROR';
  message: string;
}

export function useCartQuery() {
  const getCart = useGetCartService();
  const addToCartService = useAddToCartService();
  const updateCartItem = useUpdateCartItemService();
  const removeFromCart = useRemoveFromCartService();
  const clearCart = useClearCartService();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { t } = useTranslation("cart");

  const query = useQuery({
    queryKey: user ? cartKeys.root().sub.detail(user.id.toString()).key : [],
    queryFn: getCart,
    enabled: !!user,
  });

  const validateInventory = async (productItemId: string, quantity: number): Promise<ValidationError | null> => {
    try {
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) throw new Error('No auth token');

      const response = await fetch(`${API_URL}/product-items/${productItemId}`, {
        headers: { Authorization: `Bearer ${tokensInfo.token}` }
      });

      if (!response.ok) {
        return { type: 'ITEM_UNAVAILABLE', message: t('errors.itemUnavailable') };
      }

      const item = await response.json();
      
      if (item.itemStatus !== 'PUBLISHED') {
        return { type: 'ITEM_UNAVAILABLE', message: t('errors.itemNotActive') };
      }

      if (item.quantityAvailable < quantity) {
        return {
          type: 'INSUFFICIENT_QUANTITY',
          message: t('errors.insufficientQuantity', { available: item.quantityAvailable })
        };
      }

      return null;
    } catch (error) {
      console.error('Validation error:', error);
      return null;
    }
  };

  const checkTimeConflicts = (
    newItem: { productDate: string; productStartTime: string; productDuration: number },
    existingItems: CartItem[]
  ): ValidationError | null => {
    const newStart = new Date(`${newItem.productDate}T${newItem.productStartTime}`);
    const newEnd = new Date(newStart.getTime() + (newItem.productDuration * 60 * 1000));

    const hasConflict = existingItems.some(item => {
      if (!item.productDate || !item.productStartTime || !item.productDuration) return false;
      const itemStart = new Date(`${item.productDate}T${item.productStartTime}`);
      const itemEnd = new Date(itemStart.getTime() + (item.productDuration * 60 * 1000));
      return (newStart < itemEnd && newEnd > itemStart);
    });

    if (hasConflict) {
      return { type: 'TIME_CONFLICT', message: t('errors.timeConflict') };
    }

    return null;
  };

  const addItem = async (data: AddToCartData) => {
    try {
      const inventoryError = await validateInventory(data.productItemId, data.quantity);
      if (inventoryError) {
        return;
      }

      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error('No auth token');
      }

      const itemResponse = await fetch(`${API_URL}/product-items/${data.productItemId}`, {
        headers: { Authorization: `Bearer ${tokensInfo.token}` }
      });
      const itemDetails = await itemResponse.json();

      if (query.data?.items) {
        const timeConflict = checkTimeConflicts(itemDetails, query.data.items);
        if (timeConflict) {
          return;
        }
      }

      await addToCartService({
        ...data,
        productDate: new Date(itemDetails.productDate) // Convert to Date object before sending
      });

      await queryClient.invalidateQueries({
        queryKey: cartKeys.root().sub.detail(user!.id.toString()).key,
      });

    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  };

  const updateItem = async (productItemId: string, quantity: number) => {
    try {
      if (quantity > 0) {
        const inventoryError = await validateInventory(productItemId, quantity);
        if (inventoryError) {
          return;
        }
      }

      await updateCartItem({ productItemId, quantity });
      await queryClient.invalidateQueries({
        queryKey: cartKeys.root().sub.detail(user!.id.toString()).key,
      });
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  };

  const removeItem = async (productItemId: string) => {
    try {
      await removeFromCart(productItemId);
      await queryClient.invalidateQueries({
        queryKey: cartKeys.root().sub.detail(user!.id.toString()).key,
      });

    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw error;
    }
  };

  const clear = async () => {
    try {
      await clearCart();
      await queryClient.invalidateQueries({
        queryKey: cartKeys.root().sub.detail(user!.id.toString()).key,
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  const refreshCart = () => {
    if (user) {
      queryClient.invalidateQueries({
        queryKey: cartKeys.root().sub.detail(user.id.toString()).key,
      });
    }
  };

  return {
    ...query,
    addItem,
    updateItem,
    removeItem,
    clear,
    refreshCart,
  };
}