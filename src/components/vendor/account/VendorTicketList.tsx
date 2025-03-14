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
import { TicketIcon } from 'lucide-react';

interface Ticket {
  _id: string;
  userId: string;
  transactionId: string;
  productItemId: string;
  productName: string;
  productDescription: string;
  productPrice: number;
  productType: string;
  status: string;
  quantity: number;
  createdAt: string;
  productDate?: string;
  productStartTime?: string;
}

interface VendorTicketListProps {
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

const TicketItem = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.glass,
  borderRadius: theme.shape.borderRadius,
  '&:last-child': {
    marginBottom: 0
  }
}));

export default function VendorTicketList({ vendorId }: VendorTicketListProps) {
  const { t } = useTranslation("vendor-account");
   const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const tokensInfo = getTokensInfo();
        if (!tokensInfo?.token) {
          return;
        }

        const response = await fetch(`${API_URL}/tickets/vendor/${vendorId}`, {
          headers: {
            'Authorization': `Bearer ${tokensInfo.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tickets');
        }

        const data = await response.json();
        setTickets(data.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [vendorId, t]);

  return (
    <StyledCard>
      <CardHeader 
        title={t('sections.tickets')}
        avatar={<TicketIcon size={24} />}
      />
      <CardContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : tickets.length === 0 ? (
          <Typography color="text.secondary">
            {t('noData.tickets')}
          </Typography>
        ) : (
          <Box>
            {tickets.map((ticket) => (
              <TicketItem key={ticket._id}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t('fields.product')}
                    </Typography>
                    <Typography>
                      {ticket.productName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t('fields.quantity')}
                    </Typography>
                    <Typography>
                      {ticket.quantity}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t('fields.price')}
                    </Typography>
                    <Typography>
                      ${ticket.productPrice.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t('fields.status')}
                    </Typography>
                    <Typography>
                      {ticket.status}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t('fields.date')}
                    </Typography>
                    <Typography>
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>
              </TicketItem>
            ))}
          </Box>
        )}
      </CardContent>
    </StyledCard>
  );
}