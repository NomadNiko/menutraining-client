"use client";
import { Binoculars, GraduationCap, Timer, Ticket } from "lucide-react";
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import { StyledToggleButtonGroup } from "@/components/map/styled-components";
import { VendorTypes } from "@/app/[language]/types/vendor";
import { useTranslation } from "@/services/i18n/client";

interface VendorTypeFiltersProps {
  filterTypes: VendorTypes[];
  setFilterTypes: (types: VendorTypes[]) => void;
}

interface FilterOption {
  value: VendorTypes;
  icon: React.ReactNode;
  translationKey: string;
}

export const VendorTypeFilters = ({ filterTypes, setFilterTypes }: VendorTypeFiltersProps) => {
  const { t } = useTranslation("home");

  const filterOptions: FilterOption[] = [
    {
      value: "tours",
      icon: <Binoculars size={14} />,
      translationKey: "filters.tours",
    },
    {
      value: "lessons",
      icon: <GraduationCap size={14} />,
      translationKey: "filters.lessons",
    },
    {
      value: "rentals",
      icon: <Timer size={14} />,
      translationKey: "filters.rentals",
    },
    {
      value: "tickets",
      icon: <Ticket size={14} />,
      translationKey: "filters.tickets",
    },
  ];

  const handleFilterChange = (
    event: React.MouseEvent<HTMLElement>,
    newFilterTypes: VendorTypes[]
  ) => {
    setFilterTypes(newFilterTypes);
  };

  return (
    <StyledToggleButtonGroup
      value={filterTypes}
      onChange={handleFilterChange}
      aria-label="vendor type filters"
      fullWidth
      size="small"
    >
      {filterOptions.map((option) => (
        <ToggleButton 
          key={option.value} 
          value={option.value} 
          aria-label={option.value}
        >
          {option.icon}
          <Box 
            component="span" 
            sx={{ 
              ml: 0.5, 
              fontSize: "0.60rem",
              textTransform: "none",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: { xs: "none", sm: "inline-block" },
              "@media (min-width: 400px)": {
                display: "inline-block"
              }
            }}
          >
            {t(option.translationKey)}
          </Box>
        </ToggleButton>
      ))}
    </StyledToggleButtonGroup>
  );
};