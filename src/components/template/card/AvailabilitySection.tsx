import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Clock, Users } from 'lucide-react';
import { useFormContext } from "react-hook-form";
import { useTranslation } from "@/services/i18n/client";
import { FormSection } from "./FormSection";

export function AvailabilitySection() {
  const { t } = useTranslation("templates");
  const { register } = useFormContext();

  return (
    <FormSection title={t('availability')}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          type="number"
          label={t('duration')}
          {...register('duration')}
          InputProps={{
            startAdornment: <Clock size={16} />,
            endAdornment: <Typography>hr</Typography>
          }}
        />
        <TextField
          fullWidth
          type="number"
          label={t('quantity')}
          {...register('quantity')}
          InputProps={{
            startAdornment: <Users size={16} />
          }}
        />
      </Box>
    </FormSection>
  );
}