import { ReactNode } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProductStatusEnum } from '@/app/[language]/types/product';
import { VendorStatusEnum } from '@/app/[language]/types/vendor';
import { Vendor } from '@/app/[language]/types/vendor';
import { PlaceResult } from '@/hooks/use-google-places';
import { FileEntity } from '@/services/api/types/file-entity';
import { TemplateStatusEnum } from '@/components/template/types/template.types';
import { ProductItemStatus } from '@/app/[language]/types/product-item';

export type FieldType = 
  | 'text'
  | 'number' 
  | 'price' 
  | 'email'
  | 'tel'
  | 'url'
  | 'multiselect' 
  | 'vendor'
  | 'textarea'
  | 'select'
  | 'vendorSelect'
  | 'date'
  | 'time'
  | 'image'
  | 'address'
  | 'duration'
  | 'break'
  | 'fileUpload'
  | 'requirements'
  | 'gpsLocation'
  | 'productTypeToggle';

export type LocationValue = {
  latitude: number;
  longitude: number;
};

export type BaseFieldValue = 
  | string 
  | number 
  | boolean 
  | Date 
  | string[] 
  | FileEntity 
  | LocationValue
  | null 
  | undefined;

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  defaultValue?: BaseFieldValue;
  fullWidth?: boolean;
  rows?: number;
  gridWidth?: 1 | 2 | 3 | 4 | 6 | 12;
  prefilled?: boolean;
  condition?: (formData: FormData) => boolean;
}

export interface SectionConfig {
  id: string;
  title: string;
  fields: FieldConfig[];
}

export type ApprovalButtonsConfig = {
  type: 'product';
  currentStatus: ProductStatusEnum;
  onStatusChange: (status: ProductStatusEnum) => Promise<void>;
} | {
  type: 'vendor';
  currentStatus: VendorStatusEnum;
  onStatusChange: (status: VendorStatusEnum) => Promise<void>;
} | {
  type: 'template';
  currentStatus: TemplateStatusEnum;
  onStatusChange: (status: TemplateStatusEnum) => Promise<void>;
} | {
  type: 'productItem';
  currentStatus: ProductItemStatus;
  onStatusChange: (status: ProductItemStatus) => Promise<void>;
};

export interface CardConfig {
  title: string;
  type: 'vendor' | 'product' | 'template' | 'productItem';
  sections: SectionConfig[];
  approvalButtons?: ApprovalButtonsConfig;
}

export interface FormData {
  [key: string]: BaseFieldValue;
}


export interface BaseCardProps {
  config: CardConfig;
  initialData: FormData;
  onSave: (data: FormData) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => Promise<void>;
  customActions?: ReactNode;
  isSubmitting?: boolean;
  onChange?: (data: FormData) => void;
  onVendorSelect?: (vendor: Vendor) => void;
  onAddressSelect?: (place: PlaceResult) => Promise<void>;
  loadVendors?: () => Promise<Vendor[]>;
  mode?: 'edit' | 'create';
  children?: ReactNode;
}


export interface SharedCardActionsProps {
  onSave: (data: FormData) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => Promise<void>;
  isSubmitting: boolean;
  methods: UseFormReturn<FormData>;
  customActions?: ReactNode;
  t: (key: string) => string;
  type: 'vendor' | 'product' | 'template' | 'productItem';
  mode?: 'edit' | 'create';
}

export interface FormValuesMonitorProps {
  onChange?: (data: FormData) => void;
}

export interface CardSectionProps {
  section: SectionConfig;
  mode?: 'edit' | 'create';
}

export interface CardFieldProps {
  field: FieldConfig;
  mode?: Mode;
}

export interface ImageUploadFieldProps {
  field: FieldConfig;
  mode?: 'edit' | 'create';
}

export interface AddressFieldProps {
  field: FieldConfig;
  mode?: 'edit' | 'create';
}

export interface ApprovalButtonsProps {
  type: 'vendor' | 'product'| 'template';
  currentStatus: ProductStatusEnum | VendorStatusEnum | ProductStatusEnum;
  onStatusChange: (status: ProductStatusEnum | VendorStatusEnum | ProductStatusEnum) => Promise<void>;
  isSubmitting: boolean;
}

export interface ValidationError {
  type: string;
  message: string;
}

export interface FieldValidation {
  required?: boolean | string;
  min?: number | { value: number; message: string };
  max?: number | { value: number; message: string };
  pattern?: RegExp | { value: RegExp; message: string };
  validate?: (value: BaseFieldValue) => boolean | string | Promise<boolean | string>;
}

export interface FormState {
  isDirty: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
  submitCount: number;
  isValid: boolean;
}

export type Mode = 'edit' | 'create';

export type EntityType = 'vendor' | 'product' | 'template' | 'productItem';
