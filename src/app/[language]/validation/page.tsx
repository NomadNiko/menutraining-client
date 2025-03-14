"use client";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import useAuth from "@/services/auth/use-auth";
import { RoleEnum } from "@/services/api/types/role";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { format } from 'date-fns';
import { useTranslation } from "@/services/i18n/client";

interface TicketData {
  _id: string;
  userId: string;
  transactionId: string;
  vendorId: string;
  productItemId: string;
  productName: string;
  productDescription: string;
  productPrice: number;
  productType: string;
  status: 'ACTIVE' | 'CANCELLED' | 'REDEEMED' | 'REVOKED';
  quantity: number;
  createdAt: string;
  updatedAt: string;
  productDate?: string;
  productStartTime?: string;
  productLocation?: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export default function TicketValidationPage() {
  const { t } = useTranslation("validation");
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isVendor = user?.role && Number(user.role.id) === RoleEnum.VENDOR;

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const ticketId = searchParams.get('ticketId');
        if (!ticketId) {
          setError(t('errors.missingTicketId'));
          return;
        }

        const tokensInfo = getTokensInfo();
        if (!tokensInfo?.token) {
          setError(t('errors.unauthorized'));
          return;
        }

        const response = await fetch(`${API_URL}/tickets/${ticketId}`, {
          headers: {
            'Authorization': `Bearer ${tokensInfo.token}`
          }
        });

        if (!response.ok) {
          throw new Error(t('errors.failedToLoad'));
        }

        const data = await response.json();
        setTicket(data.data);
      } catch (error) {
        console.error('Error fetching ticket:', error);
        setError(t('errors.fetchFailed'));
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [searchParams, t]);

  const handleRedeem = async () => {
    if (!ticket) return;

    try {
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error(t('errors.unauthorized'));
      }

      const response = await fetch(`${API_URL}/tickets/${ticket._id}/redeem`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokensInfo.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(t('errors.redeemFailed'));
      }

      const updatedTicket = await response.json();
      setTicket(updatedTicket.data);
    } catch (error) {
      console.error('Error redeeming ticket:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: 'calc(100vh - 64px)' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !ticket) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error || t('errors.ticketNotFound')}
        </Alert>
      </Box>
    );
  }

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'ACTIVE':
//         return 'success';
//       case 'REDEEMED':
//         return 'info';
//       case 'CANCELLED':
//       case 'REVOKED':
//         return 'error';
//       default:
//         return 'default';
//     }
//   };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {ticket.productName}
          </Typography>

          {/* <Alert 
            severity={getStatusColor(ticket.status) as any} 
            sx={{ mb: 3 }}
          >
            {t(`status.${ticket.status.toLowerCase()}`)}
          </Alert> */}

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {ticket.productDescription}
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {t('fields.quantity')}
              </Typography>
              <Typography>
                {ticket.quantity}
              </Typography>
            </Box>

            {ticket.productDate && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('fields.date')}
                </Typography>
                <Typography>
                  {format(new Date(ticket.productDate), 'PPP')}
                </Typography>
              </Box>
            )}

            {ticket.productStartTime && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('fields.time')}
                </Typography>
                <Typography>
                  {ticket.productStartTime}
                </Typography>
              </Box>
            )}

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {t('fields.transactionId')}
              </Typography>
              <Typography>
                {ticket.transactionId}
              </Typography>
            </Box>
          </Box>

          {isVendor && ticket.status === 'ACTIVE' && (
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleRedeem}
              >
                {t('actions.redeem')}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}