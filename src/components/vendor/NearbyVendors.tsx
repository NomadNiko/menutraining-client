import React, { useState, useMemo, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { X, MapPin, Phone, Navigation, Store } from "lucide-react";
import { useTranslation } from "@/services/i18n/client";
import { Vendor, VendorStatusEnum } from "@/app/[language]/types/vendor";
import { useTheme } from "@mui/material/styles";
import { Image } from "@nextui-org/react";
import VendorFullView from './vendor-full';

// Calculation helper
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 3963; // Radius of Earth in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

interface VendorItemProps {
  vendor: Vendor;
  distance: number;
  onClick: () => void;
  onGetDirections: () => void;
}

const VendorItem: React.FC<VendorItemProps> = ({
  vendor,
  distance,
  onClick,
  onGetDirections,
}) => {
  const theme = useTheme();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  const handleDirectionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onGetDirections();
  };

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      mb: theme.spacing(1),
    }}>
      <Button
        onClick={handleClick}
        sx={{
          flex: 1,
          p: theme.spacing(2),
          textAlign: "left",
          display: "block",
          backgroundColor: "background.paper",
          "&:hover": {
            backgroundColor: "action.hover",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {vendor.logoUrl && (
            <Box sx={{ width: 40, height: 40, flexShrink: 0 }}>
              <Image
                src={vendor.logoUrl}
                alt={vendor.businessName}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </Box>
          )}
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" color="text.primary">
              {vendor.businessName}
            </Typography>
            <Box sx={{ display: "flex", gap: theme.spacing(2), mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <Phone
                  size={14}
                  style={{ verticalAlign: "middle", marginRight: theme.spacing(0.5) }}
                />
                {vendor.phone}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <MapPin
                  size={14}
                  style={{ verticalAlign: "middle", marginRight: theme.spacing(0.5) }}
                />
                {distance.toFixed(1)} mi
              </Typography>
            </Box>
          </Box>
        </Box>
      </Button>
      <IconButton 
        onClick={handleDirectionsClick}
        sx={{
          bgcolor: 'background.paper',
          '&:hover': {
            bgcolor: 'action.hover',
          },
          width: 40,
          height: 40,
          borderRadius: 1,
        }}
      >
        <Navigation size={20} />
      </IconButton>
    </Box>
  );
};

interface NearbyVendorsProps {
  isOpen: boolean;
  onClose: () => void;
  latitude: number;
  longitude: number;
  vendors: Vendor[];
  onShowDirections?: (location: { latitude: number; longitude: number }) => void;
}

const NearbyVendors: React.FC<NearbyVendorsProps> = ({
  isOpen,
  onClose,
  latitude,
  longitude,
  vendors,
  onShowDirections
}) => {
  const theme = useTheme();
  const { t } = useTranslation("home");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const RADIUS_MILES = 30;

  useEffect(() => {
    if (!isOpen) {
      setSelectedVendor(null);
    }
  }, [isOpen]);

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleVendorSelect = (vendor: Vendor) => {
    setSelectedVendor(vendor);
  };

  const handleVendorClose = () => {
    setSelectedVendor(null);
  };

  const handleGetDirections = (vendor: Vendor) => {
    if (onShowDirections && vendor.location?.coordinates) {
      // Extract coordinates from vendor location (in [longitude, latitude] format)
      const [longitude, latitude] = vendor.location.coordinates;
      // Pass them in the format expected by the directions component
      onShowDirections({ latitude, longitude });
      onClose();
    }
  };

  const sortedVendors = useMemo(() => {
    return vendors
      .filter(vendor => {
        if (vendor.vendorStatus !== VendorStatusEnum.APPROVED) return false;
        
        const distance = calculateDistance(
          latitude,
          longitude,
          vendor.location.coordinates[1],
          vendor.location.coordinates[0]
        );
        
        return distance <= RADIUS_MILES;
      })
      .map(vendor => ({
        ...vendor,
        distance: calculateDistance(
          latitude,
          longitude,
          vendor.location.coordinates[1],
          vendor.location.coordinates[0]
        )
      }))
      .sort((a, b) => (a.distance - b.distance));
  }, [vendors, latitude, longitude]);

  if (!isOpen) return null;

  return (
    <>
      <Box
        className="modal-content"
        onClick={handleModalClick}
        sx={{
          position: "fixed",
          bottom: { xs: 70, sm: 82 },
          left: { xs: 0, sm: '50%' },
          right: { xs: 0, sm: 'auto' },
          height: "75%",
          backgroundColor: "background.paper",
          borderTopLeftRadius: theme.spacing(2),
          borderTopRightRadius: theme.spacing(2),
          transform: { xs: 'none', sm: 'translateX(-50%)' },
          width: { xs: '100%', sm: '600px' },
          boxShadow: 3,
          zIndex: 75,
          display: "flex",
          flexDirection: "column",
          transition: "bottom 0.3s ease-in-out",
          background: "rgba(17, 25, 40, 0.75)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.125)",
          borderRadius: { xs: "12px 12px 0 0", sm: 2 },
        }}
      >
        <Box
          sx={{
            p: theme.spacing(2),
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Store size={20} />
            <Typography variant="h6">{t("nearbyVendors")}</Typography>
          </Box>
          <IconButton onClick={onClose}>
            <X />
          </IconButton>
        </Box>

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: theme.spacing(2),
          }}
        >
          {sortedVendors.length === 0 ? (
            <Typography
              color="text.secondary"
              align="center"
              sx={{ py: theme.spacing(4) }}
            >
              {t("noNearbyVendors")}
            </Typography>
          ) : (
            sortedVendors.map((vendor) => (
              <VendorItem
                key={vendor._id}
                vendor={vendor}
                distance={vendor.distance}
                onClick={() => handleVendorSelect(vendor)}
                onGetDirections={() => handleGetDirections(vendor)}
              />
            ))
          )}
        </Box>
      </Box>

      {selectedVendor && (
        <Box onClick={e => e.stopPropagation()}>
          <VendorFullView
            vendor={selectedVendor}
            onClose={handleVendorClose}
          />
        </Box>
      )}
    </>
  );
};

export default NearbyVendors;