import { useCallback, useEffect, useState } from 'react';
import Map, { Marker, MarkerDragEvent, ViewState } from 'react-map-gl';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTheme } from '@mui/material/styles';
import { MapPin } from 'lucide-react';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface GPSLocationFieldProps {
  name: {
    latitude: string;
    longitude: string;
  };
  label?: string;
  error?: string;
}

export const GPSLocationField = ({
  name,
  label,
  error
}: GPSLocationFieldProps) => {
  const theme = useTheme();
  const { setValue, control } = useFormContext();

  const currentLongitude = useWatch({
    control,
    name: name.longitude
  });

  const currentLatitude = useWatch({
    control,
    name: name.latitude
  });

  const [viewState, setViewState] = useState<ViewState>({
    longitude: Number(currentLongitude),
    latitude: Number(currentLatitude),
    zoom: 15,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 }
  });

  const handleLocationChange = useCallback((lat: number, lng: number) => {
    setValue(name.longitude, lng, { shouldDirty: true, shouldTouch: true });
    setValue(name.latitude, lat, { shouldDirty: true, shouldTouch: true });
    setViewState(prev => ({
      ...prev,
      longitude: lng,
      latitude: lat
    }));
  }, [setValue, name]);

  useEffect(() => {
    setViewState(prev => ({
      ...prev,
      longitude: Number(currentLongitude),
      latitude: Number(currentLatitude)
    }));
  }, [currentLatitude, currentLongitude]);

  return (
    <Box sx={{ width: '100%' }}>
      {label && (
        <Typography 
          variant="subtitle2" 
          sx={{ mb: 1, color: error ? 'error.main' : 'text.secondary' }}
        >
          {label}
        </Typography>
      )}
      <Box
        sx={{
          height: 300,
          borderRadius: 1,
          overflow: 'hidden',
          border: 1,
          borderColor: error ? 'error.main' : 'divider'
        }}
      >
        <Map
          {...viewState}
          mapboxAccessToken={MAPBOX_TOKEN}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          style={{ width: '100%', height: '100%' }}
        >
          <Marker
            longitude={Number(currentLongitude)}
            latitude={Number(currentLatitude)}
            draggable
            onDragEnd={(event: MarkerDragEvent) => {
              handleLocationChange(event.lngLat.lat, event.lngLat.lng);
            }}
            anchor="bottom"
          >
            <Box sx={{ cursor: 'move' }}>
              <MapPin
                size={24}
                color={theme.palette.primary.main}
                fill={theme.palette.primary.main}
              />
            </Box>
          </Marker>
        </Map>
      </Box>
      {error && (
        <Typography 
          variant="caption" 
          color="error" 
          sx={{ mt: 0.5, display: 'block' }}
        >
          {error}
        </Typography>
      )}
      <Typography 
        variant="caption" 
        color="text.secondary"
        sx={{ mt: 0.5, display: 'block' }}
      >
        {`${Number(currentLatitude).toFixed(6)}, ${Number(currentLongitude).toFixed(6)}`}
      </Typography>
    </Box>
  );
};

export default GPSLocationField;