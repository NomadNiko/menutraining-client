import React, { useState } from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { ChevronDown, ChevronRight, MapPin } from 'lucide-react';
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import { experiences } from './HospitalityJobHistory';
import { ExperienceEntry } from './types';

const HospitalityResumeSection: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedExperience, setSelectedExperience] = useState<ExperienceEntry | null>(null);
  
  const truncateDescription = (description: string): string => {
    return description.length > 150
      ? description.substring(0, 150) + '...'
      : description;
  };

  const handleOpenDetails = (experience: ExperienceEntry) => {
    setSelectedExperience(experience);
  };

  const handleCloseDetails = () => {
    setSelectedExperience(null);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {experiences.map((experience, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={() => handleOpenDetails(experience)}
            >
              <CardContent>
                {/* Skills tags section */}
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 0.5, 
                  mb: 2,
                  maxHeight: '80px',
                  overflow: 'hidden'
                }}>
                  {experience.skills.slice(0, 4).map((skill, idx) => (
                    <Chip
                      key={idx}
                      label={skill}
                      size="small"
                      variant="outlined"
                      color="primary"
                      sx={{ fontSize: '0.65rem' }}
                    />
                  ))}
                  {experience.skills.length > 4 && (
                    <Chip
                      label={`+${experience.skills.length - 4} more`}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.65rem' }}
                    />
                  )}
                </Box>
                
                <Typography variant="overline" color="primary.main" gutterBottom sx={{ fontWeight: 'medium' }}>
                  {experience.period}
                </Typography>
                <Typography variant="h6" gutterBottom color="text.primary">
                  {experience.role}
                </Typography>
                {experience.company && (
                  <Typography color="secondary.main" gutterBottom sx={{ fontWeight: 'medium' }}>
                    {experience.company}
                  </Typography>
                )}
                {experience.location && (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.5, 
                    mb: 1,
                    color: 'text.secondary'
                  }}>
                    <MapPin size={14} />
                    <Typography variant="body2">
                      {experience.location}
                    </Typography>
                  </Box>
                )}
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="text.secondary" paragraph>
                  {truncateDescription(experience.description)}
                </Typography>
                
                <Typography variant="subtitle2" color="primary.main" sx={{ mt: 1, mb: 0.5 }}>
                  Key Responsibilities:
                </Typography>
                <Box component="ul" sx={{ pl: 2, mt: 0, mb: 1 }}>
                  {experience.keyPoints.map((point, idx) => (
                    <Typography component="li" variant="caption" key={idx} color="text.secondary" sx={{ mb: 0.5 }}>
                      {point.title}
                    </Typography>
                  ))}
                </Box>
                
                <Button 
                  size="small" 
                  endIcon={<ChevronDown size={16} />} 
                  sx={{ mt: 1, alignSelf: 'flex-start' }}
                >
                  Read More
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Detail Dialog */}
      <Dialog
        open={!!selectedExperience}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 2,
            maxHeight: '90vh',
          }
        }}
      >
        {selectedExperience && (
          <>
            <DialogTitle sx={{ 
                bgcolor: theme => theme.palette.primary.main,
                color: theme => theme.palette.primary.contrastText,
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Typography variant="h5">{selectedExperience.role}</Typography>
              <Typography 
                variant="subtitle2" 
                color="primary.contrastText" 
                sx={{ opacity: 0.9 }}
              >
                {selectedExperience.company} | {selectedExperience.period}
              </Typography>
              {selectedExperience.location && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  mt: 0.5,
                  color: 'primary.contrastText',
                  opacity: 0.9
                }}>
                  <MapPin size={16} />
                  <Typography variant="body2">
                    {selectedExperience.location}
                  </Typography>
                </Box>
              )}
            </DialogTitle>
            <DialogContent dividers>
              {/* Skills section in dialog */}
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 0.5, 
                mb: 2 
              }}>
                {selectedExperience.skills.map((skill, idx) => (
                  <Chip
                    key={idx}
                    label={skill}
                    size="small"
                    color="primary"
                  />
                ))}
              </Box>
              
              <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                {selectedExperience.description}
              </Typography>
              
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  mt: 2, 
                  color: theme.palette.primary.main,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  pb: 1
                }}
              >
                Key Responsibilities & Achievements
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                {selectedExperience.keyPoints.map((point, idx) => (
                  <Paper 
                  key={idx} 
                  elevation={1} 
                  sx={{ 
                    p: theme => theme.spacing(2), 
                    mb: theme => theme.spacing(2),
                    borderLeft: '4px solid',
                    borderColor: 'primary.main',
                    bgcolor: 'background.paper',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: theme => theme.spacing(1) }}>
                    <ChevronRight 
                      size={20} 
                      color={theme.palette.primary.main} 
                      style={{ marginTop: theme.spacing(0.25) }}
                    />
                    <Box>
                      <Typography 
                        variant="subtitle1" 
                        color="primary.main" 
                        sx={{ fontWeight: 'bold', mb: theme => theme.spacing(0.5) }}
                      >
                        {point.title}
                      </Typography>
                      <Typography variant="body2">
                        {point.description}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
                ))}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetails}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default HospitalityResumeSection;