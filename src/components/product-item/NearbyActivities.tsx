import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { X, Clock, MapPin } from "lucide-react";
import { useTranslation } from "@/services/i18n/client";
import { ProductItem } from "@/app/[language]/types/product-item";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import PublicItemDetailModal from "@/components/calendar/PublicItemDetailModal";
import { useCartQuery } from "@/hooks/use-cart-query";
import { useTheme } from "@mui/material/styles";
import useAuth from "@/services/auth/use-auth";
import { useAddToCartService } from "@/services/api/services/cart";

const formatDateTime = (dateStr: string, timeStr: string): string => {
  try {
    const date = parseISO(dateStr);
    const [hours, minutes] = timeStr.split(":").map(Number);
    if (
      isNaN(hours) ||
      isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      return format(date, "PPP");
    }
    const datetime = new Date(date.setHours(hours, minutes));
    return format(datetime, "PPp");
  } catch (error) {
    console.error("Error formatting date/time:", error);
    return "Invalid date";
  }
};

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
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

interface ActivityItemProps {
  activity: ProductItem;
  distance: number;
  onClick: () => void;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  activity,
  distance,
  onClick,
}) => {
  const theme = useTheme();

  return (
    <Button
      onClick={onClick}
      sx={{
        width: "100%",
        mb: theme.spacing(1),
        p: theme.spacing(2),
        textAlign: "left",
        display: "block",
        backgroundColor: "background.paper",
        "&:hover": {
          backgroundColor: "action.hover",
        },
      }}
    >
      <Typography variant="subtitle1" color="text.primary">
        {activity.templateName}
      </Typography>
      <Box
        sx={{ display: "flex", gap: theme.spacing(2), mt: theme.spacing(1) }}
      >
        <Typography variant="body2" color="text.secondary">
          <Clock
            size={14}
            style={{ verticalAlign: "middle", marginRight: theme.spacing(0.5) }}
          />
          {formatDateTime(activity.productDate, activity.startTime)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <MapPin
            size={14}
            style={{ verticalAlign: "middle", marginRight: theme.spacing(0.5) }}
          />
          {distance.toFixed(1)} mi
        </Typography>
      </Box>
    </Button>
  );
};

interface NearbyActivitiesProps {
  isOpen: boolean;
  onClose: () => void;
  latitude: number;
  longitude: number;
}

const NearbyActivities: React.FC<NearbyActivitiesProps> = ({
  isOpen,
  onClose,
  latitude,
  longitude,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation("home");
  const { user } = useAuth();
  const [activities, setActivities] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ProductItem | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const addToCart = useAddToCartService();
  const { refreshCart } = useCartQuery();

  useEffect(() => {
    const fetchNearbyActivities = async () => {
      try {
        setLoading(true);
        const tokensInfo = getTokensInfo();

        const today = new Date();
        const twoDaysFromNow = new Date(today);
        twoDaysFromNow.setDate(today.getDate() + 2);

        const response = await fetch(
          `${API_URL}/product-items/nearby-today?` +
            `lat=${latitude}&lng=${longitude}&radius=10&` +
            `startDate=${today.toISOString()}&endDate=${twoDaysFromNow.toISOString()}`,
          {
            headers: tokensInfo?.token
              ? {
                  Authorization: `Bearer ${tokensInfo.token}`,
                }
              : {},
          }
        );

        if (!response.ok) throw new Error("Failed to fetch nearby activities");
        const data = await response.json();
        setActivities(data.data);
      } catch (error) {
        console.error("Error fetching nearby activities:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && latitude && longitude) {
      fetchNearbyActivities();
    }
  }, [isOpen, latitude, longitude, t]);

  const handleAddToCart = async (item: ProductItem): Promise<void> => {
    try {
      setAddingToCart(item._id);

      if (user) {
        await addToCart({
          productItemId: item._id,
          productDate: new Date(item.productDate),
          quantity: 1,
          vendorId: item.vendorId,
          templateId: item.templateId,
        });
        await refreshCart();
      } else {
        router.push("/sign-in");
        return;
      }
      setSelectedItem(null);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setAddingToCart(null);
    }
  };

  const sortedActivities = [...activities].sort((a, b) => {
    const distA = calculateDistance(
      latitude,
      longitude,
      a.location.coordinates[1],
      a.location.coordinates[0]
    );
    const distB = calculateDistance(
      latitude,
      longitude,
      b.location.coordinates[1],
      b.location.coordinates[0]
    );
    return distA - distB;
  });

  useEffect(() => {
    if (!isOpen) {
      setSelectedItem(null);
    }
  }, [isOpen]);

  // Stop propagation for clicks inside the modal
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <Box
      className="modal-content" // Add this class for click handling
      onClick={handleModalClick} // Add click handler
      sx={{
        position: "fixed",
        bottom: { xs: 70, sm: 82 },
        left: { xs: 0, sm: "50%" },
        right: { xs: 0, sm: "auto" },
        height: "75%",
        backgroundColor: "background.paper",
        borderTopLeftRadius: theme.spacing(2),
        borderTopRightRadius: theme.spacing(2),
        transform: { xs: "none", sm: "translateX(-50%)" },
        width: { xs: "100%", sm: "600px" },
        boxShadow: 3,
        zIndex: 75,
        display: "flex",
        flexDirection: "column",
        transition: "bottom 0.3s ease-in-out", // Added smooth transition
        background: "rgba(17, 25, 40, 0.75)", // Added matching background
        backdropFilter: "blur(16px)", // Added matching blur effect
        border: "1px solid rgba(255, 255, 255, 0.125)", // Added matching border
        borderRadius: { xs: "12px 12px 0 0", sm: 2 }, // Added matching border radius
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
        <Typography variant="h6">{t("nearbyActivities")}</Typography>
        <Box
          sx={{ display: "flex", alignItems: "center", gap: theme.spacing(2) }}
        >
          <IconButton onClick={onClose}>
            <X />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: theme.spacing(2),
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: theme.spacing(4),
            }}
          >
            <CircularProgress />
          </Box>
        ) : sortedActivities.length === 0 ? (
          <Typography
            color="text.secondary"
            align="center"
            sx={{ py: theme.spacing(4) }}
          >
            {t("noNearbyActivities")}
          </Typography>
        ) : (
          sortedActivities.map((activity) => {
            const distance = calculateDistance(
              latitude,
              longitude,
              activity.location.coordinates[1],
              activity.location.coordinates[0]
            );

            return (
              <ActivityItem
                key={activity._id}
                activity={activity}
                distance={distance}
                onClick={() => setSelectedItem(activity)}
              />
            );
          })
        )}
      </Box>

      {selectedItem && (
        <Box onClick={(e) => e.stopPropagation()}>
          {" "}
          {/* Add click handler to prevent closing */}
          <PublicItemDetailModal
            item={selectedItem}
            open={true}
            onClose={() => setSelectedItem(null)}
            onAddToCart={handleAddToCart}
            isAddingToCart={addingToCart === selectedItem._id}
          />
        </Box>
      )}
    </Box>
  );
};

export default NearbyActivities;
