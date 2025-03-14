  import CardContent from "@mui/material/CardContent";
  import Card from "@mui/material/Card";
  import Grid from "@mui/material/Grid";
  import TextField from "@mui/material/TextField";
  import FormControl from "@mui/material/FormControl";
  import Select from "@mui/material/Select";
  import MenuItem from "@mui/material/MenuItem";
  import InputLabel from "@mui/material/InputLabel";
  import Button from "@mui/material/Button";
  
  import { Filter } from "lucide-react";
  
  interface Filters {
    status: string;
    user: string;
    dateRange: string;
    searchTerm: string;
  }
  
  interface ServiceAdminFiltersProps {
    filters: Filters;
    onFilterChange: (field: keyof Filters, value: string) => void;
    onClearFilters: () => void;
    t: (key: string) => string;
  }
  
  const ServiceAdminFilters = ({ 
    filters, 
    onFilterChange, 
    onClearFilters,
    t 
  }: ServiceAdminFiltersProps) => {
    return (
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                label={t('filters.search')}
                value={filters.searchTerm}
                onChange={(e) => onFilterChange('searchTerm', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>{t('filters.status')}</InputLabel>
                <Select
                  value={filters.status}
                  label={t('filters.status')}
                  onChange={(e) => onFilterChange('status', e.target.value as string)}
                >
                  <MenuItem value="">{t('filters.all')}</MenuItem>
                  <MenuItem value="OPENED">{t('status.opened')}</MenuItem>
                  <MenuItem value="ASSIGNED">{t('status.assigned')}</MenuItem>
                  <MenuItem value="HOLD">{t('status.hold')}</MenuItem>
                  <MenuItem value="RESOLVED">{t('status.resolved')}</MenuItem>
                  <MenuItem value="CLOSED">{t('status.closed')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>{t('filters.dateRange')}</InputLabel>
                <Select
                  value={filters.dateRange}
                  label={t('filters.dateRange')}
                  onChange={(e) => onFilterChange('dateRange', e.target.value as string)}
                >
                  <MenuItem value="">{t('filters.allTime')}</MenuItem>
                  <MenuItem value="today">{t('filters.today')}</MenuItem>
                  <MenuItem value="week">{t('filters.thisWeek')}</MenuItem>
                  <MenuItem value="month">{t('filters.thisMonth')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Button
                variant="outlined"
                startIcon={<Filter size={20} />}
                onClick={onClearFilters}
                fullWidth
              >
                {t('filters.clear')}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };
  
  export default ServiceAdminFilters;