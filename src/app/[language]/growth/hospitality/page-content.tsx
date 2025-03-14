 "use client";
import { useState } from 'react';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Chip from '@mui/material/Chip';
import Link from "@mui/material/Link";
import HospitalityResumeSection from "@/components/hospitality/HospitalityResumeSection";
import HospitalitySkillsShowcase from "@/components/hospitality/HospitalitySkillsShowcase";
import HospitalityGallery from "@/components/hospitality/HospitalityGallery";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { 
  Mail, 
  Phone, 
  Linkedin, 
  MapPin,
  Utensils,
  Hotel,
  Plane,
  Snowflake
} from 'lucide-react';

export default function HospitalityPortfolioPageContent() {
  const [selectedSection, setSelectedSection] = useState<string>('resume');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" gutterBottom sx={{ 
        fontSize: { xs: '2rem', md: '3rem' },
        textAlign: { xs: 'center', md: 'left' },
        color: theme.palette.primary.main
      }}>
        Niko Halley - Resume & Portfolio
      </Typography>
      
      <Grid container spacing={4}>
        <Grid 
          item 
          xs={12} 
          md={5} 
          lg={4} 
          order={{ 
            xs: 1,  
            md: 1   
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Paper elevation={2} sx={{ 
              p: 3,
              borderRadius: 2,
              position: { md: 'sticky' },
              top: { md: 24 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <Avatar
                alt="Niko Halley"
                src="https://ixplor-profile-s3-bucket-02.s3.us-east-2.amazonaws.com/c34dbba4868a4611967a3.jpeg"
                sx={{ 
                  width: 250, 
                  height: 250, 
                  mb: 2, 
                  border: `4px solid ${theme.palette.primary.main}` 
                }}
              />
              <Typography variant="h5" gutterBottom>
                Niko Halley
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Hospitality Professional
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                justifyContent: 'center',
                gap: 1,
                mb: 2
              }}>
                <Chip 
                  icon={<Hotel size={16} />} 
                  label="Front Desk" 
                  size="small" 
                  color="primary" 
                  variant="outlined" 
                />
                <Chip 
                  icon={<Utensils size={16} />} 
                  label="Fine Dining" 
                  size="small" 
                  color="primary" 
                  variant="outlined" 
                />
                <Chip 
                  icon={<Plane size={16} />} 
                  label="International" 
                  size="small" 
                  color="primary" 
                  variant="outlined" 
                />
                <Chip 
                  icon={<Snowflake size={16} />} 
                  label="Resort Experience" 
                  size="small" 
                  color="primary" 
                  variant="outlined" 
                />
              </Box>

              <Stack 
                spacing={1.5} 
                sx={{ 
                  mt: 2, 
                  width: '100%', 
                  alignItems: 'center' 
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Mail size={20} />
                  <Link 
                    href="mailto:nomad.niko.inc@gmail.com" 
                    color="inherit" 
                    underline="hover"
                  >
                    nomad.niko.inc@gmail.com
                  </Link>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone size={20} />
                  <Typography>(954) 614-1057</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MapPin size={20} />
                  <Typography>Honolulu, HI</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  <Link 
                    href="https://www.linkedin.com/in/nhalley3398868" 
                    target="_blank" 
                    color="inherit"
                  >
                    <Linkedin size={24} />
                  </Link>
                </Box>
              </Stack>

              <Typography variant="body2" paragraph sx={{ mt: 2 }}>
                Versatile hospitality professional with extensive experience in customer service, 
                hotel operations, and dining management across multiple countries and hospitality settings. 
                My diverse background spans hostels, fine dining restaurants, ski resorts, and national parks, 
                combining exceptional guest service with strong operational capabilities. I excel at creating 
                memorable experiences for guests while efficiently managing the operational details that ensure 
                smooth service delivery.
              </Typography>
            </Paper>
          </Box>
          
          <Paper elevation={2} sx={{ 
            p: 3,
            borderRadius: 2,
            position: { md: 'sticky' },
            top: { md: 230 },
          }}>
            <Typography variant="h6" gutterBottom>
              Navigation
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'row' : 'column', 
              gap: 2,
              flexWrap: isMobile ? 'wrap' : 'nowrap'
            }}>
              {[
                { id: 'resume', label: 'Experience' },
                { id: 'skills', label: 'Skills' },
                { id: 'gallery', label: 'Locations' },
              ].map((section) => (
                <Button
                  key={section.id}
                  variant={selectedSection === section.id ? "contained" : "outlined"}
                  onClick={() => setSelectedSection(section.id)}
                  fullWidth={!isMobile}
                  sx={{ flex: isMobile ? '1 0 calc(50% - 8px)' : '1' }}
                >
                  {section.label}
                </Button>
              ))}
            </Box>
          </Paper>
        </Grid>
        
        <Grid 
          item 
          xs={12} 
          md={7} 
          lg={8} 
          order={{ 
            xs: 2,  
            md: 2   
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              {selectedSection === 'resume' && 'Professional Experience'}
              {selectedSection === 'skills' && 'Hospitality Skills'}
              {selectedSection === 'gallery' && 'Global Experience'}
            </Typography>
          </Box>
          
          {selectedSection === 'resume' && <HospitalityResumeSection />}
          {selectedSection === 'skills' && <HospitalitySkillsShowcase />}
          {selectedSection === 'gallery' && <HospitalityGallery />}
        </Grid>
      </Grid>
    </Container>
  );
}