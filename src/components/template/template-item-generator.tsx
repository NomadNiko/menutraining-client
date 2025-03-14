import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import { useTranslation } from "@/services/i18n/client";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import FormDatePickerInput from "@/components/form/date-pickers/date-picker";
import FormTimePickerInput from "@/components/form/date-pickers/time-picker";
import { format } from 'date-fns';
import { Clock, Users } from 'lucide-react';

interface Template {
  _id: string;
  templateName: string;
  description: string;
  basePrice: number;
  productType: string;
  vendorId: string;
  defaultDuration?: number;
  defaultLongitude?: number;  // These are the actual fields
  defaultLatitude?: number;   // from template creation
  equipmentSizes?: string[];
}


interface TemplateItemGeneratorProps {
  template: Template;
  onSuccess: () => void;
  onCancel: () => void;
}

interface GenerationFormData {
  productDate: Date | null;
  startTime: Date | null;
  duration: number;
  quantity: number;
  price: number;
  instructorName?: string;
  tourGuide?: string;
  equipmentSize?: string;
  notes?: string;
}

export default function TemplateItemGenerator({
  template,
  onSuccess,
  onCancel
}: TemplateItemGeneratorProps) {
  const { t } = useTranslation("templates");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<GenerationFormData>({
    productDate: null,
    startTime: null,
    duration: template.defaultDuration || 1,
    quantity: 1,
    price: template.basePrice,
  });

  const handleInputChange = (field: keyof GenerationFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.productDate || !formData.startTime) return;
  
      setIsSubmitting(true);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) return;
  
      const submissionData = {
        templateId: template._id,
        vendorId: template.vendorId,
        productDate: format(formData.productDate, 'yyyy-MM-dd'),
        startTime: format(formData.startTime, 'HH:mm'),
        duration: formData.duration,
        price: formData.price,
        quantityAvailable: formData.quantity,
        location: {
          type: 'Point',
          coordinates: [template.defaultLongitude || 0, template.defaultLatitude || 0]
        },
        instructorName: formData.instructorName,
        tourGuide: formData.tourGuide,
        equipmentSize: formData.equipmentSize,
        notes: formData.notes
      };
  
      const response = await fetch(`${API_URL}/product-items/generate/${template._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokensInfo.token}`
        },
        body: JSON.stringify(submissionData)
      });
  
      if (!response.ok) throw new Error('Failed to generate items');
      onSuccess();
    } catch (error) {
      console.error('Error generating items:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {t('generateItems')} - {template.templateName}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                {t('scheduling')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <FormDatePickerInput
                    name="productDate"
                    label={t('date')}
                    defaultValue={formData.productDate}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <FormTimePickerInput
                    name="startTime"
                    label={t('startTime')}
                    defaultValue={formData.startTime}
                  />
                </Box>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                {t('availability')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('duration')}
                  value={formData.duration}
                  onChange={handleInputChange('duration')}
                  InputProps={{
                    startAdornment: <Clock size={16} />,
                    endAdornment: <Typography>hr</Typography>
                  }}
                />
                <TextField
                  fullWidth
                  type="number"
                  label={t('quantity')}
                  value={formData.quantity}
                  onChange={handleInputChange('quantity')}
                  InputProps={{
                    startAdornment: <Users size={16} />
                  }}
                />
              </Box>
            </Box>

            <TextField
              fullWidth
              type="number"
              label={t('price')}
              value={formData.price}
              onChange={handleInputChange('price')}
              sx={{ mb: 3 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" gutterBottom>
              {t('additionalDetails')}
            </Typography>

            {template.productType === 'lessons' && (
              <TextField
                fullWidth
                label={t('instructorName')}
                value={formData.instructorName}
                onChange={handleInputChange('instructorName')}
                sx={{ mb: 2 }}
              />
            )}

            {template.productType === 'tours' && (
              <TextField
                fullWidth
                label={t('tourGuide')}
                value={formData.tourGuide}
                onChange={handleInputChange('tourGuide')}
                sx={{ mb: 2 }}
              />
            )}

            {template.equipmentSizes && template.equipmentSizes.length > 0 && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t('equipmentSize')}</InputLabel>
                <Select
                  value={formData.equipmentSize || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    equipmentSize: e.target.value
                  }))}
                >
                  {template.equipmentSizes.map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <TextField
              fullWidth
              multiline
              rows={4}
              label={t('notes')}
              value={formData.notes}
              onChange={handleInputChange('notes')}
            />
          </Grid>
        </Grid>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: 2,
          mt: 4 
        }}>
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {t('cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.productDate || !formData.startTime}
          >
            {t('generate')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}