import { useRef } from 'react';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { Printer, Receipt } from "lucide-react";
import { useTranslation } from "@/services/i18n/client";
import { InvoiceResponseDto } from '@/types/invoice';
import { format } from 'date-fns';

interface InvoiceDetailModalProps {
  invoice: InvoiceResponseDto | null;
  open: boolean;
  onClose: () => void;
}

export default function InvoiceDetailModal({ 
  invoice, 
  open, 
  onClose 
}: InvoiceDetailModalProps) {
  const { t } = useTranslation("receipts");
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContents = printRef.current?.innerHTML;
    if (!printContents) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${t('invoice')} #${invoice?._id.slice(-8)}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .invoice-header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .divider { border-top: 1px solid #eee; margin: 20px 0; }
            .total { font-size: 1.2em; font-weight: bold; }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  if (!invoice) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Receipt size={24} />
          <Typography variant="h6">
            {t('invoice')} #{invoice._id.slice(-8)}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box ref={printRef} sx={{ maxWidth: '400px', mx: 'auto' }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              {t('receipt')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(invoice.invoiceDate).toLocaleDateString()}
            </Typography>
          </Box>

          {/* Customer Info */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              {t('billedTo')}
            </Typography>
            <Typography>{invoice.customerName}</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Vendor Groups */}
          {invoice.vendorGroups.map((group, groupIndex) => (
            <Box key={group.vendorId} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                {group.vendorName}
              </Typography>
              
              {group.items.map((item, itemIndex) => (
                <Box key={itemIndex} sx={{ mb: 2 }}>
                  <Typography>
                    {item.quantity}x {item.productName}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    pl: 2,
                    color: 'text.secondary'
                  }}>
                    <Typography variant="body2">
                      {format(new Date(item.productDate), 'PP')} at {item.productStartTime}
                    </Typography>
                    <Typography variant="body2">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              ))}
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                mt: 1,
                pt: 1,
                borderTop: '1px dashed',
                borderColor: 'divider'
              }}>
                <Typography variant="subtitle2">{t('subtotal')}</Typography>
                <Typography variant="subtitle2">
                  ${group.subtotal.toFixed(2)}
                </Typography>
              </Box>

              {groupIndex < invoice.vendorGroups.length - 1 && (
                <Divider sx={{ my: 2 }} />
              )}
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          {/* Total */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 3
          }}>
            <Typography variant="h6">{t('total')}</Typography>
            <Typography variant="h6">
              ${invoice.amount.toFixed(2)} {invoice.currency.toUpperCase()}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {t('close')}
        </Button>
        <Button 
          variant="contained" 
          startIcon={<Printer />}
          onClick={handlePrint}
        >
          {t('print')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}