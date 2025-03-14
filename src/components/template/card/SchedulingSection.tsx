import Box from "@mui/material/Box";
import { useTranslation } from "@/services/i18n/client";
import FormDatePickerInput from "@/components/form/date-pickers/date-picker";
import FormTimePickerInput from "@/components/form/date-pickers/time-picker";
import { FormSection } from "./FormSection";

export function SchedulingSection() {
  const { t } = useTranslation("templates");

  return (
    <FormSection title={t('scheduling')}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <FormDatePickerInput
            name="productDate"
            label={t('date')}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <FormTimePickerInput
            name="startTime"
            label={t('startTime')}
          />
        </Box>
      </Box>
    </FormSection>
  );
}
