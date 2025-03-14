import React from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import LinearProgress from "@mui/material/LinearProgress";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

type Skill = {
  name: string;
  level: number;
  category: string;
};

export default function SkillsShowcase() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const skills: Skill[] = [
    // Infrastructure & Systems
    { name: "Linux Server Administration", level: 90, category: "Infrastructure & Operations" },
    { name: "Red Hat Enterprise Linux", level: 88, category: "Infrastructure & Operations" },
    { name: "Virtualization (VMware vSphere)", level: 92, category: "Infrastructure & Operations" },
    { name: "System Monitoring (Nagios, New Relic)", level: 85, category: "Infrastructure & Operations" },
    { name: "High Availability Systems", level: 80, category: "Infrastructure & Operations" },
    { name: "Server Farm Administration", level: 88, category: "Infrastructure & Operations" },
    { name: "Multi-OS Management", level: 85, category: "Infrastructure & Operations" },
    { name: "Door Card Systems", level: 75, category: "Infrastructure & Operations" },
    { name: "SSL/TLS & Security", level: 82, category: "Infrastructure & Operations" },
    { name: "ShoreTel Phone Systems", level: 70, category: "Infrastructure & Operations" },
    { name: "Asset Management", level: 78, category: "Infrastructure & Operations" },
    
    // DevOps & Automation
    { name: "Configuration Management", level: 85, category: "DevOps & Automation" },
    { name: "CI/CD Pipelines", level: 82, category: "DevOps & Automation" },
    { name: "Jenkins Administration", level: 80, category: "DevOps & Automation" },
    { name: "Puppet", level: 78, category: "DevOps & Automation" },
    { name: "Ansible", level: 68, category: "DevOps & Automation" },
    { name: "Infrastructure as Code", level: 76, category: "DevOps & Automation" },
    { name: "SFTP Automation", level: 75, category: "DevOps & Automation" },
    { name: "Deployment Automation", level: 80, category: "DevOps & Automation" },
    
    // Cloud & Services
    { name: "Cloud Services (AWS, Azure)", level: 75, category: "Cloud & Services" },
    { name: "SAAS Application Management", level: 78, category: "Cloud & Services" },
    { name: "CloudBolt", level: 72, category: "Cloud & Services" },
    { name: "PowerCLI", level: 70, category: "Cloud & Services" },
    { name: "Laptop Encryption", level: 75, category: "Cloud & Services" },
    
    // Scripting & Programming
    { name: "Bash/Linux Scripting", level: 82, category: "Scripting & Programming" },
    { name: "PowerShell", level: 70, category: "Scripting & Programming" },
    { name: "Python", level: 60, category: "Scripting & Programming" },
    { name: "Capistrano", level: 65, category: "Scripting & Programming" },
    { name: "WLST (WebLogic Scripting)", level: 68, category: "Scripting & Programming" },
    
    // Database & Applications
    { name: "Java Application Management", level: 72, category: "Database & Applications" },
    { name: "ELK Stack (Elasticsearch, Logstash, Kibana)", level: 75, category: "Database & Applications" },
    { name: "Splunk", level: 70, category: "Database & Applications" },
    { name: "Database Administration (Oracle, MySQL)", level: 65, category: "Database & Applications" },
    { name: "WebLogic Server", level: 70, category: "Database & Applications" },
    
    // Version Control & Collaboration
    { name: "Git", level: 85, category: "Version Control & Collaboration" },
    { name: "Gerrit", level: 78, category: "Version Control & Collaboration" },
    { name: "Subversion (SVN)", level: 80, category: "Version Control & Collaboration" },
    { name: "CollabNet SVN", level: 75, category: "Version Control & Collaboration" },
    
    // Support & Leadership
    { name: "Technical Support & Troubleshooting", level: 90, category: "Support & Leadership" },
    { name: "Team Leadership", level: 85, category: "Support & Leadership" },
    { name: "Vendor Management", level: 75, category: "Support & Leadership" },
    { name: "SLA Management", level: 88, category: "Support & Leadership" },
    { name: "Ticket Triage", level: 82, category: "Support & Leadership" }
  ];

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  // Sort categories by number of skills (most to least)
  const categories = Object.keys(skillsByCategory).sort((a, b) => 
    skillsByCategory[b].length - skillsByCategory[a].length
  );

  return (
    <Box>
      {categories.map((category) => (
        <Box key={category} sx={{ mb: theme.spacing(3) }}>
          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              pb: theme.spacing(1), 
              mb: theme.spacing(2) 
            }}
          >
            {category}
          </Typography>
          <Grid container spacing={1.5}>
            {skillsByCategory[category].map((skill) => (
              <Grid item xs={6} sm={4} md={3} key={skill.name}>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: theme.spacing(1.5), 
                    height: '100%',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 2
                    }
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 500,
                      fontSize: isMobile ? '0.75rem' : '0.875rem',
                      mb: theme.spacing(1)
                    }}
                  >
                    {skill.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: theme.spacing(1) }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={skill.level}
                      sx={{ 
                        height: 6, 
                        borderRadius: 3,
                        flex: 1,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: theme => {
                            if (skill.level >= 85) return theme.palette.success.main;
                            if (skill.level >= 70) return theme.palette.primary.main;
                            if (skill.level >= 50) return theme.palette.warning.main;
                            return theme.palette.error.main;
                          }
                        }
                      }}
                    />
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: '0.7rem',
                        minWidth: '24px',
                        textAlign: 'right'
                      }}
                    >
                      {skill.level}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
}