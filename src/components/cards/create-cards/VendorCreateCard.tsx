import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateCard } from '@/components/cards/create-cards/CreateCard';
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { vendorConfig } from '@/components/cards/create-cards/configs';
import { FormData } from '@/components/cards/shared/types';

export default function VendorCreateCard() {
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

      const locationData = {
        type: 'Point' as const,
        coordinates: [formData.longitude, formData.latitude] as [number, number]
      };

      const submissionData = {
        ...formData,
        vendorStatus: 'SUBMITTED',
        location: locationData,
        vendorTypes: ['tours']
      };

      const response = await fetch(`${API_URL}/vendors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokensInfo.token}`
        },
        body: JSON.stringify(submissionData)
      });

      if (response.ok) {
        router.push('/vendor-splash');
      } else {
        throw new Error('Failed to create vendor profile');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <CreateCard
      config={vendorConfig}
      initialData={{}}
      onSave={handleSave}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
    />
  );
}