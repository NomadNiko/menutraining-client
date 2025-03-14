import React from 'react';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useTranslation } from "@/services/i18n/client";
import { CardSectionProps } from './types';
import { CardField } from './CardField';

export const CardSection: React.FC<CardSectionProps> = ({ 
  section,
  mode = 'edit'
}) => {
  const { t } = useTranslation('tests');
  
  return (
    <Box sx={{ mb: 2 }}>
      {section.title && (
        <Typography 
          variant="h5" 
          gutterBottom
          sx={{ 
            mb: 2,
            mt: 1
          }}
        >
          {t(section.title)}
        </Typography>
      )}
      
      <Grid 
        container 
        spacing={1.2}
        sx={{
          mb: 1,
          mt: 0.8
        }}
      >
        {section.fields.map((field) => (
          <Grid 
            item 
            xs={field.gridWidth || (field.fullWidth ? 12 : 12)} // Allow gridWidth to work on mobile
            sm={field.gridWidth || (field.fullWidth ? 12 : 6)}  // For tablets
            md={field.gridWidth || (field.fullWidth ? 12 : 6)}  // For desktop
            key={field.name}
          >
            <CardField 
              field={field}
              mode={mode}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CardSection;