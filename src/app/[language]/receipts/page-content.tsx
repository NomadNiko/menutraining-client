import { useState, useEffect } from 'react';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { Receipt } from 'lucide-react';
import { useTranslation } from "@/services/i18n/client";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import useAuth from "@/services/auth/use-auth";
import { InvoiceResponseDto, VendorGroup } from '@/types/invoice';
import InvoiceDetailModal from '@/components/receipts/InvoiceDetailModal';

const getTotalItemCount = (vendorGroups: VendorGroup[]): number => {
  return vendorGroups.reduce((total, group) => 
    total + group.items.reduce((groupTotal, item) => groupTotal + item.quantity, 0), 
    0
  );
};

export default function ReceiptsPage() {
  const { t } = useTranslation("receipts");
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<InvoiceResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceResponseDto | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const tokensInfo = getTokensInfo();
        if (!tokensInfo?.token) {
          return;
        }

        const response = await fetch(`${API_URL}/invoices/user/${user?.id}`, {
          headers: {
            Authorization: `Bearer ${tokensInfo.token}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch invoices');
        const data = await response.json();
        setInvoices(data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchInvoices();
    }
  }, [user?.id, t]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'succeeded':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
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

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('title')}
      </Typography>
      
      {invoices.length === 0 ? (
        <Typography color="text.secondary">
          {t('noInvoices')}
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {invoices.map((invoice) => (
            <Grid item xs={12} sm={6} md={4} key={invoice._id}>
              <Card 
                onClick={() => setSelectedInvoice(invoice)}
                sx={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Receipt size={20} />
                    <Typography variant="h6">
                      ${invoice.amount.toFixed(2)}
                    </Typography>
                  </Box>
                  
                  {invoice.vendorGroups.map((group, index) => (
                    <Box 
                      key={group.vendorId} 
                      sx={{ 
                        mb: index < invoice.vendorGroups.length - 1 ? 1 : 0 
                      }}
                    >
                      <Typography variant="body2">
                        {group.vendorName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {group.items.length} items - ${group.subtotal.toFixed(2)}
                      </Typography>
                    </Box>
                  ))}

                  <Box sx={{ mt: 2, mb: 1 }}>
                    <Chip 
                      label={t(`status.${invoice.status.toLowerCase()}`)}
                      size="small"
                      color={getStatusColor(invoice.status)}
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {getTotalItemCount(invoice.vendorGroups)} {t('itemsCount')}
                    </Typography>
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary" display="block">
                    {t('invoice')} #{invoice._id.slice(-8)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <InvoiceDetailModal
        invoice={selectedInvoice}
        open={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </Container>
  );
}