
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateCard } from '@/components/cards/create-cards/CreateCard';
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { productConfig } from '@/components/cards/create-cards/configs';
import { FormData } from '@/components/cards/shared/types';
import { format } from 'date-fns';

export default function ProductCreateCard() {
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

      const submissionData = {
        productName: formData.productName as string,
        productDescription: formData.productDescription as string,
        productType: formData.productType as string,
        productPrice: Number(formData.productPrice),
        productDuration: formData.productDuration ? Number(formData.productDuration) : undefined,
        productDate: formData.productDate ? format(new Date(formData.productDate as string), 'yyyy-MM-dd') : undefined,
        productStartTime: formData.productStartTime ? format(new Date(formData.productStartTime as string), 'HH:mm') : undefined,   
        productImageURL: formData.productImageURL as string,
        productAdditionalInfo: formData.productAdditionalInfo as string | undefined,
        productRequirements: formData.productRequirements as string[] | undefined, 
        productWaiver: formData.productWaiver as string | undefined,
        productStatus: 'DRAFT',
        vendorId: formData.vendorId as string,
        latitude: formData.latitude as number, 
        longitude: formData.longitude as number
      };
      
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokensInfo.token}`  
        },
        body: JSON.stringify(submissionData)
      });

      if (response.ok) {
        router.push('/products');  
      } else {
        throw new Error('Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setIsSubmitting(false);  
    }
  };

  const handleCancel = () => {
    router.push('/products');  
  };

  return (
    <CreateCard 
      config={productConfig}
      initialData={{}} 
      onSave={handleSave}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
    />
  );
}