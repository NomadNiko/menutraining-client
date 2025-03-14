import { useState } from "react";
import { useForm, FormProvider } from 'react-hook-form';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useTranslation } from "@/services/i18n/client";
import { useSnackbar } from "@/hooks/use-snackbar";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { format } from 'date-fns';
import { TemplateGenResponse } from '../types/template.types';
import { SchedulingSection } from "./SchedulingSection";
import { AvailabilitySection } from "./AvailabilitySection";
import { PriceField } from "./PriceField";
import { AdditionalDetailsSection } from "./AdditionalDetailsSection";
import { FormActions } from "./FormActions";
import MultiDateSelector from "./MultiDateSelector";

interface ItemGeneratorCardProps {
  template: TemplateGenResponse;
  onSuccess: () => void;
  onCancel: () => void;
}

interface GenerationFormData {
  selectedDates: Date[];
  startTime: string;
  duration: number;
  quantity: number;
  price: number;
  instructorName?: string;
  tourGuide?: string;
  equipmentSize?: string;
  notes?: string;
  productDate?: string;
}

export default function ItemGeneratorCard({
  template,
  onSuccess,
  onCancel
}: ItemGeneratorCardProps) {
  const { t } = useTranslation("templates");
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<GenerationFormData>({
    defaultValues: {
      selectedDates: [],
      startTime: '',
      productDate: '',
      duration: template.defaultDuration || 1,
      quantity: 1,
      price: template.basePrice,
      instructorName: '',
      tourGuide: '',
      equipmentSize: '',
      notes: ''
    }
  });

  const handleSubmit = async (data: GenerationFormData) => {
    try {
      setIsSubmitting(true);
      
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        enqueueSnackbar(t('errors.unauthorized'), { variant: 'error' });
        return;
      }

      const coordinates = template.location?.coordinates || [-157.8241926, 21.2758128];
      const [longitude, latitude] = coordinates;

      const datesToProcess = template.productType === 'tickets' 
        ? [new Date(data.productDate!)] 
        : data.selectedDates;

      const results = await Promise.all(datesToProcess.map(async (date) => {
        const submissionData = {
          templateId: template._id,
          vendorId: template.vendorId,
          productDate: format(date, 'yyyy-MM-dd'),
          startTime: data.startTime ? format(new Date(data.startTime as string), 'HH:mm') : undefined,  
          duration: Number(data.duration),
          price: Number(data.price),
          quantityAvailable: Number(data.quantity),
          longitude,
          latitude,
          location: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          instructorName: data.instructorName,
          tourGuide: data.tourGuide,
          equipmentSize: data.equipmentSize,
          notes: data.notes,
          requirements: template.requirements || [],
          waiver: template.waiver || '',
          additionalInfo: template.additionalInfo || ''
        };

        const response = await fetch(`${API_URL}/product-items/generate/${template._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokensInfo.token}`
          },
          body: JSON.stringify(submissionData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to generate item for ${format(date, 'MMM dd, yyyy')}`);
        }
        
        return response.json();
      }));

      const itemCount = results.length;
      enqueueSnackbar(
        t('success.itemsGenerated', { count: itemCount }), 
        { variant: 'success' }
      );
      onSuccess();
    } catch (error) {
      console.error('Error generating items:', error);
      enqueueSnackbar(
        error instanceof Error ? error.message : t('errors.generationFailed'), 
        { variant: 'error' }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {t('generateItems')} - {template.templateName}
          </Typography>
          
          <form onSubmit={methods.handleSubmit(handleSubmit)}>
            {template.productType !== 'tickets' ? (
              <Grid item xs={12} sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {t('selectDates')}
                </Typography>
                <MultiDateSelector />
              </Grid>
            ) : (
              <SchedulingSection />
            )}
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <AvailabilitySection />
                <PriceField />
              </Grid>
              <Grid item xs={12} sm={6}>
                <AdditionalDetailsSection productType={template.productType} />
              </Grid>
            </Grid>

            <FormActions 
              onCancel={onCancel}
              isSubmitting={isSubmitting}
            />
          </form>
        </CardContent>
      </Card>
    </FormProvider>
  );
}