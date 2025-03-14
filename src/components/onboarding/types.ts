import { z } from 'zod';
import { Control } from 'react-hook-form';
import { PlaceResult } from '@/hooks/use-google-places';

const vendorTypes = ['tours', 'lessons', 'rentals', 'tickets'] as const;

export const vendorSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  description: z.string().min(1, 'Description is required'),
  vendorTypes: z.array(z.enum(vendorTypes)).min(1, 'At least one vendor type is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  logoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(5, 'Invalid postal code'),
  latitude: z.number(),
  longitude: z.number()
});

export type VendorFormData = z.infer<typeof vendorSchema>;

export type StepProps = {
  control: Control<VendorFormData>;
  t: (key: string) => string;
  handleAddressSelect?: (place: PlaceResult) => void;
};