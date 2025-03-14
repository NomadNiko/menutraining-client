import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useGooglePlaces, PlaceResult } from '@/hooks/use-google-places';
import { debounce } from 'lodash';

interface AddressInputProps {
  value: string;
  onChange: (value: PlaceResult) => void;
  error?: string;
  disabled?: boolean;
  label: string;
}

export const AddressInput: React.FC<AddressInputProps> = ({
  value,
  onChange,
  error,
  disabled,
  label
}) => {
  const { isLoaded, getPlacePredictions, getPlaceDetails } = useGooglePlaces();
  const [inputValue, setInputValue] = useState(value);
  const [options, setOptions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPredictions = debounce(async (input: string) => {
    if (!input || input.length < 3) {
      setOptions([]);
      return;
    }
    setLoading(true);
    const predictions = await getPlacePredictions(input);
    setOptions(predictions);
    setLoading(false);
  }, 300);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleAddressSelect = async (prediction: google.maps.places.AutocompletePrediction | null) => {
    if (!prediction) return;
    
    const placeDetails = await getPlaceDetails(prediction.place_id);
    if (placeDetails) {
      onChange(placeDetails);
    }
  };

  if (!isLoaded) {
    return <TextField 
      fullWidth 
      label={label} 
      disabled 
      value="Loading address lookup..."
    />;
  }

  return (
    <Autocomplete
      freeSolo
      options={options}
      getOptionLabel={(option) => 
        typeof option === 'string' ? option : option.description
      }
      loading={loading}
      value={inputValue}
      onChange={(_, newValue) => {
        if (typeof newValue === 'string') {
          setInputValue(newValue);
        } else if (newValue) {
          handleAddressSelect(newValue);
        }
      }}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
        fetchPredictions(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={!!error}
          helperText={error}
          disabled={disabled}
          fullWidth
        />
      )}
    />
  );
};