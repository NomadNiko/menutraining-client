import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateCard } from "@/components/cards/create-cards/CreateCard";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { templateConfig } from "@/components/template/template-form-config";
import { FormData } from "@/components/cards/shared/types";

export default function TemplateCreateCard() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
  
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        router.push('/sign-in');
        return;
      }
  
      // Extract latitude and longitude from form data
      const submissionData = {
        ...formData,
        defaultLatitude: formData.latitude,
        defaultLongitude: formData.longitude,
        // Remove the individual fields used by AddressField
        latitude: undefined,
        longitude: undefined
      };
  
      const response = await fetch(`${API_URL}/product-templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokensInfo.token}`,
        },
        body: JSON.stringify(submissionData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create template');
      }
  
      router.push('/templates');
    } catch (error) {
      console.error('Error creating template:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/");
  };

  return (
    <CreateCard
      config={templateConfig}
      initialData={{}}
      onSave={handleSave}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
    />
  );
}
