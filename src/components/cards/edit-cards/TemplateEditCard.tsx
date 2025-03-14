import { useState } from "react";
import { useTranslation } from "@/services/i18n/client";
import { EditCard } from '@/components/cards/edit-cards/EditCard';
import { templateEditConfig } from '@/components/template/template-edit-config';
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { FormData } from '../shared/types';
import useConfirmDialog from '@/components/confirm-dialog/use-confirm-dialog';
import { TemplateStatusEnum } from '@/components/template/types/template.types';
import { Template } from '@/components/template/types/template.types';

interface TemplateEditCardProps {
  template: Template;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: (id: string) => Promise<void>;
  onStatusChange?: (id: string, status: TemplateStatusEnum) => Promise<void>;
}

export default function TemplateEditCard({
  template,
  onSave,
  onCancel,
  onDelete,
  onStatusChange,
}: TemplateEditCardProps) {
  const { t } = useTranslation("templates");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { confirmDialog } = useConfirmDialog();

  const initialData: FormData = {
    templateName: template.templateName,
    description: template.description,
    vendorId: template.vendorId,
    productType: template.productType,
    basePrice: template.basePrice,
    defaultDuration: template.defaultDuration || null,
    requirements: template.requirements || [],
    waiver: template.waiver || '',
    imageURL: template.imageURL || '',
    additionalInfo: template.additionalInfo || '',
    location_latitude: template.defaultLocation?.coordinates[1] || 21.2758128,
    location_longitude: template.defaultLocation?.coordinates[0] || -157.8241926,
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        return;
      }

      const submissionData = {
        templateName: formData.templateName as string,
        description: formData.description as string,
        basePrice: Number(formData.basePrice),
        productType: formData.productType as string,
        requirements: formData.requirements as string[],
        waiver: formData.waiver as string,
        imageURL: formData.imageURL as string,
        additionalInfo: formData.additionalInfo as string,
        defaultLatitude: Number(formData.latitude),
        defaultLongitude: Number(formData.longitude),
        defaultDuration: formData.defaultDuration ? Number(formData.defaultDuration) : undefined,
      };

      const response = await fetch(`${API_URL}/product-templates/${template._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokensInfo.token}`,
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error("Failed to update template");
      }
      onSave();
    } catch (error) {
      console.error("Error updating template:", error);
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
        await onDelete(template._id);
        onSave();
      } catch (error) {
        console.error('Error deleting template:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleStatusChange = async (status: TemplateStatusEnum) => {
    if (!onStatusChange || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await onStatusChange(template._id, status);
      onSave();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const editConfig = {
    ...templateEditConfig,
    type: 'template' as const,
    approvalButtons: onStatusChange ? {
      type: 'template' as const,
      currentStatus: template.templateStatus,
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