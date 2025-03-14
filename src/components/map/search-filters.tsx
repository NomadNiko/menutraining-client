import { Search, Binoculars, GraduationCap, Timer, Ticket } from "lucide-react";
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import { SearchBar, StyledToggleButtonGroup } from "./styled-components";
import { VendorTypes } from "@/app/[language]/types/vendor";
import { useTranslation } from "@/services/i18n/client";

interface SearchFiltersProps {
  filterTypes: VendorTypes[];
  onFilterChange: (
    event: React.MouseEvent<HTMLElement>,
    newFilters: VendorTypes[]
  ) => void;
}

export const SearchFilters = ({ filterTypes, onFilterChange }: SearchFiltersProps) => {
  const { t } = useTranslation("home");
  
  return (
    <Box sx={{ 
      position: "absolute", 
      top: theme => theme.spacing(2),
      left: theme => theme.spacing(2),
      right: theme => theme.spacing(2),
      display: "flex",
      flexDirection: "column",
      gap: theme => theme.spacing(2),
      zIndex: 1,
    }}>
      <SearchBar
        placeholder={t("searchPlaceholder")}
        InputProps={{
          startAdornment: <Search size={22} />,
        }}
        sx={{
          width: { xs: "70%", md: "95%" },
          alignSelf: "flex-start",
        }}
      />
      
      <StyledToggleButtonGroup
        value={filterTypes}
        onChange={onFilterChange}
        aria-label="vendor type filters"
        fullWidth
        size="small"
      >
        <ToggleButton value="tours" aria-label="tours">
          <Binoculars size={14} />
          <Box component="span" sx={{ ml: 0.5, fontSize: "0.60rem" }}>
            {t("filters.tours")}
          </Box>
        </ToggleButton>
        <ToggleButton value="lessons" aria-label="lessons">
          <GraduationCap size={14} />
          <Box component="span" sx={{ ml: 0.5, fontSize: "0.60rem" }}>
            {t("filters.lessons")}
          </Box>
        </ToggleButton>
        <ToggleButton value="rentals" aria-label="rentals">
          <Timer size={14} />
          <Box component="span" sx={{ ml: 0.5, fontSize: "0.60rem" }}>
            {t("filters.rentals")}
          </Box>
        </ToggleButton>
        <ToggleButton value="tickets" aria-label="tickets">
          <Ticket size={14} />
          <Box component="span" sx={{ ml: 0.5, fontSize: "0.60rem" }}>
            {t("filters.tickets")}
          </Box>
        </ToggleButton>
      </StyledToggleButtonGroup>
    </Box>
  );
};