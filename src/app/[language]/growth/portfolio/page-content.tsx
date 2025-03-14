"use client";
import { useState } from 'react';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import ResumeSection from "@/components/portfolio/ResumeSection";
import SkillsShowcase from "@/components/portfolio/SkillsShowcase";
import ProjectGallery from "@/components/portfolio/ProjectGallery";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { 
  Mail, 
  Phone, 
  Linkedin, 
  Github, 
  MapPin 
} from 'lucide-react';

export default function PortfolioPageContent() {
  const [selectedSection, setSelectedSection] = useState<string>('resume');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" gutterBottom sx={{ 
        fontSize: { xs: '1.5rem', md: '2.5rem' },
        textAlign: { xs: 'center', md: 'left' },
        color: theme.palette.primary.main
      }}>
        Niko Halley - Portfolio
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
                Tech Support - DevOps
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Full Stack - GameDev
              </Typography>

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
                    href="mailto:niko.halley@example.com" 
                    color="inherit" 
                    underline="hover"
                  >
                    niko@ixplor.app
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
                  <Link 
                    href="https://github.com/NomadNiko/" 
                    target="_blank" 
                    color="inherit"
                  >
                    <Github size={24} />
                  </Link>
                </Box>
              </Stack>

              <Typography variant="body2" paragraph sx={{ mt: 2 }}>
                I am a versatile IT professional with extensive experience in IT systems support, cloud engineering, 
                and system administration. My career spans roles in Site Operations, Cloud Engineering, DevOps, SysAdmin, Cyber Systems Operations
                and Technical Support. I have worked in range of roles, but most have had a strong focus on infrastructure automation, 
                performance optimization, and streamlining complex technical environments.
                In my free time I enjoy working on personal projects, Hiking, Traveling the Globe and 
                taking part in GameJams to improve my Game Development skills.
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
              {['resume', 'skills', 'projects'].map((section) => (
                <Button
                  key={section}
                  variant={selectedSection === section ? "contained" : "outlined"}
                  onClick={() => setSelectedSection(section)}
                  fullWidth={!isMobile}
                  sx={{ flex: isMobile ? '1 0 calc(50% - 8px)' : '1' }}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
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
              {selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)}
            </Typography>
          </Box>
          
          {selectedSection === 'resume' && <ResumeSection />}
          {selectedSection === 'skills' && <SkillsShowcase />}
          {selectedSection === 'projects' && <ProjectGallery />}
        </Grid>
      </Grid>
    </Container>
  );
}