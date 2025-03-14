import { useState } from "react";
import { useTranslation } from "@/services/i18n/client";
import { EditCard } from "@/components/cards/edit-cards/EditCard";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { CardConfig, FormData, FieldType } from "../cards/shared/types";
import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import {
  ProductItem,
  ProductItemStatus,
} from "@/app/[language]/types/product-item";
import { format } from "date-fns";

interface ProductItemEditCardProps {
  item: ProductItem;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: (id: string) => Promise<void>;
  onStatusChange?: (id: string, status: ProductItemStatus) => Promise<void>;
}

// Define the enhanced config with proper types
const enhancedProductItemConfig: CardConfig = {
  title: "editProductItem",
  type: "productItem",
  sections: [
    {
      id: "general",
      title: "general",
      fields: [
        {
          name: "templateName",
          label: "templateName",
          type: "text",
          gridWidth: 12,
        },
        {
          name: "description",
          label: "description",
          type: "textarea" as FieldType,
          rows: 3,
          gridWidth: 12,
        },
        {
          name: "imageURL",
          label: "imageUrl",
          type: "fileUpload" as FieldType,
          gridWidth: 12,
        },
      ],
    },
    {
      id: "scheduling",
      title: "scheduling",
      fields: [
        {
          name: "productDate",
          label: "date",
          type: "date" as FieldType,
          required: true,
          gridWidth: 6,
        },
        {
          name: "break",
          label: "break",
          type: "break",
          gridWidth: 12,
        },
        {
          name: "startTime",
          label: "startTime",
          type: "time" as FieldType,
          required: true,
          gridWidth: 6,
        },
        {
          name: "break",
          label: "break",
          type: "break",
          gridWidth: 12,
        },
        {
          name: "duration",
          label: "duration",
          type: "duration" as FieldType,
          required: true,
          gridWidth: 6,
          validation: {
            min: 1,
            max: 1440,
            message: "Please enter valid duration",
          },
        },
      ],
    },
    {
      id: "availability",
      title: "availability",
      fields: [
        {
          name: "price",
          label: "price",
          type: "price" as FieldType,
          required: true,
          gridWidth: 6,
          validation: {
            pattern: "^\\d+(\\.\\d{0,2})?$",
            message: "Please enter valid price",
            min: 0,
            max: 999999.99,
          },
        },
        {
          name: "quantityAvailable",
          label: "quantity",
          type: "number" as FieldType,
          required: true,
          gridWidth: 6,
          validation: {
            min: 0,
            message: "Quantity cannot be negative",
          },
        },
      ],
    },
    {
      id: "details",
      title: "details",
      fields: [
        {
          name: "instructorName",
          label: "instructorName",
          type: "text" as FieldType,
          gridWidth: 12,
          condition: (formData: FormData) => formData.productType === "lessons",
        },
        {
          name: "tourGuide",
          label: "tourGuide",
          type: "text" as FieldType,
          gridWidth: 12,
          condition: (formData: FormData) => formData.productType === "tours",
        },
        {
          name: "equipmentSize",
          label: "equipmentSize",
          type: "text" as FieldType,
          gridWidth: 12,
          condition: (formData: FormData) => formData.productType === "rentals",
        },
        {
          name: "notes",
          label: "notes",
          type: "textarea" as FieldType,
          rows: 3,
          gridWidth: 12,
        },
        {
          name: "location",
          label: "location",
          type: "gpsLocation",
          gridWidth: 12,
        },
      ],
    },
  ],
};

export default function ProductItemEditCard({
  item,
  onSave,
  onCancel,
  onDelete,
  onStatusChange,
}: ProductItemEditCardProps) {
  const { t } = useTranslation("product-items");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { confirmDialog } = useConfirmDialog();

  const initialData: FormData = {
    imageURL: item.imageURL || "",
    templateName: item.templateName,
    description: item.description || "",
    productDate: new Date(item.productDate),
    startTime: new Date(`1970-01-01T${item.startTime}`),
    duration: item.duration,
    price: item.price,
    quantityAvailable: item.quantityAvailable,
    instructorName: item.instructorName || "",
    tourGuide: item.tourGuide || "",
    equipmentSize: item.equipmentSize || "",
    notes: item.notes || "",
    productType: item.productType,
    location_latitude: item.location?.coordinates[1],
    location_longitude: item.location?.coordinates[0],
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
        imageURL: formData.imageURL as string,
        description: formData.description as string,
        productDate: formData.productDate as string,
        startTime: formData.startTime
          ? format(new Date(formData.startTime as string), "HH:mm")
          : undefined,
        duration: Number(formData.duration),
        price: Number(formData.price),
        quantityAvailable: Number(formData.quantityAvailable),
        notes: formData.notes as string,
        instructorName: formData.instructorName as string,
        tourGuide: formData.tourGuide as string,
        equipmentSize: formData.equipmentSize as string,
        latitude: Number(formData.location_latitude),
        longitude: Number(formData.location_longitude),
      };

      const response = await fetch(`${API_URL}/product-items/${item._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokensInfo.token}`,
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error("Failed to update product item");
      }

      onSave();
    } catch (error) {
      console.error("Error updating product item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    const confirmed = await confirmDialog({
      title: t("deleteConfirm.title"),
      message: t("deleteConfirm.message"),
      successButtonText: t("deleteConfirm.confirm"),
      cancelButtonText: t("deleteConfirm.cancel"),
    });

    if (confirmed) {
      setIsSubmitting(true);
      try {
        await onDelete(item._id);
        onSave();
      } catch (error) {
        console.error("Error deleting product item:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleStatusChange = async (status: ProductItemStatus) => {
    if (!onStatusChange || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onStatusChange(item._id, status);
      onSave();
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const editConfig = {
    ...enhancedProductItemConfig,
    type: "productItem" as const,
    approvalButtons: onStatusChange
      ? {
          type: "productItem" as const,
          currentStatus: item.itemStatus,
          onStatusChange: handleStatusChange,
        }
      : undefined,
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
