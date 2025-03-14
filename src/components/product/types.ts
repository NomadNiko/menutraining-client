import { Product, ProductStatusEnum } from "@/app/[language]/types/product";

export interface ProductFormData {
  productName: string;
  productDescription: string;
  productType: "tours" | "lessons" | "rentals" | "tickets";
  productPrice: number;
  productDuration: number | "";
  productDate: Date | null;
  productStartTime: Date | null;
  productAdditionalInfo: string;
  productRequirements: string[];
  productImageURL: string;
  productWaiver: string;
}

export interface ProductEditCardProps {
  product: Product;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: (id: string) => Promise<void>;
  onStatusChange?: (id: string, status: ProductStatusEnum) => Promise<void>;
}