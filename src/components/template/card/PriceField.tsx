import TextField from "@mui/material/TextField";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "@/services/i18n/client";

export function PriceField() {
  const { t } = useTranslation("templates");
  const { register } = useFormContext();

  return (
    <TextField
      fullWidth
      type="number"
      label={t('price')}
      {...register('price')}
      sx={{ mb: 3 }}
    />
  );
}
