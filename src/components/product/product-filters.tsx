import { useState } from 'react';
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import ToggleButton from "@mui/material/ToggleButton";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { ProductStatusEnum } from '@/app/[language]/types/product';
import { useTranslation } from "@/services/i18n/client";
import { Binoculars, GraduationCap, Timer, Ticket, Archive, Send, FileText } from 'lucide-react';
import MuiToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled } from '@mui/material/styles';

const ToggleButtonGroup = styled(MuiToggleButtonGroup)`
  &.MuiToggleButtonGroup-root {
    display: flex;
    flex-wrap: wrap;
    gap: ${props => props.theme.spacing(1)};
  }
` as typeof MuiToggleButtonGroup;

export type ProductType = 'tours' | 'lessons' | 'rentals' | 'tickets';

interface ProductFiltersProps {
  onFilterChange: (filters: ProductFilters) => void;
  cities: string[];
}

export interface ProductFilters {
  types: ProductType[];
  statuses: ProductStatusEnum[];
  cities: string[];
  priceRange: [number, number];
  search: string;
}

const initialPriceRange: [number, number] = [0, 1000];

const ProductFilters: React.FC<ProductFiltersProps> = ({ onFilterChange, cities }) => {
  const { t } = useTranslation("products");
  const [filters, setFilters] = useState<ProductFilters>({
    types: [],
    statuses: [],
    cities: [],
    priceRange: initialPriceRange,
    search: ""
  });

  const handleTypeChange = (_: React.MouseEvent<HTMLElement>, newTypes: ProductType[]) => {
    setFilters(prev => {
      const updated = { ...prev, types: newTypes };
      onFilterChange(updated);
      return updated;
    });
  };

  const handleStatusChange = (_: React.MouseEvent<HTMLElement>, newStatuses: ProductStatusEnum[]) => {
    setFilters(prev => {
      const updated = { ...prev, statuses: newStatuses };
      onFilterChange(updated);
      return updated;
    });
  };

  const handlePriceChange = (_: Event, newValue: number | number[]) => {
    setFilters(prev => {
      const updated = { ...prev, priceRange: newValue as [number, number] };
      onFilterChange(updated);
      return updated;
    });
  };

  const handleCityChange = (
    _: React.SyntheticEvent<Element, Event>,
    newCities: string[]
  ) => {
    setFilters(prev => {
      const updated = { ...prev, cities: newCities };
      onFilterChange(updated);
      return updated;
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => {
      const updated = { ...prev, search: event.target.value };
      onFilterChange(updated);
      return updated;
    });
  };

  return (
    <Card 
      className="mb-6"
      sx={{
        background: 'rgba(17, 25, 40, 0.75)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.125)'
      }}
    >
      <CardContent>
        <Box className="space-y-6">
          <TextField
            fullWidth
            placeholder={t("filters.search")}
            value={filters.search}
            onChange={handleSearchChange}
            className="bg-background-glass backdrop-blur-md"
          />
          <Box>
            <Typography variant="subtitle2" className="mb-2">
              {t("filters.type")}
            </Typography>
            <ToggleButtonGroup
              value={filters.types}
              onChange={handleTypeChange}
              aria-label="product types"
            >
              <ToggleButton value="tours" aria-label="tours">
                <Binoculars className="mr-2 h-4 w-4" />
                {t("productTypes.tours")}
              </ToggleButton>
              <ToggleButton value="lessons" aria-label="lessons">
                <GraduationCap className="mr-2 h-4 w-4" />
                {t("productTypes.lessons")}
              </ToggleButton>
              <ToggleButton value="rentals" aria-label="rentals">
                <Timer className="mr-2 h-4 w-4" />
                {t("productTypes.rentals")}
              </ToggleButton>
              <ToggleButton value="tickets" aria-label="tickets">
                <Ticket className="mr-2 h-4 w-4" />
                {t("productTypes.tickets")}
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Box>
            <Typography variant="subtitle2" className="mb-2">
              {t("filters.status")}
            </Typography>
            <ToggleButtonGroup
              value={filters.statuses}
              onChange={handleStatusChange}
              aria-label="product status"
            >
              <ToggleButton value={ProductStatusEnum.PUBLISHED} aria-label="published">
                <Send className="mr-2 h-4 w-4" />
                {t("status.published")}
              </ToggleButton>
              <ToggleButton value={ProductStatusEnum.DRAFT} aria-label="draft">
                <FileText className="mr-2 h-4 w-4" />
                {t("status.draft")}
              </ToggleButton>
              <ToggleButton value={ProductStatusEnum.ARCHIVED} aria-label="archived">
                <Archive className="mr-2 h-4 w-4" />
                {t("status.archived")}
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Box>
            <Typography variant="subtitle2" className="mb-2">
              {t("filters.city")}
            </Typography>
            <Autocomplete
              multiple
              options={cities}
              value={filters.cities}
              onChange={handleCityChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={t("cities.selectCities")}
                />
              )}
              className="bg-background-glass backdrop-blur-md"
            />
          </Box>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              {t("filters.priceRange")}
            </Typography>
            <Box sx={{ px: 4, mt: 3, mb: 1 }}>
              <Slider
                value={filters.priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="on"
                min={0}
                max={1000}
                step={10}
                valueLabelFormat={(value) => `$${value}`}
                size="small"
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 3 }}>
              <Typography variant="caption">
                ${filters.priceRange[0]}
              </Typography>
              <Typography variant="caption">
                ${filters.priceRange[1]}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductFilters;