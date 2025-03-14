import React, { useState, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { X } from 'lucide-react';
import { FieldConfig } from './types';

interface ExtendedFormData {
  [key: string]: string[] | undefined;
}

interface DynamicRequirementsFieldProps {
  field: FieldConfig;
  mode?: 'edit' | 'create';
}

export const DynamicRequirementsField: React.FC<DynamicRequirementsFieldProps> = ({
  field,
  mode = 'edit'
}) => {
  const [inputValue, setInputValue] = useState('');
  const { setValue, control } = useFormContext<ExtendedFormData>();

  const requirements = useWatch({
    control,
    name: field.name
  });

  // Initialize current requirements directly from form data
  const [currentRequirements, setCurrentRequirements] = useState<string[]>(
    field.defaultValue as string[] || []
  );
  // Keep local state in sync with form data
  useEffect(() => {
    if (Array.isArray(requirements)) {
      setCurrentRequirements(requirements);
    }
  }, [requirements]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = inputValue.trim();
      
      if (value) {
        const updatedRequirements = [...currentRequirements, value];
        setCurrentRequirements(updatedRequirements);
        setValue(field.name, updatedRequirements);
        setInputValue('');
      }
    }
  };

  const handleRemoveRequirement = (index: number) => {
    const updatedRequirements = currentRequirements.filter((_, i) => i !== index);
    setCurrentRequirements(updatedRequirements);
    setValue(field.name, updatedRequirements);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        fullWidth
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Press Enter to add requirement"
        disabled={mode === 'edit' && field.prefilled}
      />
      
      {currentRequirements.length > 0 && (
        <Box sx={{ mt: 2 }}>
          {currentRequirements.map((req, index) => (
            <Typography
              key={index}
              variant="body2"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 0.5
              }}
            >
              • {req}
              <IconButton
                size="small"
                onClick={() => handleRemoveRequirement(index)}
                sx={{ ml: 'auto' }}
              >
                <X size={14} />
              </IconButton>
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default DynamicRequirementsField;