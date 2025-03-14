"use client";
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "@/services/i18n/client";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import useAuth from "@/services/auth/use-auth";
import type { InvoiceResponseDto } from '@/types/invoice';
import { DashboardSection } from './common';

const InvoiceDetailModal = dynamic(
  () => import('@/components/receipts/InvoiceDetailModal'),
  { 
    loading: () => <div>Loading...</div>,
    ssr: false
  }
);

export const ReceiptsSection = () => {
  const { t } = useTranslation("receipts");
  const { user } = useAuth();
  const [receipts, setReceipts] = useState<InvoiceResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<InvoiceResponseDto | null>(null);

  useEffect(() => {
    const fetchReceipts = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const tokensInfo = getTokensInfo();
        if (!tokensInfo?.token) return;
        
        const response = await fetch(`${API_URL}/invoices/user/${user.id}`, {
          headers: {
            Authorization: `Bearer ${tokensInfo.token}`,
          },
        });
        
        if (!response.ok) throw new Error("Failed to fetch receipts");
        const data = await response.json();
        setReceipts(data);
      } catch (error) {
        console.error("Error fetching receipts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, [user?.id]);

  return (
    <DashboardSection>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Typography variant="h5" gutterBottom>
          {t("title")}
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress />
          </Box>
        ) : receipts.length === 0 ? (
          <Typography color="text.secondary">
            {t("noReceipts")}
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {receipts.slice(0, 4).map((receipt) => (
              <Grid item xs={12} key={receipt._id}>
                <Paper 
                  onClick={() => setSelectedReceipt(receipt)}
                  sx={{ 
                    p: 2,
                    bgcolor: 'background.glass',
                    backdropFilter: 'blur(10px)',
                    transition: 'transform 0.2s',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1">
                      {new Date(receipt.invoiceDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="subtitle1" color="primary">
                      ${receipt.amount.toFixed(2)}
                    </Typography>
                  </Box>

                  {receipt.vendorGroups.map(group => (
                    <Box key={group.vendorId} sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {group.vendorName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {group.items.length} items - ${group.subtotal.toFixed(2)}
                      </Typography>
                    </Box>
                  ))}

                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    mt: 1,
                    pt: 1,
                    borderTop: 1,
                    borderColor: 'divider' 
                  }}>
                    <Typography variant="caption" color="text.secondary">
                      {receipt.vendorGroups.reduce((sum, g) => sum + g.items.length, 0)} {t("itemsCount")}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: receipt.status === 'succeeded' ? 'success.main' : 'warning.main'
                      }}
                    >
                      {receipt.status}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        <Box sx={{ 
          mt: 'auto', 
          pt: 2,
          display: 'flex',
          justifyContent: 'center'
        }}>
          <Button
            variant="outlined"
            LinkComponent="a"
            href="/receipts"
            fullWidth
            sx={{ maxWidth: 200 }}
          >
            {t("viewAll")}
          </Button>
        </Box>
      </Box>

      <InvoiceDetailModal
        invoice={selectedReceipt}
        open={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </DashboardSection>
  );
};