import React from 'react';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "@/services/i18n/client";
import { TicketWithUserName } from './types';
import { format } from 'date-fns'; 

interface RefundConfirmationDialogProps {
  ticket: TicketWithUserName;
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isProcessing: boolean;
}

export default function RefundConfirmationDialog({
  ticket,
  open,
  onClose,
  onConfirm,
  isProcessing
}: RefundConfirmationDialogProps) {
  const { t } = useTranslation("vendor-tickets");

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <Dialog 
      open={open} 
      onClose={!isProcessing ? onClose : undefined}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {t('refundConfirmation')}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            {t('refundWarning')}
          </Alert>
          
          <Typography variant="subtitle1" gutterBottom>
            {t('refundDetails')}
          </Typography>
          
          <Box sx={{ 
            bgcolor: 'background.paper', 
            p: 2, 
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            mb: 2 
          }}>
            <Typography variant="body2" gutterBottom>
              <strong>{t('ticketHolder')}:</strong> {ticket.userName}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>{t('product')}:</strong> {ticket.productName}
            </Typography>
            {ticket.productDate && (
              <Typography variant="body2" gutterBottom>
                <strong>{t('date')}:</strong> {format(new Date(ticket.productDate), 'PPP')}
                {ticket.productStartTime && ` at ${ticket.productStartTime}`}
              </Typography>
            )}
            <Typography variant="body2" gutterBottom>
              <strong>{t('quantity')}:</strong> {ticket.quantity}
            </Typography>
            <Typography variant="body2" color="error.main" fontWeight="bold">
              <strong>{t('refundAmount')}:</strong> ${ticket.productPrice.toFixed(2)}
            </Typography>
          </Box>
          
          <Typography variant="subtitle1" gutterBottom>
            {t('whatWillHappen')}:
          </Typography>
          
          <Box component="ul" sx={{ pl: 2 }}>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              {t('ticketWillBeCancelled')}
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              {t('refundWillBeIssued')}
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              {t('amountDeductedFromBalance')}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose} 
          disabled={isProcessing}
          variant="outlined"
        >
          {t('cancel')}
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={isProcessing}
          variant="contained"
          color="error"
          startIcon={isProcessing ? <CircularProgress size={20} /> : null}
        >
          {isProcessing ? t('processing') : t('confirmRefund')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}