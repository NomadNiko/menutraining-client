import { VendorStatusEnum } from "@/app/[language]/types/vendor";

export interface VendorActionProps {
  onAction: (id: string, action: VendorStatusEnum, notes: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: () => void;
  vendorId: string;
  notes: string;
  setNotes: (notes: string) => void;
  isSubmitting: boolean;
}

export interface VendorHeaderProps {
  logoUrl?: string;  // Made optional to match Vendor type
  businessName: string;
  description: string;
}

export interface VendorInfoGridProps {
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  adminNotes?: string;
  vendorStatus: VendorStatusEnum;
}