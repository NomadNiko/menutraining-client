"use client";
import { useEffect, useState } from 'react';
import { useTranslation } from "@/services/i18n/client";
import useAuth from "@/services/auth/use-auth";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import VendorAccountBalances from "./account/VendorAccountBalances";
import VendorEditCard from "@/components/cards/edit-cards/VendorEditCard";
import { VendorManagementCard } from "@/components/vendor/vendor-management-card";
import { Vendor } from "@/app/[language]/types/vendor";

export default function VendorAccountPage() {
  const { t } = useTranslation("vendor-account");
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        setLoading(true);
        const tokensInfo = getTokensInfo();
        if (!tokensInfo?.token) {
          throw new Error('No auth token');
        }

        const response = await fetch(`${API_URL}/v1/vendors/user/${user?.id}/owned`, {
          headers: {
            'Authorization': `Bearer ${tokensInfo.token}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch vendor');
        const data = await response.json();
        if (data.data.length > 0) {
          setVendor(data.data[0]);
        }
      } catch (error) {
        console.error('Error fetching vendor:', error);
        setError(t('errors.fetchFailed'));
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchVendorDetails();
    }
  }, [user?.id, t]);

  const handleVendorUpdate = async () => {
    try {
      setLoading(true);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error('No auth token');
      }

      const response = await fetch(`${API_URL}/v1/vendors/user/${user?.id}/owned`, {
        headers: {
          'Authorization': `Bearer ${tokensInfo.token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch updated vendor');
      const data = await response.json();
      if (data.data.length > 0) {
        setVendor(data.data[0]);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating vendor:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ 
        height: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          <AlertTitle>{t('errors.title')}</AlertTitle>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!vendor) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">
          <AlertTitle>{t('noVendor.title')}</AlertTitle>
          {t('noVendor.message')}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('title')}
      </Typography>
  
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <VendorAccountBalances 
          vendor={vendor} 
          onRefresh={handleVendorUpdate}
        />
        
        {isEditing ? (
          <VendorEditCard
            vendor={vendor}
            onSave={handleVendorUpdate}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <VendorManagementCard
            vendor={vendor}
            onAction={async () => {}}
            onDelete={async () => {}}
            onUpdate={handleVendorUpdate}
          />
        )}
      </Box>
    </Container>
  );
}