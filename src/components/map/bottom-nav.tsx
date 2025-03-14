import { useState } from "react";
import { Store, FerrisWheel, Ticket, Receipt } from "lucide-react";
import Box from "@mui/material/Box";
import { NavButton } from "./styled-components";
import NearbyActivities from "@/components/product-item/NearbyActivities";
import NearbyVendors from "../vendor/NearbyVendors";
import { Vendor } from "@/app/[language]/types/vendor";
import UpcomingTicketsPanel from "../tickets/UpcomingTickets";
import PastReceipts from "../receipts/PastReceipts";

type ActiveWindow = "activities" | "vendors" | "tickets" | "receipts" | null;

interface BottomNavProps {
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  vendors: Vendor[];
  onShowDirections?: (location: {
    latitude: number;
    longitude: number;
  }) => void;
}

export const BottomNav = ({
  currentLocation,
  vendors,
  onShowDirections,
}: BottomNavProps) => {
  const [activeWindow, setActiveWindow] = useState<ActiveWindow>(null);

  const handleNavClick = (window: ActiveWindow) => {
    if (activeWindow === window) {
      // If clicking the same button, close the window
      setActiveWindow(null);
    } else {
      // If clicking a different button, switch to that window
      setActiveWindow(window);
    }
  };

  const handleClose = () => {
    setActiveWindow(null);
  };

  // Click outside handler
  const handleOutsideClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".modal-content") === null) {
      handleClose();
    }
  };

  return (
    <>
      <Box
        sx={{
          width: { xs: "100%", sm: "600px" },
          position: "fixed",
          bottom: { xs: 0, sm: 5 },
          left: { xs: 0, sm: "50%" },
          right: { xs: 0, sm: "auto" },
          padding: (theme) => theme.spacing(2),
          backgroundColor: (theme) => theme.palette.background.glass,
          backdropFilter: "blur(10px)",
          borderRadius: { xs: 0, sm: 2 },
          transform: { xs: "none", sm: "translateX(-50%)" },
          zIndex: 80,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
            height: (theme) => theme.spacing(5),
          }}
        >
          <NavButton
            onClick={() => handleNavClick("activities")}
            selected={activeWindow === "activities"}
          >
            <FerrisWheel />
          </NavButton>
          <NavButton
            onClick={() => handleNavClick("vendors")}
            selected={activeWindow === "vendors"}
          >
            <Store />
          </NavButton>
          <NavButton
            onClick={() => handleNavClick("tickets")}
            selected={activeWindow === "tickets"}
          >
            <Ticket />
          </NavButton>
          <NavButton
            onClick={() => handleNavClick("receipts")}
            selected={activeWindow === "receipts"}
          >
            <Receipt />
          </NavButton>
        </Box>
      </Box>

      <Box onClick={handleOutsideClick}>
        <NearbyActivities
          isOpen={activeWindow === "activities"}
          onClose={handleClose}
          latitude={currentLocation.latitude}
          longitude={currentLocation.longitude}
        />
        <NearbyVendors
          isOpen={activeWindow === "vendors"}
          onClose={handleClose}
          latitude={currentLocation.latitude}
          longitude={currentLocation.longitude}
          vendors={vendors}
          onShowDirections={onShowDirections}
        />
        <UpcomingTicketsPanel
          isOpen={activeWindow === "tickets"}
          onClose={handleClose}
          onShowDirections={onShowDirections}
        />
        <PastReceipts
          isOpen={activeWindow === "receipts"}
          onClose={handleClose}
        />
      </Box>
    </>
  );
};

export default BottomNav;
