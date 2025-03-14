import { useEffect, useRef, useState } from 'react';

export interface PlaceResult {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: number;
  longitude: number;
}

export const useGooglePlaces = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const geocoder = useRef<google.maps.Geocoder | null>(null);
  
  useEffect(() => {
    // Load Google Maps JavaScript API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => {
      autocompleteService.current = new google.maps.places.AutocompleteService();
      placesService.current = new google.maps.places.PlacesService(document.createElement('div'));
      geocoder.current = new google.maps.Geocoder();
      setIsLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const getPlacePredictions = async (input: string): Promise<google.maps.places.AutocompletePrediction[]> => {
    if (!autocompleteService.current) {
      return [];
    }

    try {
      const response = await autocompleteService.current.getPlacePredictions({
        input,
        types: ['geocode']
      });
      return response.predictions;
    } catch (error) {
      console.error('Error fetching place predictions:', error);
      return [];
    }
  };

  const getPlaceDetails = async (placeId: string): Promise<PlaceResult | null> => {
    if (!placesService.current || !geocoder.current) {
      return null;
    }

    try {
      const place = await new Promise<google.maps.places.PlaceResult>((resolve, reject) => {
        placesService.current!.getDetails(
          { placeId, fields: ['address_components', 'geometry'] },
          (result, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && result) {
              resolve(result);
            } else {
              reject(new Error('Failed to get place details'));
            }
          }
        );
      });

      const addressComponents = place.address_components || [];
      const result: PlaceResult = {
        address: '',
        city: '',
        state: '',
        postalCode: '',
        latitude: place.geometry?.location?.lat() || 0,
        longitude: place.geometry?.location?.lng() || 0
      };

      // Parse address components
      addressComponents.forEach(component => {
        const type = component.types[0];
        if (type === 'street_number') {
          result.address = component.long_name;
        }
        if (type === 'route') {
          result.address += (result.address ? ' ' : '') + component.long_name;
        }
        if (type === 'locality') {
          result.city = component.long_name;
        }
        if (type === 'administrative_area_level_1') {
          result.state = component.short_name;
        }
        if (type === 'postal_code') {
          result.postalCode = component.long_name;
        }
      });

      return result;
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
  };

  return {
    isLoaded,
    getPlacePredictions,
    getPlaceDetails
  };
};