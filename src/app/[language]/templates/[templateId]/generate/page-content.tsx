'use client';
import { useState, useEffect } from 'react';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/services/i18n/client";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import ItemGeneratorCard from '@/components/template/card/ItemGeneratorCard';
import { Template } from '@/components/template/types/template.types';

interface ProductGenerationPageContentProps {
  templateId: string;
}

export default function ProductGenerationPageContent({ templateId }: ProductGenerationPageContentProps) {
  const { t } = useTranslation("templates");
  const router = useRouter();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const tokensInfo = getTokensInfo();
        if (!tokensInfo?.token) {
          router.push('/sign-in');
          return;
        }

        const response = await fetch(`${API_URL}/product-templates/${templateId}`, {
          headers: {
            Authorization: `Bearer ${tokensInfo.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to load template');
        }

        const data = await response.json();
        setTemplate(data.data);
      } catch (error) {
        console.error('Error loading template:', error);
        router.push('/templates');
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [templateId, router, t]);

  if (loading) {
    return (
      <Container sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 'calc(100vh - 64px)'
      }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!template) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Alert severity="error">
            {t('templateNotFound')}
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t("generateProducts")}
      </Typography>
      <Typography color="text.secondary" paragraph>
        {t("generationSubtitle")}
      </Typography>
      <ItemGeneratorCard 
        template={template}
        onSuccess={() => router.push('/templates')}
        onCancel={() => router.push('/templates')}
      />
    </Container>
  );
}