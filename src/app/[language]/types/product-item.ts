export enum ProductItemStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED'
  }
  
  export interface ProductItem {
    _id: string;
    templateId: string;
    vendorId: string;
    productDate: string;
    startTime: string;
    duration: number;
    price: number;
    quantityAvailable: number;
    quantitySold: number;
    longitude: number;
    latitude: number;
    location: {
      type: 'Point';
      coordinates: [number, number]; // [longitude, latitude]
  };
    templateName: string;
    description: string;
    productType: 'tours' | 'lessons' | 'rentals' | 'tickets';
    requirements: string[];
    waiver: string;
    imageURL?: string;
    itemStatus: ProductItemStatus;
    instructorName?: string;
    tourGuide?: string;
    equipmentSize?: string;
    notes?: string;
    additionalInfo?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface UpdateProductItemDto {
    productDate?: string;
    startTime?: string;
    duration?: number;
    price?: number;
    quantityAvailable?: number;
    notes?: string;
    instructorName?: string;
    tourGuide?: string;
    equipmentSize?: string;
    itemStatus?: ProductItemStatus;
  }
  
  export interface ProductItemResponse {
    data: ProductItem[];
    message?: string;
  }

  export interface FilterOptions {
    searchTerm: string;
    filterType: string;
    filterStatus: string;
    sortOrder: 'asc' | 'desc';
  }