export type ProductType = 'tours' | 'lessons' | 'rentals' | 'tickets';

export enum ProductStatusEnum {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED', 
  ARCHIVED = 'ARCHIVED'
}

export interface Product {
  _id: string;
  productName: string;
  productDescription: string;
  productPrice: number;
  productType: ProductType;
  vendorId: string;
  
  productImageURL?: string;
  productDuration?: number;         // Duration in hours
  productDate?: string;            // ISO date string
  productStartTime?: string;       // Format: "HH:mm"
  productAdditionalInfo?: string;
  productRequirements?: string[];
  productWaiver?: string;
  productStatus: ProductStatusEnum;
  
  createdAt: string;              // ISO date string
  updatedAt: string;              // ISO date string
}

export interface ProductCardProps {
  product: Product;
  onStatusChange?: (id: string, status: ProductStatusEnum) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onEdit?: () => void;
}
