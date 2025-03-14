// /src/components/cards/create-cards/types.ts

import { ReactNode } from 'react';
export type FieldType = 
  | 'text'
  | 'number' 
  | 'email'
  | 'tel'
  | 'url'
  | 'textarea'
  | 'select'
  | 'date'
  | 'time'
  | 'image'
  | 'address';

export type BaseFieldValue = string | number | Date | null;

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
}

export interface SectionConfig {
  id: string;
  title: string;
  fields: FieldConfig[];
}

export interface CreateCardConfig {
  title: string;
  sections: SectionConfig[];
  type: 'vendor' | 'product' | 'template';
}

export interface FormData {
  [key: string]: BaseFieldValue;
}

export interface CreateCardProps {
  config: CreateCardConfig;
  initialData: FormData;
  onSave: (data: FormData) => Promise<void>;
  onCancel: () => void;
  customActions?: ReactNode;
  isSubmitting?: boolean;
  onChange?: (data: FormData) => void;
}