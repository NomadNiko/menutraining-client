export interface Template {
  _id: string;
  templateName: string;
  description: string;
  basePrice: number;
  productType: 'tours' | 'lessons' | 'rentals' | 'tickets';
  defaultLocation?: {
    type: 'Point';
    coordinates: [number, number];
  };
  vendorId: string;
  imageURL?: string;
  defaultDuration?: number;
  requirements?: string[];
  waiver?: string;
  templateStatus: TemplateStatusEnum;
  additionalInfo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateGenResponse {
  _id: string;
  templateName: string;
  description: string;
  basePrice: number;
  productType: 'tours' | 'lessons' | 'rentals' | 'tickets';
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  vendorId: string;
  imageURL?: string;
  defaultDuration?: number;
  requirements?: string[];
  waiver?: string;
  templateStatus: TemplateStatusEnum;
  additionalInfo?: string;
  createdAt: string;
  updatedAt: string;
}

export enum TemplateStatusEnum {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export interface TemplateResponse {
  data: Template[];
  message?: string;
}


export interface TemplateFormData {
  templateName: string;
  description: string;
  basePrice: number;
  type: 'tours' | 'lessons' | 'rentals' | 'tickets';
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  vendorId: string;
  imageURL?: string;
  defaultDuration?: number;
  requirements?: string[];
  waiver?: string;
  templateStatus: TemplateStatusEnum;
  additionalInfo?: string;
}