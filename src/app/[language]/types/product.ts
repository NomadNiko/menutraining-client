export interface Product {
  _id: string;
  productName: string;
  productDescription: string;
  productPrice: number;
  productType: 'tours' | 'lessons' | 'rentals' | 'tickets';
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  vendorId: string;
  productImageURL?: string;
  productDuration?: number;
  productDate?: string;
  productStartTime?: string;
  productAdditionalInfo?: string;
  productRequirements?: string[];
  productWaiver?: string;
  productStatus: ProductStatusEnum;
  createdAt: string;
  updatedAt: string;
  city?: string;
  state?: string;
}

export enum ProductStatusEnum {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED', 
  ARCHIVED = 'ARCHIVED'
}

export interface ProductResponse {
  data: Product[];
  message?: string;
}

export interface CreateProductDto {
  productName: string;
  productDescription: string;
  productPrice: number;
  productType: 'tours' | 'lessons' | 'rentals' | 'tickets';
  productImageURL?: string;
  productDuration?: number;
  productDate?: string;
  productStartTime?: string;
  productAdditionalInfo?: string;
  productRequirements?: string[];
  productWaiver?: string;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  productStatus?: ProductStatusEnum;
}