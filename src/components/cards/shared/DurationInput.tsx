import React from 'react';
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { Control, useController, FieldValues, Path } from "react-hook-form";
import Box from "@mui/material/Box";
import { StyledToggleButtonGroup } from '@/components/map/styled-components';
import ToggleButton from "@mui/material/ToggleButton";

type IncrementType = '5mins' | '15mins' | 'hours' | 'days';

interface DurationInputProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  control: Control<TFieldValues>;
  required?: boolean;
  incrementType: IncrementType;
  onIncrementChange: (type: IncrementType) => void;
}

const generateDurationOptions = (incrementType: IncrementType): number[] => {
  switch(incrementType) {
    case '5mins':
      return Array.from({ length: 25 }, (_, i) => i * 5).filter(val => val <= 120);
    case '15mins':
      return Array.from({ length: 33 }, (_, i) => i * 15).filter(val => val <= 480);
    case 'hours':
      return Array.from({ length: 49 }, (_, i) => i * 60).filter(val => val <= 2880);
    case 'days':
      return Array.from({ length: 31 }, (_, i) => i * 1440);
    default:
      return [];
  }
};

const formatDuration = (minutes: number, incrementType: IncrementType): string => {
  if (minutes === 0) return "No duration";
  
  switch(incrementType) {
    case '5mins':
      return `${minutes} minutes`;
    case '15mins':
    case 'hours':
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      
      let durationString = "";
      
      if (hours > 0) {
        durationString += `${hours} hour${hours > 1 ? 's' : ''}`;
      }
      
      if (remainingMinutes > 0) {
        if (hours > 0) durationString += " ";
        durationString += `${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
      }
      
      return durationString;
    case 'days':
      const days = Math.floor(minutes / 1440);
      const remainingHours = Math.floor((minutes % 1440) / 60);
      
      let dayString = `${days} day${days > 1 ? 's' : ''}`;
      
      if (remainingHours > 0) {
        dayString += ` ${remainingHours} hour${remainingHours > 1 ? 's' : ''}`;
      }
      
      return dayString;
  }
};

export function DurationInput<TFieldValues extends FieldValues>({
  name,
  label,
  control,
  required = false,
  incrementType,
  onIncrementChange
}: DurationInputProps<TFieldValues>) {
  const {
    field,
    fieldState: { error }
  } = useController({
    name,
    control,
    rules: { required },
  });

  const durationOptions = generateDurationOptions(incrementType);

  return (
    <Box>
      <StyledToggleButtonGroup
        value={incrementType}
        exclusive
        onChange={(_, value) => value && onIncrementChange(value)}
        fullWidth
        size="small"
        sx={{ mb: 2 }}
      >
        <ToggleButton value="5mins">5 mins</ToggleButton>
        <ToggleButton value="15mins">15 mins</ToggleButton>
        <ToggleButton value="hours">Hours</ToggleButton>
        <ToggleButton value="days">Days</ToggleButton>
      </StyledToggleButtonGroup>
      
      <TextField
        {...field}
        select
        label={label}
        fullWidth
        error={!!error}
        helperText={error?.message}
        value={field.value || ''}
      >
        {durationOptions.map((duration) => (
          <MenuItem key={duration} value={duration}>
            {formatDuration(duration, incrementType)}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}

export default DurationInput;