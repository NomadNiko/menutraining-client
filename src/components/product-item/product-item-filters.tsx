import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useTranslation } from "@/services/i18n/client";
import { FilterOptions } from '@/app/[language]/types/product-item';

interface ProductItemFiltersProps {
  filters: FilterOptions;
  onFilterChange: (field: keyof FilterOptions, value: string) => void;
}

export const ProductItemFilters = ({ filters, onFilterChange }: ProductItemFiltersProps) => {
  const { t } = useTranslation("product-items");

  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label={t('search')}
          value={filters.searchTerm}
          onChange={(e) => onFilterChange('searchTerm', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={2}>
        <FormControl fullWidth>
          <InputLabel>{t('filterType')}</InputLabel>
          <Select
            value={filters.filterType}
            label={t('filterType')}
            onChange={(e) => onFilterChange('filterType', e.target.value)}
          >
            <MenuItem value="">{t('all')}</MenuItem>
            <MenuItem value="tours">{t('types.tours')}</MenuItem>
            <MenuItem value="lessons">{t('types.lessons')}</MenuItem>
            <MenuItem value="rentals">{t('types.rentals')}</MenuItem>
            <MenuItem value="tickets">{t('types.tickets')}</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={2}>
        <FormControl fullWidth>
          <InputLabel>{t('filterStatus')}</InputLabel>
          <Select
            value={filters.filterStatus}
            label={t('filterStatus')}
            onChange={(e) => onFilterChange('filterStatus', e.target.value)}
          >
            <MenuItem value="">{t('all')}</MenuItem>
            <MenuItem value="PUBLISHED">{t('status.active')}</MenuItem>
            <MenuItem value="CANCELLED">{t('status.cancelled')}</MenuItem>
            <MenuItem value="COMPLETED">{t('status.completed')}</MenuItem>
            <MenuItem value="DRAFT">{t('status.draft')}</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={2}>
        <FormControl fullWidth>
          <InputLabel>{t('sort')}</InputLabel>
          <Select
            value={filters.sortOrder}
            label={t('sort')}
            onChange={(e) => onFilterChange('sortOrder', e.target.value as 'asc' | 'desc')}
          >
            <MenuItem value="asc">{t('sortOptions.earliest')}</MenuItem>
            <MenuItem value="desc">{t('sortOptions.latest')}</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};