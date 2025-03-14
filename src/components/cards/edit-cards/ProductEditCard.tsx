import { useState } from "react";
import { useTranslation } from "@/services/i18n/client";
import { EditCard } from '@/components/cards/edit-cards/EditCard';
import { productConfig } from '@/components/cards/edit-cards/configs';
import { Product, ProductStatusEnum } from "@/app/[language]/types/product";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { FormData, CardConfig } from '../shared/types';
import useConfirmDialog from '@/components/confirm-dialog/use-confirm-dialog';
import { format } from "date-fns";

interface ProductEditCardProps {
  product: Product;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: (id: string) => Promise<void>;
  onStatusChange?: (id: string, status: ProductStatusEnum) => Promise<void>;
}

export default function ProductEditCard({
  product,
  onSave,
  onCancel,
  onDelete,
  onStatusChange,
}: ProductEditCardProps) {
  const { t } = useTranslation("products");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { confirmDialog } = useConfirmDialog();


  const initialData: FormData = {
    vendorId: product.vendorId || '',
    productName: product.productName || '',
    productDescription: product.productDescription || '',
    productType: product.productType || 'tours',
    productPrice: product.productPrice || 0,
    productDuration: product.productDuration || null,
    productDate: product.productDate ? new Date(product.productDate) : null,
    productStartTime: product.productStartTime ? new Date(`1970-01-01T${product.productStartTime}:00.000Z`) : null,
    productAdditionalInfo: product.productAdditionalInfo || '',
    productRequirements: product.productRequirements || [],
    productImageURL: product.productImageURL || '',
    productWaiver: product.productWaiver || '',
    // Location data
    location_longitude: product.location?.coordinates[0] || -157.826, // First coordinate is longitude
    location_latitude: product.location?.coordinates[1] || 21.277,    // Second coordinate is latitude
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        return;
      }

      const submissionData = {
        productName: formData.productName as string,
        productDescription: formData.productDescription as string,
        productType: formData.productType as string,
        productPrice: Number(formData.productPrice),
        productDuration: formData.productDuration ? Number(formData.productDuration) : undefined,
        productDate: formData.productDate instanceof Date ? 
          format(formData.productDate, 'yyyy-MM-dd') : undefined,
        productStartTime: formData.productStartTime instanceof Date ? 
          format(formData.productStartTime, 'HH:mm') : undefined,
        productImageURL: formData.productImageURL as string,
        productRequirements: formData.productRequirements as string[],
        productWaiver: formData.productWaiver as string,
        productAdditionalInfo: formData.productAdditionalInfo as string,
        latitude: Number(formData.location_latitude),
        longitude: Number(formData.location_longitude)
      };

      const response = await fetch(`${API_URL}/products/${product._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokensInfo.token}`,
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      onSave();
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    const confirmed = await confirmDialog({
      title: t('deleteConfirm.title'),
      message: t('deleteConfirm.message'),
      successButtonText: t('deleteConfirm.confirm'),
      cancelButtonText: t('deleteConfirm.cancel'),
    });

    if (confirmed) {
      setIsSubmitting(true);
      try {
        await onDelete(product._id);
        onSave();
      } catch (error) {
        console.error('Error deleting product:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleStatusChange = async (status: ProductStatusEnum) => {
    if (!onStatusChange || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await onStatusChange(product._id, status);
      onSave();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const editConfig: CardConfig = {
    ...productConfig,
    type: 'product',
    sections: productConfig.sections.map(section => {
      if (section.id === 'details' && section.fields) {
        return {
          ...section,
          fields: section.fields.map(field => {
            if (field.name === 'address') {
                return {
                  name: 'location', 
                  label: 'Location',
                  type: 'gpsLocation',
                  required: true,
                  gridWidth: 12
                };
              }
            return field;
          })
        };
      }
      return section;
    }),
    approvalButtons: onStatusChange ? {
      type: 'product',
      currentStatus: product.productStatus,
      onStatusChange: handleStatusChange
    } : undefined
  };

  return (
    <EditCard
      config={editConfig}
      initialData={initialData}
      onSave={handleSubmit}
      onCancel={onCancel}
      onDelete={onDelete ? handleDelete : undefined}
      isSubmitting={isSubmitting}
    />
  );
}