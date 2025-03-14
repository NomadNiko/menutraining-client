import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTranslation } from "@/services/i18n/client";

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
}

export function FormActions({ onCancel, isSubmitting }: FormActionsProps) {
  const { t } = useTranslation("templates");

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'flex-end', 
      gap: 2,
      mt: 4 
    }}>
      <Button
        variant="outlined"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        {t('cancel')}
      </Button>
      <Button
        variant="contained"
        type="submit"
        disabled={isSubmitting}
      >
        {t('generate')}
      </Button>
    </Box>
  );
}