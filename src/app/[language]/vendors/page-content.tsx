import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { useTranslation } from "@/services/i18n/client";
import { useCallback, useEffect, useState } from 'react';
import { Vendor, VendorStatusEnum, VendorSortField, SortOrder } from "@/app/[language]/types/vendor";
import { VendorManagementCard } from "@/components/vendor/vendor-management-card";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { Filter, Search, X } from 'lucide-react';
import useAuth from "@/services/auth/use-auth";

export default function VendorAdminPage() {
  const { t } = useTranslation("vendor-admin");

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // Filter and sort state
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<VendorSortField>(VendorSortField.NAME);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.ASC);
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterState, setFilterState] = useState("");
  const [filterPostalCode, setFilterPostalCode] = useState("");

  // UI state
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadVendors = useCallback(async () => {
    try {
      setLoading(true);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        return;
      }

      const response = await fetch(`${API_URL}/v1/vendors/user/${user?.id}/owned`, {
        headers: {
          'Authorization': `Bearer ${tokensInfo.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch vendors');
      }

      const result = await response.json();
      setVendors(result.data);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sortField, sortOrder, search, filterType, filterStatus, filterCity, filterState, filterPostalCode, t]);

  useEffect(() => {
    loadVendors();
  }, [loadVendors]);

  const handleVendorAction = async (id: string, action: VendorStatusEnum, notes: string) => {
    try {
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        return;
      }

      const updateData = {
        vendorStatus: action,
        ...(action === VendorStatusEnum.ACTION_NEEDED ? { actionNeeded: notes } : {}),
        ...(notes ? { adminNotes: notes } : {})
      };

      const response = await fetch(`${API_URL}/vendors/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokensInfo.token}`
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Failed to update vendor');
      }

      await loadVendors();
    } catch (error) {
      console.error('Error updating vendor:', error);
    } finally {
    }
  };
  
  const handleDelete = async (id: string) => {
    try {
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        return;
      }

      const response = await fetch(`${API_URL}/vendors/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${tokensInfo.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete vendor');
      }

      await loadVendors();
    } catch (error) {
      console.error('Error deleting vendor:', error);
    }
  };

  const handleApplyFilters = () => {
    setPage(1); // Reset to first page when applying filters
    loadVendors();
  };

  const handleClearFilters = () => {
    setSearch("");
    setSortField(VendorSortField.NAME);
    setSortOrder(SortOrder.ASC);
    setFilterType("");
    setFilterStatus("");
    setFilterCity("");
    setFilterState("");
    setFilterPostalCode("");
    setPage(1);
  };

  if (loading && vendors.length === 0) {
    return (
      <Container sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 'calc(100vh - 64px)' 
      }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t("title")}
      </Typography>
      
      <Typography color="text.secondary" paragraph>
        {t("subtitle")}
      </Typography>

      {/* Filters Section */}
      <Box sx={{ mb: 4, p: 2, borderRadius: 1, bgcolor: 'background.paper' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label={t("filters.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <Search size={20} className="mr-2" />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>{t("filters.sorting.label")}</InputLabel>
              <Select
                value={sortField}
                label={t("filters.sorting.label")}
                onChange={(e) => setSortField(e.target.value as VendorSortField)}
              >
                <MenuItem value={VendorSortField.NAME}>{t("filters.sorting.name")}</MenuItem>
                <MenuItem value={VendorSortField.STATUS}>{t("filters.sorting.status")}</MenuItem>
                <MenuItem value={VendorSortField.CITY}>{t("filters.sorting.city")}</MenuItem>
                <MenuItem value={VendorSortField.STATE}>{t("filters.sorting.state")}</MenuItem>
                <MenuItem value={VendorSortField.CREATED}>{t("filters.sorting.created")}</MenuItem>
                <MenuItem value={VendorSortField.UPDATED}>{t("filters.sorting.updated")}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>{t("filters.status")}</InputLabel>
              <Select
                value={filterStatus}
                label={t("filters.status")}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="">{t("filters.all")}</MenuItem>
                {Object.values(VendorStatusEnum).map((status) => (
                  <MenuItem key={status} value={status}>
                    {t(`status.${status.toLowerCase()}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label={t("filters.city")}
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label={t("filters.state")}
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label={t("filters.postalCode")}
              value={filterPostalCode}
              onChange={(e) => setFilterPostalCode(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                startIcon={<X />}
                onClick={handleClearFilters}
                variant="outlined"
              >
                {t("filters.clearAll")}
              </Button>
              <Button
                startIcon={<Filter />}
                onClick={handleApplyFilters}
                variant="contained"
              >
                {t("filters.apply")}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Vendors List */}
      <Grid container spacing={3}>
        {vendors.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="h6" color="text.secondary" align="center" sx={{ py: 8 }}>
              {t("noVendors")}
            </Typography>
          </Grid>
        ) : (
          vendors.map((vendor) => (
            <Grid item xs={12} key={vendor._id}>
              <VendorManagementCard
                vendor={vendor}
                onAction={handleVendorAction}
                onDelete={handleDelete}
                onUpdate={loadVendors}
              />
            </Grid>
          ))
        )}
      </Grid>

      {/* Pagination */}
      <Box sx={{ 
        mt: 4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2
      }}>
        <FormControl variant="standard" sx={{ minWidth: 120 }}>
          <Select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
          <Typography variant="caption" color="text.secondary">
            {t('pagination.rowsPerPage')}
          </Typography>
        </FormControl>

        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
          showFirstButton
          showLastButton
        />

        <Typography variant="body2" color="text.secondary">
          {t('pagination.page', { current: page, total: totalPages })}
        </Typography>
      </Box>
    </Container>
  );
}