import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import { CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from '@/services/i18n/client';
import { useCartQuery } from '@/hooks/use-cart-query';
import { API_URL } from '@/services/api/config';
import { getTokensInfo } from '@/services/auth/auth-tokens-info';
import PurchasedTickets from '@/components/tickets/PurchasedTicketsDisplay';
import useAuth from '@/services/auth/use-auth';

type TransactionStatus = 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded' | 'disputed' | 'canceled';
type UIStatus = 'complete' | 'open' | 'expired' | 'canceled' | null;

export default function CheckoutReturnPage() {
  const { t } = useTranslation('checkout');
  const router = useRouter();
  const { refreshCart } = useCartQuery();
  const [status, setStatus] = useState<UIStatus>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [purchasedTickets, setPurchasedTickets] = useState([]);
  const { user } = useAuth();
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const MAX_RETRIES = 3;
    let timeoutId: NodeJS.Timeout;

    const checkStatus = async () => {
      try {
        if (!user?.id) {
          throw new Error('No user ID available');
        }

        const tokensInfo = getTokensInfo();
        if (!tokensInfo?.token) {
          throw new Error('No auth token available');
        }

        // Get most recent transaction regardless of status
        const response = await fetch(`${API_URL}/transactions/customer/${user.id}?limit=1`, {
          headers: {
            'Authorization': `Bearer ${tokensInfo.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch transaction');
        }

        const { data: transactions } = await response.json();
        
        if (!transactions || transactions.length === 0) {
          setStatus('canceled');
          setIsLoading(false);
          return;
        }

        const transaction = transactions[0];
        const currentStatus = transaction.status as TransactionStatus;

        switch(currentStatus) {
          case 'succeeded':
            setStatus('complete');
            await refreshCart();
            
            const ticketsResponse = await fetch(`${API_URL}/tickets/user/${user.id}`, {
              headers: {
                'Authorization': `Bearer ${tokensInfo.token}`
              }
            });
            
            if (ticketsResponse.ok) {
              const ticketsData = await ticketsResponse.json();
              setPurchasedTickets(ticketsData.data);
            }
            console.log(t('success.paymentComplete'))
            setIsLoading(false);
            break;

          case 'pending':
          case 'processing':
            if (retryCount < MAX_RETRIES) {
              setStatus('open');
              setRetryCount(prev => prev + 1);
              timeoutId = setTimeout(checkStatus, 2000);
            } else {
              setStatus('canceled');
              setIsLoading(false);
            }
            break;

          case 'failed':
          case 'canceled':
          case 'refunded':
          case 'disputed':
            setStatus('canceled');
            setIsLoading(false);
            break;

          default:
            console.error('Unknown transaction status:', currentStatus);
            setStatus('canceled');
            setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking transaction status:', error);
        setStatus('canceled');
        setIsLoading(false);
      }
    };

    if (user?.id) {
      checkStatus();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [user?.id, refreshCart, t, retryCount]);

  if (!user?.id || isLoading) {
    return (
      <Container sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px)'
      }}>
        <CircularProgress />
      </Container>
    );
  }

  if (status === 'open') {
    return (
      <Container sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 64px)',
        gap: 3
      }}>
        <CircularProgress />
        <Typography variant="h6">
          {t('returnPage.processing.message')}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3
      }}>
        {status === 'complete' ? (
          <>
            <CheckCircle size={64} color="success" />
            <Typography variant="h4" gutterBottom>
              {t('returnPage.success.title')}
            </Typography>
            <Typography color="text.secondary" paragraph>
              {t('returnPage.success.message')}
            </Typography>
            {purchasedTickets.length > 0 && (
              <PurchasedTickets tickets={purchasedTickets} />
            )}
          </>
        ) : (
          <>
            <XCircle size={64} color="error" />
            <Typography variant="h4" gutterBottom>
              {t('returnPage.failure.title')}
            </Typography>
            <Typography color="text.secondary" paragraph>
              {t('returnPage.failure.message')}
            </Typography>
          </>
        )}
        
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => router.push('/')}
          >
            {t('returnPage.actions.backToHome')}
          </Button>
          {status !== 'complete' && (
            <Button
              variant="outlined"
              onClick={() => router.push('/cart')}
            >
              {t('returnPage.actions.tryAgain')}
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
}