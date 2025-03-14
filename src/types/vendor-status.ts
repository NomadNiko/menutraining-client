export interface StripePendingVerification {
  details: string;
  dueBy?: Date;
}

export interface StripeRequirement {
  requirement: string;
  dueDate?: Date;
  error?: string;
}

export interface StripeAccountStatus {
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  currentlyDue: string[];
  eventuallyDue: string[];
  pastDue: string[];
  pendingVerification?: StripePendingVerification;
  errors: StripeRequirement[];
}

export interface VendorStatus {
  _id: string;
  businessName: string;
  description: string;
  internalAccountBalance: number;
  stripeAccountStatus: StripeAccountStatus;
  isStripeSetupComplete: boolean;
  accountBalance: number;
  pendingBalance: number;
  vendorStatus: string;
  actionNeeded?: string;
  hasTemplates: boolean;
  hasProducts: boolean;
  templates?: Array<{
    _id: string;
    templateName: string;
    hasItems: boolean;
  }>;
}
