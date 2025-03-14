import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { FormData } from './types';
import { Binoculars, GraduationCap, Timer, Ticket } from 'lucide-react';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { useTranslation } from "@/services/i18n/client";
import { styled } from '@mui/material/styles';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  width: '100%',
  '& .MuiToggleButton-root': {
    flex: 1,
    padding: theme.spacing(1),
    minWidth: '120px',
    border: `1px solid ${theme.palette.divider}`,
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      }
    },
  }
}));

interface ProductTypeToggleProps {
  name: string;
  label: string;
  required?: boolean;
}

export const ProductTypeToggle: React.FC<ProductTypeToggleProps> = ({
  name,
  label,
  required = false
}) => {
  const { t } = useTranslation("tests");
  const { setValue, control } = useFormContext<FormData>();
  const value = useWatch({
    control,
    name,
  });

  const handleChange = (_: React.MouseEvent<HTMLElement>, newValue: string | null) => {
    if (newValue !== null) {
      setValue(name, newValue, { shouldValidate: true });
    }
  };

  return (
    <Box>
      <Typography 
        variant="subtitle2" 
        sx={{ mb: 1 }}
      >
        {t(label)} {required && '*'}
      </Typography>
      <StyledToggleButtonGroup
        value={value}
        exclusive
        onChange={handleChange}
        aria-label="product type"
      >
        <ToggleButton value="tours">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Binoculars size={16} />
            <span>Tours</span>
          </Box>
        </ToggleButton>
        <ToggleButton value="lessons">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GraduationCap size={16} />
            <span>Lessons</span>
          </Box>
        </ToggleButton>
        <ToggleButton value="rentals">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Timer size={16} />
            <span>Rentals</span>
          </Box>
        </ToggleButton>
        <ToggleButton value="tickets">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Ticket size={16} />
            <span>Tickets</span>
          </Box>
        </ToggleButton>
      </StyledToggleButtonGroup>
    </Box>
  );
};

export default ProductTypeToggle;