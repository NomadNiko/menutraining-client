export type CartItemType = {
  productItemId: string;
  templateId: string;       // Added to reference parent template
  templateName: string;
  productName: string;
  productDescription?: string;
  price: number;
  quantity: number;
  productImageURL?: string;
  vendorId?: string;
  productType: "tours" | "lessons" | "rentals" | "tickets";
  productDate?: string;
  productStartTime?: string;
};

export interface CartResponse {
  userId: string;
  items: CartItemType[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartRequest {
  productItemId: string;
  quantity: number;
  templateId: string;
  vendorId: string;
}

export interface CartValidationError {
  productItemId: string;
  error: 'INSUFFICIENT_QUANTITY' | 'ITEM_UNAVAILABLE' | 'TIME_CONFLICT';
  message: string;
}