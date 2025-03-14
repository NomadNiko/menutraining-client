import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Control, useController } from 'react-hook-form';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import { FormData } from './types';

const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2)
}));

const UnitContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  backgroundColor: alpha(theme.palette.background.paper, 0.4),
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  width: '100%',
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: alpha(theme.palette.action.hover, 0.4),
  }
}));

interface DurationPickerProps {
  name: string;
  label: string;
  control: Control<FormData>;
  required?: boolean;
  error?: string;
}

const LIMITS = {
  weeks: 4,
  days: 6,
  hours: 23,
  minutes: 59
};

const MINUTE_STEP = 5;

const DurationPicker = ({ name, label, control, required = false, error }: DurationPickerProps) => {
  const {
    field: { value, onChange }
  } = useController({
    name,
    control,
    rules: { required }
  });

  // Convert total minutes to weeks, days, hours, minutes
  const totalMinutes = Number(value) || 0;
  const weeks = Math.floor(totalMinutes / (7 * 24 * 60));
  const remainingDays = Math.floor((totalMinutes % (7 * 24 * 60)) / (24 * 60));
  const remainingHours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const remainingMinutes = totalMinutes % 60;

  const handleChange = (unit: 'weeks' | 'days' | 'hours' | 'minutes', delta: number) => {
    let newWeeks = weeks;
    let newDays = remainingDays;
    let newHours = remainingHours;
    let newMinutes = remainingMinutes;

    switch (unit) {
      case 'weeks':
        newWeeks = (weeks + delta + LIMITS.weeks + 1) % (LIMITS.weeks + 1);
        break;
      case 'days':
        newDays = (remainingDays + delta + LIMITS.days + 1) % (LIMITS.days + 1);
        break;
      case 'hours':
        newHours = (remainingHours + delta + LIMITS.hours + 1) % (LIMITS.hours + 1);
        break;
      case 'minutes':
        newMinutes = (remainingMinutes + (delta * MINUTE_STEP) + LIMITS.minutes + 1) % (LIMITS.minutes + 1);
        // Round to nearest MINUTE_STEP
        newMinutes = Math.round(newMinutes / MINUTE_STEP) * MINUTE_STEP;
        break;
    }

    const newTotalMinutes = 
      (newWeeks * 7 * 24 * 60) + 
      (newDays * 24 * 60) + 
      (newHours * 60) + 
      newMinutes;

    onChange(newTotalMinutes);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography 
        variant="subtitle2" 
        gutterBottom 
        color={error ? 'error' : 'text.secondary'}
      >
        {label} {required && <Box component="span" color="error.main">*</Box>}
      </Typography>
      
      <StyledContainer>
        {/* Weeks */}
        <UnitContainer>
          <StyledIconButton onClick={() => handleChange('weeks', 1)}>
            <ChevronUp size={20} />
          </StyledIconButton>
          
          <Typography variant="h6" sx={{ my: 1 }}>
            {weeks.toString().padStart(2, '0')}
          </Typography>
          
          <StyledIconButton onClick={() => handleChange('weeks', -1)}>
            <ChevronDown size={20} />
          </StyledIconButton>
          
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            Wks
          </Typography>
        </UnitContainer>

        {/* Days */}
        <UnitContainer>
          <StyledIconButton onClick={() => handleChange('days', 1)}>
            <ChevronUp size={20} />
          </StyledIconButton>
          
          <Typography variant="h6" sx={{ my: 1 }}>
            {remainingDays.toString().padStart(2, '0')}
          </Typography>
          
          <StyledIconButton onClick={() => handleChange('days', -1)}>
            <ChevronDown size={20} />
          </StyledIconButton>
          
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            Days
          </Typography>
        </UnitContainer>

        {/* Hours */}
        <UnitContainer>
          <StyledIconButton onClick={() => handleChange('hours', 1)}>
            <ChevronUp size={20} />
          </StyledIconButton>
          
          <Typography variant="h6" sx={{ my: 1 }}>
            {remainingHours.toString().padStart(2, '0')}
          </Typography>
          
          <StyledIconButton onClick={() => handleChange('hours', -1)}>
            <ChevronDown size={20} />
          </StyledIconButton>
          
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            Hrs
          </Typography>
        </UnitContainer>

        {/* Minutes */}
        <UnitContainer>
          <StyledIconButton onClick={() => handleChange('minutes', 1)}>
            <ChevronUp size={20} />
          </StyledIconButton>
          
          <Typography variant="h6" sx={{ my: 1 }}>
            {remainingMinutes.toString().padStart(2, '0')}
          </Typography>
          
          <StyledIconButton onClick={() => handleChange('minutes', -1)}>
            <ChevronDown size={20} />
          </StyledIconButton>
          
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            Mins
          </Typography>
        </UnitContainer>
      </StyledContainer>
      
      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default DurationPicker;