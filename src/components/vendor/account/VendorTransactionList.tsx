import { useState, useEffect } from 'react';
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from '@mui/material/styles';
import { useTranslation } from "@/services/i18n/client";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { ClockIcon } from 'lucide-react';
import { TransactionStatus, TransactionType } from "@/app/[language]/types/transaction";

interface Transaction {
  _id: string;
  stripeCheckoutSessionId: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  type: TransactionType;
  description?: string;
  createdAt: string;
}

interface VendorTransactionListProps {
  vendorId: string;
}

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.glass,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.divider}`,
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
  }
}));

const TransactionItem = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.glass,
  borderRadius: theme.shape.borderRadius,
  '&:last-child': {
    marginBottom: 0
  }
}));

export default function VendorTransactionList({ vendorId }: VendorTransactionListProps) {
  const { t } = useTranslation("vendor-account");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const tokensInfo = getTokensInfo();
        if (!tokensInfo?.token) {
          return;
        }

        const response = await fetch(`${API_URL}/transactions/vendor/${vendorId}`, {
          headers: {
            'Authorization': `Bearer ${tokensInfo.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }

        const data = await response.json();
        setTransactions(data.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [vendorId, t]);

  return (
    <StyledCard>
      <CardHeader 
        title={t('sections.transactions')}
        avatar={<ClockIcon size={24} />}
      />
      <CardContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : transactions.length === 0 ? (
          <Typography color="text.secondary">
            {t('noData.transactions')}
          </Typography>
        ) : (
          <Box>
            {transactions.map((transaction) => (
              <TransactionItem key={transaction._id}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t('fields.amount')}
                    </Typography>
                    <Typography>
                      ${(transaction.amount / 100).toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t('fields.type')}
                    </Typography>
                    <Typography>
                      {transaction.type}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t('fields.status')}
                    </Typography>
                    <Typography>
                      {transaction.status}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t('fields.date')}
                    </Typography>
                    <Typography>
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>
              </TransactionItem>
            ))}
          </Box>
        )}
      </CardContent>
    </StyledCard>
  );
}
