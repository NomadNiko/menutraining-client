import { useState, useEffect } from 'react';
import { Search, MapPin, Store } from 'lucide-react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import { useGooglePlaces } from '@/hooks/use-google-places';
import { Vendor } from '@/app/[language]/types/vendor';

interface EnhancedSearchBarProps {
  vendors: Vendor[];
  onVendorSelect: (vendor: Vendor) => void;
  onLocationSelect: (lat: number, lng: number) => void;
}

export default function EnhancedSearchBar({ 
  vendors, 
  onVendorSelect, 
  onLocationSelect 
}: EnhancedSearchBarProps) {
  const [searchMode, setSearchMode] = useState<'vendor' | 'map'>('vendor');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [vendorResults, setVendorResults] = useState<Vendor[]>([]);
  const [locationResults, setLocationResults] = useState<google.maps.places.AutocompletePrediction[]>([]);
  
  const { getPlacePredictions, getPlaceDetails } = useGooglePlaces();

  // Handle vendor search
  useEffect(() => {
    if (searchMode === 'vendor' && searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = vendors.filter(vendor => 
        vendor.businessName.toLowerCase().includes(lowercaseQuery) ||
        vendor.description.toLowerCase().includes(lowercaseQuery)
      );
      setVendorResults(filtered);
      setShowResults(true);
    } else {
      setVendorResults([]);
    }
  }, [searchQuery, searchMode, vendors]);

  // Handle location search
  const handleLocationSearch = async (query: string) => {
    if (!query || searchMode !== 'map') return;
    
    setIsLoading(true);
    try {
      const predictions = await getPlacePredictions(query);
      setLocationResults(predictions);
      setShowResults(true);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search for locations
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery && searchMode === 'map') {
        handleLocationSearch(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchMode]);

  const handleLocationSelect = async (placeId: string) => {
    setIsLoading(true);
    try {
      const details = await getPlaceDetails(placeId);
      if (details) {
        onLocationSelect(details.latitude, details.longitude);
        setShowResults(false);
        setSearchQuery('');
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVendorSelect = (vendor: Vendor) => {
    onVendorSelect(vendor);
    setShowResults(false);
    setSearchQuery('');
  };

  return (
    <Box sx={{ 
      position: 'relative',
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <Box sx={{ 
        display: 'flex',
        gap: 1,
        mb: 1
      }}>
        <ToggleButtonGroup
          value={searchMode}
          exclusive
          onChange={(_, value) => value && setSearchMode(value)}
          size="small"
          sx={{
            backgroundColor: 'background.glass',
            backdropFilter: 'blur(10px)',
          }}
        >
          <ToggleButton value="vendor">
            <Store size={16} className="mr-2" />
            Vendor Search
          </ToggleButton>
          <ToggleButton value="map">
            <MapPin size={16} className="mr-2" />
            Map Search
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <TextField
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={searchMode === 'vendor' ? 'Search vendors...' : 'Search locations...'}
        InputProps={{
          startAdornment: <Search size={20} className="mr-2" />,
          endAdornment: isLoading && <CircularProgress size={20} />,
          sx: {
            backgroundColor: 'background.glass',
            backdropFilter: 'blur(10px)',
          }
        }}
      />

      {showResults && (searchQuery || isLoading) && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: 1,
            maxHeight: '400px',
            overflow: 'auto',
            zIndex: 1000,
            backgroundColor: 'background.glass',
            backdropFilter: 'blur(10px)',
          }}
        >
          <List>
            {searchMode === 'vendor' ? (
              vendorResults.length > 0 ? (
                vendorResults.map((vendor) => (
                  <ListItem key={vendor._id} disablePadding>
                    <ListItemButton onClick={() => handleVendorSelect(vendor)}>
                      <ListItemIcon>
                        <Store size={20} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={vendor.businessName}
                        secondary={vendor.description}
                      />
                    </ListItemButton>
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No vendors found" />
                </ListItem>
              )
            ) : (
              locationResults.map((result) => (
                <ListItem key={result.place_id} disablePadding>
                  <ListItemButton onClick={() => handleLocationSelect(result.place_id)}>
                    <ListItemIcon>
                      <MapPin size={20} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={result.structured_formatting.main_text}
                      secondary={result.structured_formatting.secondary_text}
                    />
                  </ListItemButton>
                </ListItem>
              ))
            )}
          </List>
        </Paper>
      )}
    </Box>
  );
}