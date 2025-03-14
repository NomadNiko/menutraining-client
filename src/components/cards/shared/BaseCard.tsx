import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useTranslation } from "@/services/i18n/client";
import { BaseCardProps, FormData } from './types';
import { FormValuesMonitor } from './FormValuesMonitor';
import { SharedCardActions } from './SharedCardActions';

export const BaseCard: React.FC<BaseCardProps> = ({
  config,
  initialData,
  onSave,
  onCancel,
  onDelete,
  customActions,
  isSubmitting = false,
  onChange,
  mode = 'edit',
  children
}) => {
  const { t } = useTranslation('tests');
  const methods = useForm<FormData>({ defaultValues: initialData });

  return (
    <FormProvider {...methods}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {t(config.title)}
          </Typography>
          
          <FormValuesMonitor onChange={onChange} />
          
          {children}
          
          <SharedCardActions
            onSave={onSave}
            onCancel={onCancel}
            onDelete={onDelete}
            isSubmitting={isSubmitting}
            methods={methods}
            customActions={customActions}
            t={t}
            type={config.type}
            mode={mode}
          />
        </CardContent>
      </Card>
    </FormProvider>
  );
};

export default BaseCard;