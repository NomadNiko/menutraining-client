"use client";
import { useState, useRef, useEffect } from "react";
import Map, { MapRef, GeolocateControl, ViewState } from "react-map-gl";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { RefreshCw } from "lucide-react";
import { useTheme } from "@mui/material/styles";
import { useGetVendorsService } from "@/services/api/services/vendors";
import { Vendor, VendorTypes } from "@/app/[language]/types/vendor";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { BBox } from "geojson";
import { useTranslation } from "@/services/i18n/client";
import { SearchControls } from "./components/search-controls";
import { VendorTypeFilters } from "./components/vendor-type-filters";
import { BottomNav } from "@/components/map/bottom-nav";
import { ClusteredVendorMarkers } from "@/components/vendor/clustered-vendor-markers";
import type { ErrorEvent } from 'react-map-gl';
import dynamic from 'next/dynamic';
import GetDirections from "@/components/map/GetDirections";

const VendorViews = dynamic(
  () => import('./components/vendor-views').then(mod => mod.VendorViews),
  { 
    ssr: false,
    loading: () => null 
  }
);

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const DEFAULT_VIEW_STATE: ViewState = {
  latitude: 21.277,
  longitude: -157.826,
  zoom: 14,
  bearing: 0,
  pitch: 0,
  padding: { top: 0, bottom: 0, left: 0, right: 0 },
};

const MapHomeLayout = () => {
  const { t } = useTranslation("home");
  const theme = useTheme();
  const mapRef = useRef<MapRef>(null);
  const getVendors = useGetVendorsService();

  const [mapKey, setMapKey] = useState(0);
  const [mapError, setMapError] = useState(false);
  const [viewState, setViewState] = useState<ViewState>(DEFAULT_VIEW_STATE);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showFullView, setShowFullView] = useState(false);
  const [filterTypes, setFilterTypes] = useState<VendorTypes[]>([]);
  const [bounds, setBounds] = useState<BBox | undefined>();
  const [retryCount, setRetryCount] = useState(0);
  const [showDirections, setShowDirections] = useState(false);
const [selectedLocation, setSelectedLocation] = useState<{latitude: number; longitude: number} | null>(null);

  const maxRetries = 3;

  const controlStyle = {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.glass,
    backdropFilter: "blur(10px)",
    color: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius,
    zIndex: 0,
  };

  const handleShowDirections = (location: {latitude: number; longitude: number}) => {
    setSelectedLocation(location);
    setShowDirections(true);
  };

  const handleMapError = (e: ErrorEvent) => {
    console.error('Map Error:', e);
    setMapError(true);
    
    if (retryCount < maxRetries) {
      setTimeout(() => {
        setMapKey(prev => prev + 1);
        setMapError(false);
        setRetryCount(prev => prev + 1);
      }, 1000);
    }
  };
  
  const handleManualRetry = () => {
    setMapError(false);
    setRetryCount(0);
    setMapKey(prev => prev + 1);
    window.location.reload();
  };

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const response = await getVendors();
        if (response.status === HTTP_CODES_ENUM.OK && response.data) {
          setVendors(response.data.data);
        } 
      } catch (error) {
        console.log(t("errors.failedToLoadVendors"));
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, [getVendors, t]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setViewState({
          ...DEFAULT_VIEW_STATE,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting user location:", error);
      }
    );
  }, []);

  const handleVendorSelect = (vendor: Vendor, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedVendor(vendor);
    setShowFullView(false);
  };

  const updateBounds = () => {
    const map = mapRef.current?.getMap();
    if (map) {
      const mapBounds = map.getBounds();
      if (mapBounds) {
        setBounds([
          mapBounds.getWest(),
          mapBounds.getSouth(),
          mapBounds.getEast(),
          mapBounds.getNorth(),
        ]);
      }
    }
  };

  const filteredVendors = vendors.filter(
    (vendor) =>
      filterTypes.length === 0 ||
      vendor.vendorTypes.some((type) => filterTypes.includes(type))
  );

  // useEffect(() => {
  //   if (vendors.length > 0) {
  //     setSelectedVendor(vendors[0]);
  //     setTimeout(() => setSelectedVendor(null), 100);
  //   }
  // }, [vendors]);

  if (loading) {
    return (
      <Box
        sx={{
          height: "calc(100vh - 64px)",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (mapError && retryCount >= maxRetries) {
    return (
      <Box
        sx={{
          height: "calc(100vh - 64px)",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Typography variant="h6">
          Unable to load the map
        </Typography>
        <Button
          variant="contained"
          startIcon={<RefreshCw />}
          onClick={handleManualRetry}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    

    
    <Box
      sx={{ height: "calc(100vh - 64px)", width: "100%", position: "relative" }}
    >

      <Map
        key={mapKey}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: "100%", height: "100%"}}
        ref={mapRef}
        onLoad={updateBounds}
        onMoveEnd={updateBounds}
        onError={handleMapError}
        maxZoom={20}
        minZoom={3}
        reuseMaps
        attributionControl={false}
      >
        <GeolocateControl
          position="top-right"
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation
          showUserHeading
          style={controlStyle}
        />
        <ClusteredVendorMarkers
          vendors={filteredVendors}
          onClick={handleVendorSelect}
          bounds={bounds}
          zoom={viewState.zoom}
        />
        {showDirections && selectedLocation && (
  <GetDirections
    destination={selectedLocation}
    onClose={() => {
      setShowDirections(false);
      setSelectedLocation(null);
    }}
  />
)}

        <Container
          maxWidth="sm"
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            pointerEvents: "none",
            "& > *": { pointerEvents: "auto" },
          }}
        >
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
            <SearchControls
              vendors={vendors}
              viewState={viewState}
              setViewState={setViewState}
              onVendorSelect={handleVendorSelect}
              mapRef={mapRef}
              setBounds={setBounds}
            />
            <VendorTypeFilters
              filterTypes={filterTypes}
              setFilterTypes={setFilterTypes}
            />
          </Box>
          <BottomNav 
  currentLocation={{ 
    latitude: viewState.latitude, 
    longitude: viewState.longitude 
  }}
  vendors={vendors}
  onShowDirections={handleShowDirections}
/>
        </Container>
      </Map>
      <VendorViews
        selectedVendor={selectedVendor}
        showFullView={showFullView}
        onViewMore={() => setShowFullView(true)}
        onClose={() => {
          setShowFullView(false);
          setSelectedVendor(null);
        }}
      />
    </Box>
  );
};

export default MapHomeLayout;