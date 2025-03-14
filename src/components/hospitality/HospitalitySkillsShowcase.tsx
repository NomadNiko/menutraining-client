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

export default function HospitalitySkillsShowcase() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const skills: Skill[] = [
    // Guest Service & Experience
    { name: "Guest Relations & Communication", level: 95, category: "Guest Service & Experience" },
    { name: "Conflict Resolution", level: 90, category: "Guest Service & Experience" },
    { name: "Cultural Sensitivity", level: 92, category: "Guest Service & Experience" },
    { name: "VIP Services", level: 88, category: "Guest Service & Experience" },
    { name: "Local Knowledge & Recommendations", level: 94, category: "Guest Service & Experience" },
    { name: "Problem Solving", level: 90, category: "Guest Service & Experience" },
    { name: "Experience Creation", level: 88, category: "Guest Service & Experience" },
    { name: "Guest Needs Anticipation", level: 85, category: "Guest Service & Experience" },
    
    // Front Desk & Reservations
    { name: "Check-in/Check-out Procedures", level: 95, category: "Front Desk & Reservations" },
    { name: "Reservation Management", level: 90, category: "Front Desk & Reservations" },
    { name: "Property Management Systems", level: 85, category: "Front Desk & Reservations" },
    { name: "Room Assignment Optimization", level: 88, category: "Front Desk & Reservations" },
    { name: "Guest Registration", level: 92, category: "Front Desk & Reservations" },
    { name: "Upselling Techniques", level: 82, category: "Front Desk & Reservations" },
    
    // Financial Management
    { name: "Cash Handling", level: 95, category: "Financial Management" },
    { name: "Credit Card Processing", level: 92, category: "Financial Management" },
    { name: "Revenue Reconciliation", level: 90, category: "Financial Management" },
    { name: "Multi-Currency Transactions", level: 88, category: "Financial Management" },
    { name: "Financial Accuracy", level: 92, category: "Financial Management" },
    
    // Food & Beverage Service
    { name: "Fine Dining Service", level: 88, category: "Food & Beverage Service" },
    { name: "Cocktail Preparation", level: 90, category: "Food & Beverage Service" },
    { name: "Beer & Wine Knowledge", level: 85, category: "Food & Beverage Service" },
    { name: "Menu Knowledge", level: 92, category: "Food & Beverage Service" },
    { name: "Food Safety", level: 90, category: "Food & Beverage Service" },
    { name: "Japanese Cuisine Knowledge", level: 82, category: "Food & Beverage Service" },
    { name: "Thai Cuisine Knowledge", level: 85, category: "Food & Beverage Service" },
    { name: "Table Management", level: 88, category: "Food & Beverage Service" },
    
    // Property Operations
    { name: "Housekeeping Standards", level: 85, category: "Property Operations" },
    { name: "Maintenance Issue Identification", level: 82, category: "Property Operations" },
    { name: "Room Inspection", level: 90, category: "Property Operations" },
    { name: "Common Area Maintenance", level: 85, category: "Property Operations" },
    { name: "Security Protocols", level: 88, category: "Property Operations" },
    
    // Leadership & Management
    { name: "Staff Training & Development", level: 90, category: "Leadership & Management" },
    { name: "Team Leadership", level: 85, category: "Leadership & Management" },
    { name: "Standard Operating Procedures", level: 88, category: "Leadership & Management" },
    { name: "Tour Guiding & Group Management", level: 92, category: "Leadership & Management" },
    { name: "Snowboard Instruction", level: 85, category: "Leadership & Management" },
    
    // Technical Systems
    { name: "POS Systems (Toast)", level: 90, category: "Technical Systems" },
    { name: "Property Management Software", level: 85, category: "Technical Systems" },
    { name: "Microsoft Excel", level: 92, category: "Technical Systems" },
    { name: "Reservation Systems", level: 88, category: "Technical Systems" },
    { name: "Inventory Management Systems", level: 85, category: "Technical Systems" },
    
    // Tourism & Activities
    { name: "Resort Knowledge", level: 92, category: "Tourism & Activities" },
    { name: "Nightlife Hosting", level: 90, category: "Tourism & Activities" },
    { name: "City Tour Management", level: 95, category: "Tourism & Activities" },
    { name: "Mountain Activity Knowledge", level: 88, category: "Tourism & Activities" },
    { name: "National Park Information", level: 90, category: "Tourism & Activities" },
    { name: "International Tourism", level: 95, category: "Tourism & Activities" }
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