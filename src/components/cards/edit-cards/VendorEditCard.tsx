import { useState } from 'react';
import { EditCard } from '@/components/cards/edit-cards/EditCard';
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { vendorConfig } from '@/components/cards/edit-cards/configs';
import { FormData } from '@/components/cards/shared/types';
import { Vendor, VendorStatusEnum } from "@/app/[language]/types/vendor";

interface VendorEditCardProps {
  vendor: Vendor;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: (id: string) => Promise<void>;
  onStatusChange?: (id: string, status: VendorStatusEnum, notes: string) => Promise<void>;
}

export default function VendorEditCard({
  vendor,
  onSave,
  onCancel,
  onDelete,
  onStatusChange
}: VendorEditCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set up initial form data from vendor props
  const initialData: FormData = {
    businessName: vendor.businessName,
    description: vendor.description,
    email: vendor.email,
    phone: vendor.phone,
    website: vendor.website || '',
    logoUrl: vendor.logoUrl || '',
    address: vendor.address,
    city: vendor.city,
    state: vendor.state,
    postalCode: vendor.postalCode,
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        return;
      }

      const submissionData = {
        businessName: formData.businessName as string,
        description: formData.description as string,
        email: formData.email as string,
        phone: formData.phone as string,
        website: formData.website as string,
        logoUrl: formData.logoUrl as string,
        address: formData.address as string,
        city: formData.city as string,
        state: formData.state as string,
        postalCode: formData.postalCode as string,
        vendorStatus: vendor.vendorStatus,
        vendorTypes: vendor.vendorTypes // Preserve existing vendor types
      };

      const response = await fetch(`${API_URL}/vendors/${vendor._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokensInfo.token}`,
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error("Failed to update vendor");
      }
      onSave();
    } catch (error) {
      console.error("Error updating vendor:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setIsSubmitting(true);
    try {
      await onDelete(vendor._id);
      onSave();
    } catch (error) {
      console.error('Error deleting vendor:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (status: VendorStatusEnum) => {
    if (!onStatusChange || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await onStatusChange(vendor._id, status, '');
      onSave();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const editConfig = {
    ...vendorConfig,
    type: 'vendor' as const,
    approvalButtons: onStatusChange ? {
      type: 'vendor' as const,
      currentStatus: vendor.vendorStatus,  
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