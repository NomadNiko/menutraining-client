import React, { useState, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslation } from '@/services/i18n/client';
import { API_URL } from '@/services/api/config';
import { getTokensInfo } from '@/services/auth/auth-tokens-info';
import useAuth from '@/services/auth/use-auth';
import { Vendor } from '@/app/[language]/types/vendor';

interface VendorSelectProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
}

export const VendorSelect: React.FC<VendorSelectProps> = ({
  name,
  label,
  required = false,
  disabled = false
}) => {
  const { t } = useTranslation('products');
  const { user } = useAuth();
  const { register, setValue, control } = useFormContext();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Watch the current value
  const currentValue = useWatch({
    control,
    name,
  });

  useEffect(() => {
    const fetchUserVendors = async () => {
      try {
        setLoading(true);
        const tokensInfo = getTokensInfo();
        if (!tokensInfo?.token) {
          return;
        }

        const response = await fetch(`${API_URL}/v1/vendors/user/${user?.id}/owned`, {
          headers: {
            'Authorization': `Bearer ${tokensInfo.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch vendors');
        }

        const data = await response.json();
        setVendors(data.data);

        // Only set the first vendor if no value is currently selected
        if (data.data && data.data.length > 0 && !currentValue) {
          setValue(name, data.data[0]._id, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
          });
        }
      } catch (error) {
        console.error('Error fetching vendors:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchUserVendors();
    }
  }, [user?.id, t, setValue, name, currentValue]);

  return (
    <TextField
      {...register(name)}
      select
      fullWidth
      label={label}
      required={required}
      disabled={disabled || loading}
      value={currentValue || ''}
      onChange={(event) => {
        setValue(name, event.target.value, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        });
      }}
      InputProps={{
        startAdornment: loading ? (
          <CircularProgress size={20} sx={{ mr: 1 }} />
        ) : null,
      }}
    >
      {vendors.map((vendor) => (
        <MenuItem key={vendor._id} value={vendor._id}>
          {vendor.businessName}
        </MenuItem>
      ))}
    </TextField>
  );
};