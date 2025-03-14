export interface InvoiceItem {
  productItemId: string;
  productName: string;
  price: number;
  quantity: number;
  productDate: string;
  productStartTime: string;
  productDuration: number;
}

export interface VendorGroup {
  vendorId: string;
  vendorName: string;
  subtotal: number;
  items: InvoiceItem[];
}

export interface InvoiceResponseDto {
  _id: string;
  stripeCheckoutSessionId: string;
  amount: number;
  currency: string;
  customerId: string;
  customerName: string;
  productItemIds: string[];
  vendorGroups: VendorGroup[];
  status: string;
  type: string;
  invoiceDate: Date;
  description: string;
}