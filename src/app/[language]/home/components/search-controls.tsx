import { useState, useEffect } from "react";
import { ViewState } from "react-map-gl";
import { Search, Store, MapPin, Ticket } from "lucide-react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import { Product, ProductStatusEnum } from "@/app/[language]/types/product";
import { useTranslation } from "@/services/i18n/client";
import { useGooglePlaces } from "@/hooks/use-google-places";
import { Vendor, VendorStatusEnum } from "@/app/[language]/types/vendor";
import { useGetProductsService } from "@/services/api/services/products";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { MapRef } from 'react-map-gl';
import { BBox } from 'geojson';

type SearchMode = "vendor" | "map";

interface SearchControlsProps {
  vendors: Vendor[];
  viewState: ViewState;
  setViewState: (viewState: ViewState) => void;
  onVendorSelect: (vendor: Vendor) => void;
  mapRef: React.RefObject<MapRef | null>; 
  setBounds: (bounds: BBox) => void;
}

interface SearchResult {
  type: "vendor" | "product";
  id: string;
  name: string;
  description?: string;
  location: {
    coordinates: [number, number];
  };
}

export const SearchControls = ({
  vendors,
  viewState,
  setViewState,
  onVendorSelect,
  mapRef,
  setBounds,
}: SearchControlsProps) => {
  const { t } = useTranslation("home");
  const { getPlacePredictions, getPlaceDetails } = useGooglePlaces();
  const getProducts = useGetProductsService();

  const [searchMode, setSearchMode] = useState<SearchMode>("vendor");
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [locationResults, setLocationResults] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        if (response.status === HTTP_CODES_ENUM.OK && response.data) {
          const publishedProducts = response.data.data.filter(
            (product) => product.productStatus === ProductStatusEnum.PUBLISHED
          );
          setProducts(publishedProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [getProducts]);

  const handleSearchModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: SearchMode | null
  ) => {
    if (newMode) {
      setSearchMode(newMode);
      setSearchQuery("");
      setShowResults(false);
      setSearchResults([]);
      setLocationResults([]);
    }
  };

  useEffect(() => {
    if (searchMode === "vendor" && searchQuery) {
      setIsSearching(true);
      const lowercaseQuery = searchQuery.toLowerCase();

      // Search in vendors
      const vendorResults: SearchResult[] = vendors
        .filter(
          (vendor) =>
            vendor.vendorStatus === VendorStatusEnum.APPROVED &&
            (vendor.businessName.toLowerCase().includes(lowercaseQuery) ||
              vendor.description.toLowerCase().includes(lowercaseQuery))
        )
        .map((vendor) => ({
          type: "vendor",
          id: vendor._id,
          name: vendor.businessName,
          description: vendor.description,
          location: vendor.location,
        }));

      // Search in products
      const productResults: SearchResult[] = products
        .filter(
          (product) =>
            product.productName.toLowerCase().includes(lowercaseQuery) ||
            (product.productDescription &&
              product.productDescription.toLowerCase().includes(lowercaseQuery))
        )
        .map((product) => ({
          type: "product",
          id: product._id,
          name: product.productName,
          description: product.productDescription,
          location: product.location,
        }));

      // Combine and sort results
      const combinedResults = [...vendorResults, ...productResults];
      setSearchResults(combinedResults);
      setShowResults(true);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchMode, vendors, products]);

  const handleLocationSearch = async (query: string) => {
    if (!query || searchMode !== "map") return;
    setIsSearching(true);
    try {
      const predictions = await getPlacePredictions(query);
      setLocationResults(predictions);
      setShowResults(true);
    } catch (error) {
      console.error("Error fetching predictions:", error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery && searchMode === "map") {
        handleLocationSearch(searchQuery);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchMode]);

  const handleResultSelect = async (result: SearchResult) => {
    // Update map location
    setViewState({
      ...viewState,
      longitude: result.location.coordinates[0],
      latitude: result.location.coordinates[1],
      zoom: 18,
    });
    setShowResults(false);
    setSearchQuery("");
  
    // Allow time for the map to move, then update bounds
    setTimeout(() => {
      const map = mapRef.current?.getMap();
      if (map) {
        const bounds = map.getBounds();
        if (bounds) {
          setBounds([
            bounds.getWest(),
            bounds.getSouth(),
            bounds.getEast(),
            bounds.getNorth(),
          ]);
        }
      }
    }, 300);  // Wait for map movement to complete
  
    // Find and open the corresponding vendor
    if (result.type === 'vendor') {
      const vendor = vendors.find(v => v._id === result.id);
      if (vendor) {
        onVendorSelect(vendor);
      }
    } else {
      const product = products.find(p => p._id === result.id);
      if (product) {
        const vendor = vendors.find(v => v._id === product.vendorId);
        if (vendor) {
          onVendorSelect(vendor);
        }
      }
    }
  };

  const handleLocationSelect = async (placeId: string) => {
    setIsSearching(true);
    try {
      const details = await getPlaceDetails(placeId);
      if (details) {
        setViewState({
          ...viewState,
          latitude: details.latitude,
          longitude: details.longitude,
          zoom: 18,
        });
        setShowResults(false);
        setSearchQuery("");
  
        setTimeout(() => {
          const map = mapRef.current?.getMap();
          if (map) {
            const bounds = map.getBounds();
            if (bounds) {
              setBounds([
                bounds.getWest(),
                bounds.getSouth(),
                bounds.getEast(),
                bounds.getNorth(),
              ]);
            }
          }
        }, 300); // Same timeout as in handleResultSelect
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
        <TextField
          sx={{
            width: { xs: "87%", md: "94%", lg: "100%" },
            alignSelf: "flex-start",
          }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            searchMode === "vendor"
              ? t("searchPlaceholder.vendor")
              : t("searchPlaceholder.location")
          }
          InputProps={{
            startAdornment: <Search size={20} className="mr-2" />,
            endAdornment: (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {isSearching && <CircularProgress size={20} sx={{ mr: 1 }} />}
                <ToggleButtonGroup
                  value={searchMode}
                  exclusive
                  onChange={handleSearchModeChange}
                  size="small"
                >
                  <ToggleButton value="vendor">
                    <Store size={16} />
                  </ToggleButton>
                  <ToggleButton value="map">
                    <MapPin size={16} />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            ),
            sx: {
              backgroundColor: "background.glass",
              backdropFilter: "blur(10px)",
            },
          }}
        />
      </Box>
      {showResults && searchQuery && (
        <Paper
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            mt: 1,
            maxHeight: "400px",
            overflow: "auto",
            zIndex: 2,
            backgroundColor: "background.glass",
            backdropFilter: "blur(10px)",
          }}
        >
          <List>
            {searchMode === "vendor" ? (
              searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <ListItem key={result.id} disablePadding>
                    <ListItemButton onClick={() => handleResultSelect(result)}>
                      <ListItemIcon>
                        {result.type === "vendor" ? (
                          <Store size={20} />
                        ) : (
                          <Ticket size={20} />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={result.name}
                        secondary={result.description}
                      />
                    </ListItemButton>
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary={t("noResults")} />
                </ListItem>
              )
            ) : (
              locationResults.map((result) => (
                <ListItem key={result.place_id} disablePadding>
                  <ListItemButton
                    onClick={() => handleLocationSelect(result.place_id)}
                  >
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
};
