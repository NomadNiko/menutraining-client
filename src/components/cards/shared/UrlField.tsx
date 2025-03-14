// UrlField.tsx
import React from 'react';
import { useFormContext, useWatch } from "react-hook-form";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import { FormData, FieldConfig } from './types';

interface UrlFieldProps {
  field: FieldConfig;
  mode?: 'edit' | 'create';
}

export const UrlField: React.FC<UrlFieldProps> = ({ field, mode = 'edit' }) => {
  const { register, setValue } = useFormContext<FormData>();
  const urlValue = useWatch({ name: field.name });

  const formatUrl = (value: string) => {
    if (!value) return value;
    const cleanUrl = value.trim().replace(/^(https?:\/\/)?/, '');
    return cleanUrl ? `https://${cleanUrl}` : cleanUrl;
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatUrl(e.target.value);
    setValue(field.name, formattedValue);
  };

  return (
    <TextField
      {...register(field.name, { 
        required: field.required,
        disabled: mode === 'edit' && field.prefilled 
      })}
      label={field.label}
      fullWidth
      onChange={handleUrlChange}
      placeholder=""
      InputProps={{
        startAdornment: urlValue?.startsWith('https://') ? null : (
          <InputAdornment position="start">
            <Typography color="text.secondary">https://</Typography>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default UrlField;