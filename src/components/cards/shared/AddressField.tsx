import React, { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useGooglePlaces } from '@/hooks/use-google-places';
import { useTranslation } from '@/services/i18n/client';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import { MapPin, X } from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import { FormData, AddressFieldProps } from './types';

export const AddressField: React.FC<AddressFieldProps> = ({ field }) => {
  const { register, setValue, control } = useFormContext<FormData>();
  const { getPlacePredictions, getPlaceDetails } = useGooglePlaces();
  const { t } = useTranslation('tests');
  const theme = useTheme();

  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [isSearching, setIsSearching] = useState(true);

  const formValues = useWatch({
    control,
    name: ['address', 'city', 'state', 'postalCode', 'latitude', 'longitude']
  });
  
  const [address, city, state, postalCode, latitude, longitude] = formValues;

  const handleAddressChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setValue('address', input);
    
    if (input.length > 3) {
      const newPredictions = await getPlacePredictions(input);
      setPredictions(newPredictions);
    } else {
      setPredictions([]);
    }
  };

  const handleAddressSelect = async (prediction: google.maps.places.AutocompletePrediction) => {
    const details = await getPlaceDetails(prediction.place_id);
    if (details) {
      setValue('address', details.address);
      setValue('city', details.city);
      setValue('state', details.state);
      setValue('postalCode', details.postalCode);
      setValue('latitude', details.latitude);
      setValue('longitude', details.longitude);
      setIsSearching(false);
      setPredictions([]);
    }
  };

  const handleClear = () => {
    setValue('address', '');
    setValue('city', '');
    setValue('state', '');
    setValue('postalCode', '');
    setValue('latitude', 0);
    setValue('longitude', 0);
    setIsSearching(true);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {isSearching ? (
        <Box sx={{ position: 'relative' }}>
          <TextField
            {...register('address')}
            fullWidth
            label={t(field.label)}
            placeholder={t('startTypingAddress')}
            onChange={handleAddressChange}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <MapPin 
                  size={20} 
                  style={{ 
                    marginRight: theme.spacing(1), 
                    opacity: 0.5 
                  }} 
                />
              ),
            }}
            sx={{ mb: predictions.length > 0 ? 0 : theme.spacing(2) }}
          />
          {predictions.length > 0 && (
            <Paper 
              sx={{ 
                position: 'absolute', 
                width: '100%', 
                mt: theme.spacing(0.5),
                zIndex: 1000,
                maxHeight: theme.spacing(25),
                overflow: 'auto'
              }}
            >
              <List>
                {predictions.map((prediction) => (
                  <ListItemButton
                    key={prediction.place_id}
                    onClick={() => handleAddressSelect(prediction)}
                  >
                    <ListItemText primary={prediction.description} />
                  </ListItemButton>
                ))}
              </List>
            </Paper>
          )}
        </Box>
      ) : (
        <Box 
          sx={{ 
            display: 'flex',
            gap: theme.spacing(2),
            alignItems: 'flex-start',
            mt: theme.spacing(2)
          }}
        >
          <Box
            component="img"
            src={`https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=200x200&markers=color:red%7C${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
            alt="Location Map"
            sx={{
              width: theme.spacing(25),
              height: theme.spacing(25),
              objectFit: 'cover',
              borderRadius: theme.shape.borderRadius
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              {String(address)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {[city, state, postalCode].filter(Boolean).join(', ')}
            </Typography>
            <Button
              startIcon={<X size={16} />}
              onClick={handleClear}
              sx={{ mt: theme.spacing(2) }}
              color="error"
              variant="outlined"
              size="small"
            >
              {t('clear')}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AddressField;