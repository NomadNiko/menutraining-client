import { useEffect, useState } from 'react';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useRouter } from 'next/navigation';
import { useTranslation } from "@/services/i18n/client";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { Plus, Filter, ChevronUp, ChevronDown } from 'lucide-react';
import { TemplateStatusEnum, TemplateStatusBadge } from './template-status-badge';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { formatDistance } from 'date-fns';
import useAuth from '@/services/auth/use-auth';
import { formatDuration } from '../utils/duration-utils';


interface Template {
    _id: string;
    templateName: string;
    description: string;
    basePrice: number;
    productType: 'tours' | 'lessons' | 'rentals' | 'tickets';
    vendorId: string;
    imageURL?: string;
    templateStatus: TemplateStatusEnum;
    defaultDuration?: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export default function TemplateListView() {
    const { user } = useAuth();
    const { t } = useTranslation("templates");
    const router = useRouter();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
  
    const loadTemplates = async () => {
      try {
        setLoading(true);
        const tokensInfo = getTokensInfo();
        if (!tokensInfo?.token) {
          router.push('/sign-in');
          return;
        }

        if (!user?.id) {
            throw new Error('User not authenticated');
          }
          
        // First, get the user's vendors
        const vendorResponse = await fetch(`${API_URL}/v1/vendors/user/${user.id}/owned`, {
          headers: {
            Authorization: `Bearer ${tokensInfo.token}`,
          },
        });
  
        if (!vendorResponse.ok) {
          throw new Error('Failed to fetch vendor information');
        }
  
        const vendorData = await vendorResponse.json();
        if (!vendorData.data.length) {
          setTemplates([]);
          return;
        }
  
        const vendorId = vendorData.data[0]._id;
        const response = await fetch(`${API_URL}/product-templates/by-vendor/${vendorId}`, {
          headers: {
            Authorization: `Bearer ${tokensInfo.token}`,
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setTemplates(data.data);
        } else {
          throw new Error('Failed to load templates');
        }
      } catch (error) {
        console.error('Error loading templates:', error);
      } finally {
        setLoading(false);
      }
    };
  
    const handleGenerateItems = (templateId: string) => {
      router.push(`/templates/${templateId}/generate`);
    };
  
    const handleEditTemplate = (templateId: string) => {
      router.push(`/templates/${templateId}/edit`);
    };
  
    const filteredTemplates = templates.filter(template => 
      template.templateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        loadTemplates();
      }, []); 
  
    if (loading) {
      return (
        <Container sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 64px)',
        }}>
          <CircularProgress />
        </Container>
      );
    }
  
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2,
        }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {t('title')}
            </Typography>
            <Typography color="text.secondary">{t('subtitle')}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="inherit"
              onClick={() => setShowFilters(!showFilters)}
              startIcon={showFilters ? <ChevronUp /> : <ChevronDown />}
            >
              <Filter className="mr-2" size={16} />
              {t('filters')}
            </Button>
            <Button
              variant="contained"
              onClick={() => router.push('/templates/add')}
              startIcon={<Plus size={16} />}
            >
              {t('addTemplate')}
            </Button>
          </Box>
        </Box>
  
        <TextField
          fullWidth
          placeholder={t('searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 4 }}
        />
  
        <Grid container spacing={3}>
          {filteredTemplates.map((template) => (
            <Grid item xs={12} sm={6} md={4} key={template._id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                position: 'relative',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.2s ease-in-out'
                }
              }}>
                <TemplateStatusBadge status={template.templateStatus} />
                
                {template.imageURL && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={template.imageURL}
                    alt={template.templateName}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
  
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {template.templateName}
                  </Typography>
                  <Typography color="text.secondary" paragraph>
                    {template.description}
                  </Typography>
  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2">
                      Base Price: ${template.basePrice.toFixed(2)}
                    </Typography>
                    {template.defaultDuration && (
                      <Typography variant="body2">
                        Duration: {formatDuration(template.defaultDuration)}
                      </Typography>
                    )}
                  </Box>
  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      variant="contained" 
                      size="small"
                      onClick={() => handleGenerateItems(template._id)}
                    >
                      {t('generateItems')}
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleEditTemplate(template._id)}
                    >
                      {t('edit')}
                    </Button>
                  </Box>
  
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                    {t('updated')} {formatDistance(new Date(template.updatedAt), new Date(), { addSuffix: true })}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }