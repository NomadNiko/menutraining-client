import { useEffect, useState } from 'react';
import { Control, Controller } from "react-hook-form";
import { FormData } from './types';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';

interface CurrencyOption {
  code: string;
  symbol: string;
  label: string;
}

const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
];

interface BaseCurrencyInputProps {
  name: string;
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  onBlur: () => void;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  onCurrencyChange?: (currency: string) => void;
}

const formatValue = (value: number | null): string => {
  if (value === null || value === undefined) return '';
  return value.toString();
};

const BaseCurrencyInput = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  required = false,
  disabled = false,
  onCurrencyChange
}: BaseCurrencyInputProps) => {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption>(CURRENCY_OPTIONS[0]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [displayValue, setDisplayValue] = useState<string>(formatValue(value));
  
  const handleCurrencyClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCurrencySelect = (currency: CurrencyOption) => {
    setSelectedCurrency(currency);
    if (onCurrencyChange) {
      onCurrencyChange(currency.code);
    }
    handleMenuClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);
    const newValue = inputValue === '' ? null : parseFloat(inputValue);
    onChange(isNaN(newValue as number) ? null : newValue);
  };

  const handleInputBlur = () => {
    if (value !== null && value !== undefined) {
      // Check if it's a valid number
      const numValue = Number(value);
      if (isNaN(numValue)) {
        // If not a valid number, clear the field
        setDisplayValue('');
        onChange(null);
      } else {
        // If valid number, format to 2 decimal places
        const formattedValue = numValue.toFixed(2);
        setDisplayValue(formattedValue);
        onChange(parseFloat(formattedValue));
      }
    }
    onBlur();
  };

  // Update display value when controlled value changes
  useEffect(() => {
    setDisplayValue(formatValue(value));
  }, [value]);

  return (
    <>
      <TextField
        name={name}
        fullWidth
        label={label}
        type="number"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleInputBlur}
        error={error}
        helperText={helperText}
        required={required}
        disabled={disabled}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton
                onClick={handleCurrencyClick}
                size="small"
                sx={{ 
                  fontSize: '0.875rem',
                  color: 'text.secondary',
                  '&:hover': {
                    backgroundColor: 'background.glassHover'
                  }
                }}
              >
                {selectedCurrency.symbol}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'background.glass',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              backgroundColor: 'background.glassHover',
            },
            '&.Mui-focused': {
              backgroundColor: 'background.glass',
              boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}`,
            }
          }
        }}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: 'background.glass',
            backdropFilter: 'blur(10px)',
            border: '1px solid',
            borderColor: 'divider'
          }
        }}
      >
        {CURRENCY_OPTIONS.map((currency) => (
          <MenuItem
            key={currency.code}
            onClick={() => handleCurrencySelect(currency)}
            selected={currency.code === selectedCurrency.code}
            sx={{
              '&:hover': {
                backgroundColor: 'background.glassHover'
              },
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  backgroundColor: 'primary.dark'
                }
              }
            }}
          >
            {currency.symbol} - {currency.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

interface FormCurrencyInputProps {
  name: string;
  label: string;
  control: Control<FormData>;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  onCurrencyChange?: (currency: string) => void;
}

const FormCurrencyInput = ({
  name,
  label,
  control,
  error,
  required = false,
  disabled = false,
  onCurrencyChange
}: FormCurrencyInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      render={({ field: { onChange, value, ...field } }) => (
        <BaseCurrencyInput
          {...field}
          label={label}
          value={value as number | null}
          onChange={onChange}
          error={!!error}
          helperText={error}
          required={required}
          disabled={disabled}
          onCurrencyChange={onCurrencyChange}
        />
      )}
    />
  );
};

export { BaseCurrencyInput };
export default FormCurrencyInput;