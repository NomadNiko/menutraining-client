import { useState, useEffect, useCallback } from 'react';
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from '@mui/material/styles';
import { useTranslation } from "@/services/i18n/client";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { BanknoteIcon, PiggyBank, RefreshCw, History } from 'lucide-react';
import Alert from "@mui/material/Alert";

interface VendorAccountBalancesProps {
  vendor: {
    _id: string;
    businessName: string;
    accountBalance?: number;
    internalAccountBalance?: number;
  };
  onRefresh: () => void;
}

interface Payout {
  _id: string;
  amount: number;
  status: string;
  createdAt: string;
  processedAt?: string;
}

const StyledCard = styled(Card)(() => ({
  backgroundColor: "rgb(28, 40, 58, 0.8)",
  backdropFilter: 'blur(10px)',
  border: `1px solid rgba(255, 255, 255, 0.1)`,
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
  }
}));

const BalanceBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: "rgba(28, 40, 58, 0.9)",
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2)
}));

const PayoutItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1.5),
  backgroundColor: "rgba(28, 40, 58, 0.9)",
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1)
}));

function VendorAccountBalances({ vendor, onRefresh }: VendorAccountBalancesProps) {
  const { t } = useTranslation("vendor-account");
  const [processingPayout, setProcessingPayout] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [internalBalance, setInternalBalance] = useState<number>(vendor.internalAccountBalance || 0);
  const [loadingPayouts, setLoadingPayouts] = useState(true);

  const fetchPayouts = useCallback(async () => {
    try {
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) return;

      const response = await fetch(`${API_URL}/payouts/vendor/${vendor._id}`, {
        headers: {
          'Authorization': `Bearer ${tokensInfo.token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch payouts');
      const data = await response.json();
      setPayouts(data.data);
    } catch (error) {
      console.error('Error fetching payouts:', error);
    } finally {
      setLoadingPayouts(false);
    }
  }, [vendor._id, t]);

  useEffect(() => {
    fetchPayouts();
  }, [fetchPayouts]);

  // Update internal state when vendor prop changes
  useEffect(() => {
    setInternalBalance(vendor.internalAccountBalance || 0);
  }, [vendor.internalAccountBalance]);

  const handleRefresh = async () => {
    setRefreshing(true);
    onRefresh(); // Call the parent's refresh function to update vendor data
    await fetchPayouts(); // Refresh payouts data
    setRefreshing(false);
  };

  const handleTriggerPayout = async () => {
    try {
      setProcessingPayout(true);
      const tokensInfo = getTokensInfo();
      
      if (!tokensInfo?.token) {
        return;
      }

      const response = await fetch(`${API_URL}/vendors/payout/${vendor._id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokensInfo.token}`
        }
      });

      if (!response.ok) throw new Error('Failed to trigger payout');
      
      await response.json();      
      // Refresh data after successful payout
      handleRefresh();
    } catch (error) {
      console.error('Error triggering payout:', error);
    } finally {
      setProcessingPayout(false);
    }
  };

  const formatBalance = (pennies: number): string => {
    return (pennies / 100).toFixed(2);
  };

  const getPayoutStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'warning.main';
      case 'PROCESSING': return 'info.main';
      case 'SUCCEEDED': return 'success.main';
      case 'FAILED': return 'error.main';
      default: return 'text.secondary';
    }
  };

  return (
    <StyledCard>
      <CardHeader 
        title={vendor.businessName}
        subheader={t('balances.title')}
        action={
          <Button
            startIcon={refreshing ? <CircularProgress size={20} /> : <RefreshCw size={20} />}
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outlined"
            size="small"
          >
            {t('actions.refresh')}
          </Button>
        }
      />
      <CardContent>
        <Grid container spacing={3} className="mb-4">
          <Grid item xs={12}>
            <BalanceBox>
              <BanknoteIcon size={24} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('balances.internal')}
                </Typography>
                <Typography variant="h6">
                  ${formatBalance(internalBalance)}
                </Typography>
              </Box>
            </BalanceBox>
          </Grid>
        </Grid>

        <Box className="mb-4">
          <Typography variant="h6" className="flex items-center gap-2 mb-3">
            <History size={20} />
            {t('payouts.history')}
          </Typography>
          
          {loadingPayouts ? (
            <Box className="flex justify-center p-4">
              <CircularProgress />
            </Box>
          ) : payouts.length > 0 ? (
            payouts.map(payout => (
              <PayoutItem key={payout._id}>
                <Box>
                  <Typography>${formatBalance(payout.amount)}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(payout.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Typography color={getPayoutStatusColor(payout.status)}>
                  {payout.status}
                </Typography>
              </PayoutItem>
            ))
          ) : (
            <Alert severity="info">{t('payouts.noneFound')}</Alert>
          )}
        </Box>

        <Button
          variant="contained"
          startIcon={processingPayout ? <CircularProgress size={20} /> : <PiggyBank size={20} />}
          onClick={handleTriggerPayout}
          disabled={processingPayout || internalBalance <= 0}
          fullWidth
          sx={{
            background: 'linear-gradient(to right, #1E40AF,rgb(71, 26, 145))',
            '&:hover': {
              background: 'linear-gradient(to right, #1E40AF,rgb(71, 26, 145))',
              filter: 'brightness(0.9)',
            }
          }}
        >
          {t('actions.triggerPayout')}
        </Button>
      </CardContent>
    </StyledCard>
  );
}

export default VendorAccountBalances;