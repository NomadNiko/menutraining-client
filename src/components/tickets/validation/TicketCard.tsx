import { useState } from 'react';
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { useTranslation } from "@/services/i18n/client";
import { format } from 'date-fns';
import { TicketWithUserName } from './types';
import RefundConfirmationDialog from './RefundConfirmationDialog';
import { useSnackbar } from '@/hooks/use-snackbar';

interface TicketCardProps {
  ticket: TicketWithUserName;
  onRedeemTicket: (ticketId: string) => Promise<void>;
  onRefundTicket?: (ticketId: string) => Promise<void>;
  readOnly?: boolean;
}

export default function TicketCard({ 
  ticket, 
  onRedeemTicket,
  onRefundTicket,
  readOnly = false 
}: TicketCardProps) {
  const { t } = useTranslation("vendor-tickets");
  const { enqueueSnackbar } = useSnackbar();
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRefundClick = () => {
    setRefundDialogOpen(true);
  };

  const handleRefundClose = () => {
    if (!isProcessing) {
      setRefundDialogOpen(false);
    }
  };

  const handleRefundConfirm = async () => {
    if (!onRefundTicket) return;
    
    try {
      setIsProcessing(true);
      await onRefundTicket(ticket._id);
      setRefundDialogOpen(false);
    } catch (error) {
      console.error('Failed to refund ticket:', error);
      enqueueSnackbar(
        error instanceof Error ? error.message : t('refundFailed'), 
        { variant: 'error' }
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Determine if refund button should be shown
  // Only show for ACTIVE or REDEEMED tickets, not for CANCELLED or REVOKED
  const canRefund = onRefundTicket && 
    (ticket.status === 'ACTIVE' || ticket.status === 'REDEEMED');

  return (
    <>
      <Card 
        elevation={1} 
        sx={{ 
          border: '1px solid',
          borderColor: 'divider',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)'
          }
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant="subtitle1" fontWeight="medium" noWrap sx={{ maxWidth: '70%' }}>
              {ticket.userName}
            </Typography>
            <Chip
              size="small"
              label={t(`status.${ticket.status.toLowerCase()}`)}
              color={
                ticket.status === 'ACTIVE' ? 'success' :
                ticket.status === 'REDEEMED' ? 'info' :
                ticket.status === 'CANCELLED' ? 'error' : 'default'
              }
            />
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={1} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">
                {t('quantity')}
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {ticket.quantity}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">
                {t('price')}
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                ${ticket.productPrice.toFixed(2)}
              </Typography>
            </Grid>

            {ticket.productDate && (
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  {t('time')}
                </Typography>
                <Typography variant="body2">
                  {ticket.productStartTime 
                    ? `${format(new Date(ticket.productDate), 'MMM d')} at ${ticket.productStartTime}`
                    : format(new Date(ticket.productDate), 'PPP')
                  }
                </Typography>
              </Grid>
            )}
          </Grid>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {!readOnly && ticket.status === 'ACTIVE' && (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="small"
                onClick={() => onRedeemTicket(ticket._id)}
              >
                {t('redeem')}
              </Button>
            )}

            {canRefund && (
              <Button
                variant="outlined"
                color="error"
                fullWidth
                size="small"
                onClick={handleRefundClick}
              >
                {t('refund')}
              </Button>
            )}
          </Box>

          {readOnly && !canRefund && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
              {t('ticketRedeemed')}
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Refund confirmation dialog */}
      {refundDialogOpen && (
        <RefundConfirmationDialog
          ticket={ticket}
          open={refundDialogOpen}
          onClose={handleRefundClose}
          onConfirm={handleRefundConfirm}
          isProcessing={isProcessing}
        />
      )}
    </>
  );
}