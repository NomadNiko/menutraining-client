import TextField from "@mui/material/TextField";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "@/services/i18n/client";
import { FormSection } from "./FormSection";
import { Template } from '../types/template.types';

interface AdditionalDetailsSectionProps {
  productType: Template['productType'];
}

export function AdditionalDetailsSection({ productType }: AdditionalDetailsSectionProps) {
  const { t } = useTranslation("templates");
  const { register } = useFormContext();

  return (
    <FormSection title={t('additionalDetails')}>
      {productType === 'lessons' && (
        <TextField
          fullWidth
          label={t('instructorName')}
          {...register('instructorName')}
          sx={{ mb: 2 }}
        />
      )}
      {productType === 'tours' && (
        <TextField
          fullWidth
          label={t('tourGuide')}
          {...register('tourGuide')}
          sx={{ mb: 2 }}
        />
      )}
      <TextField
        fullWidth
        multiline
        rows={4}
        label={t('notes')}
        {...register('notes')}
      />
    </FormSection>
  );
}