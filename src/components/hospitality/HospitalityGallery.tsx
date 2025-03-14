import React from 'react';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { Calendar } from 'lucide-react';

export default function HospitalityGallery() {
  const locations = [
    {
      title: "Waikiki, Hawaii",
      description: "Currently working at Polynesian Beach Club Hostel as Training Manager/Front Desk and at Izakaya 855 Aloha as Server, bringing Hawaiian hospitality to life in this iconic beach destination.",
      period: "2023 - Present",
      highlights: ["Hostel Management", "Japanese Cuisine", "Training & Development", "Beachfront Hospitality"],
      image: "/api/placeholder/400/200"
    },
    {
      title: "Denali Region, Alaska",
      description: "Served as Bartender & Fine Dining Server at The Overlook & 49th State Brewing, providing exceptional dining experiences for visitors to America's most pristine wilderness.",
      period: "Apr 2023 - Jul 2023",
      highlights: ["National Park Tourism", "Fine Dining", "Mixology", "Wilderness Hospitality"],
      image: "/api/placeholder/400/200"
    },
    {
      title: "Keystone, Colorado",
      description: "Bartended at 9280 Tap House in this popular ski resort, serving winter sports enthusiasts and creating a welcoming atmosphere for visitors from around the world.",
      period: "Oct 2022 - Mar 2023",
      highlights: ["Mountain Resort", "Craft Beer", "Winter Tourism", "Après-Ski"],
      image: "/api/placeholder/400/200"
    },
    {
      title: "Grand Teton National Park",
      description: "Worked as Server & Bartender at Colter Bay Ranch House, enhancing the national park experience for visitors with exceptional service in this natural wonderland.",
      period: "May 2022 - Sep 2022",
      highlights: ["National Park Service", "International Guests", "Seasonal Tourism", "Natural Wonder"],
      image: "/api/placeholder/400/200"
    },
    {
      title: "Ludlow, Vermont",
      description: "Served as Fine Dining Server & Bartender at Coleman Brook Tavern while also working as a Professional Snowboard Instructor at Okemo Mountain Resort.",
      period: "Jan 2021 - Apr 2022",
      highlights: ["Ski Resort", "Snowboard Instruction", "Fine Dining", "Winter Sports"],
      image: "/api/placeholder/400/200"
    },
    {
      title: "Prague, Czech Republic",
      description: "Managed front desk operations and coordinated activities at multiple hostels in Prague, providing exceptional experiences for international travelers in this historic European capital.",
      period: "Nov 2019 - Feb 2021",
      highlights: ["International Tourism", "City Tours", "Nightlife Hosting", "Cultural Navigation"],
      image: "/api/placeholder/400/200"
    }
  ];

  return (
    <Grid container spacing={3}>
      {locations.map((location) => (
        <Grid item xs={12} sm={6} key={location.title}>
          <Card sx={{ 
            height: '100%', 
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 4
            }
          }}>
            <CardMedia
              component="img"
              height="200"
              image={location.image}
              alt={location.title}
            />
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                {location.title}
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                mb: 1.5, 
                color: 'text.secondary'
              }}>
                <Calendar size={16} />
                <Typography variant="body2">
                  {location.period}
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2, flexGrow: 1 }}>
                {location.description}
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 'auto' }}>
                {location.highlights.map((highlight, index) => (
                  <Chip
                    key={index}
                    label={highlight}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}