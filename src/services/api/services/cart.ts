import { API_URL } from "../config";
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
  productDate: Date;
  productStartTime: string;
  productDuration: number;
  quantityAvailable: number;
  itemStatus: string;
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

export const useGetCartService = () => {
  return async () => {
    const tokensInfo = getTokensInfo();
    if (!tokensInfo?.token) {
      throw new Error('No auth token');
    }
    const response = await fetch(`${API_URL}/cart`, {
      headers: {
        Authorization: `Bearer ${tokensInfo.token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch cart');
    }
    return response.json();
  };
};

export const useAddToCartService = () => {
  return async (data: AddToCartData) => {
    const tokensInfo = getTokensInfo();
    if (!tokensInfo?.token) {
      throw new Error('No auth token');
    }
    const response = await fetch(`${API_URL}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokensInfo.token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to add item to cart');
    }
    return response.json();
  };
};

export const useUpdateCartItemService = () => {
  return async (data: UpdateCartItemData) => {
    const tokensInfo = getTokensInfo();
    if (!tokensInfo?.token) {
      throw new Error('No auth token');
    }
    const response = await fetch(`${API_URL}/cart/${data.productItemId}`, { // Fixed URL
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokensInfo.token}`,
      },
      body: JSON.stringify({ quantity: data.quantity }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update cart item');
    }
    return response.json();
  };
};

export const useRemoveFromCartService = () => {
  return async (productItemId: string) => {
    const tokensInfo = getTokensInfo();
    if (!tokensInfo?.token) {
      throw new Error('No auth token');
    }
    const response = await fetch(`${API_URL}/cart/${productItemId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${tokensInfo.token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to remove item from cart');
    }
    return response.json();
  };
};

export const useClearCartService = () => {
  return async () => {
    const tokensInfo = getTokensInfo();
    if (!tokensInfo?.token) {
      throw new Error('No auth token');
    }
    const response = await fetch(`${API_URL}/cart`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${tokensInfo.token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to clear cart');
    }
    return response.json();
  };
};