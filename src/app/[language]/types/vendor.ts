import { Feature, Point } from 'geojson';
import { FetchJsonResponse } from '@/services/api/types/fetch-json-response';

export enum VendorStatusEnum {
  SUBMITTED = 'SUBMITTED',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  ACTION_NEEDED = 'ACTION_NEEDED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export type VendorTypes = 'tours' | 'lessons' | 'rentals' | 'tickets' | '';

// Stripe-related interfaces
export interface StripeRequirement {
  requirement: string;
  dueDate?: Date;
  error?: string;
}

export interface StripePendingVerification {
  details: string;
  dueBy?: Date;
}

export interface StripeAccountStatus {
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  currentlyDue: string[];
  eventuallyDue: string[];
  pastDue: string[];
  pendingVerification?: StripePendingVerification;
  requirements: StripeRequirement[];
}

export interface StripeVendorInfo {
  stripeConnectId?: string;
  stripeAccountStatus?: StripeAccountStatus;
  accountBalance?: number;
  pendingBalance?: number;
}

// Base vendor properties interface
export interface VendorProperties {
  _id: string;
  businessName: string;
  description: string;
  vendorTypes: VendorTypes[];
  website?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  logoUrl?: string;
  vendorStatus: VendorStatusEnum;
  actionNeeded?: string;
  adminNotes?: string;
  ownerIds?: string[];
  createdAt: string;
  updatedAt: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  stripeInfo?: StripeVendorInfo;
}

// GeoJSON feature type for vendor
export type VendorFeature = Feature<Point, VendorProperties>;

// Main vendor interface
export interface Vendor extends Omit<VendorProperties, 'location'> {
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
}

// API response types
export interface VendorResponse {
  data: Vendor[];
}

export type VendorApiResponse = FetchJsonResponse<VendorResponse>;

// Sorting enums
export enum VendorSortField {
  NAME = 'businessName',
  POSTCODE = 'postalCode',
  CITY = 'city',
  STATE = 'state',
  STATUS = 'vendorStatus',
  CREATED = 'createdAt',
  UPDATED = 'updatedAt'
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}