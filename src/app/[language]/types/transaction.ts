// src/app/[language]/types/transaction.ts

export enum TransactionStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    SUCCEEDED = 'succeeded',
    FAILED = 'failed',
    REFUNDED = 'refunded',
    PARTIALLY_REFUNDED = 'partially_refunded',
    DISPUTED = 'disputed'
  }
  
  export enum TransactionType {
    PAYMENT = 'payment',
    REFUND = 'refund',
    PAYOUT = 'payout'
  }
  
  export interface PaymentMethodDetails {
    type?: string;
    card?: {
      brand?: string;
      last4?: string;
      exp_month?: number;
      exp_year?: number;
      country?: string;
    };
    billing_details?: {
      address?: {
        city?: string;
        country?: string;
        line1?: string;
        line2?: string;
        postal_code?: string;
        state?: string;
      };
      email?: string;
      name?: string;
      phone?: string;
    };
  }
  
  export interface TransactionMetadata {
    items?: string;
    returnUrl?: string;
    customerId?: string;
    vendorId?: string;
    [key: string]: string | undefined;
  }
  
  export interface Transaction {
    _id: string;
    stripeCheckoutSessionId: string;
    amount: number;
    currency: string;
    vendorId: string;
    customerId: string;
    productItemId: string;
    status: TransactionStatus;
    type: TransactionType;
    paymentMethodDetails?: PaymentMethodDetails;
    description?: string;
    receiptEmail?: string;
    metadata?: TransactionMetadata;
    refundId?: string;
    refundAmount?: number;
    refundReason?: string;
    disputeId?: string;
    disputeStatus?: string;
    disputeAmount?: number;
    error?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface TransactionResponse {
    data: Transaction[];
    message?: string;
  }