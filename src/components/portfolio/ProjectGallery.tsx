import React from 'react';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

export default function ProjectGallery() {
  const projects = [
    {
      title: "iXplor Booking Platform",
      description: "Full-stack booking and marketplace platform for local experiences and activities",
      technologies: "React, Next.js, TypeScript, Node.js, MongoDB, Stripe, AWS, Google Places, Mapbox, Material-UI",
      image: "https://ixplor-profile-s3-bucket-02.s3.us-east-2.amazonaws.com/dbba4868a4611967a34ef.png"
    },
    {
      title: "Aelyrnathyn - Unity Game Project",
      description: "Top Down Hex-Tile Based Strategy Game. Tied for 2nd in Game Jame", 
      technologies: "Unity, C#, JavaScript, Spriter Animations.",
      image: "https://ixplor-profile-s3-bucket-02.s3.us-east-2.amazonaws.com/bba4868a4611967a34ef4.jpg"
    },
    {
      title: "Menteo - Server Menu Training App",
      description: "Restaurant Server Training App with Gamified Quizzes and Interactive Menu Information",
      technologies: "Unity, C#, JavaScript",
      image: "https://ixplor-profile-s3-bucket-02.s3.us-east-2.amazonaws.com/ba4868a4611967a34ef4f.jpg" 
    }
  ];

  return (
    <Grid container spacing={3}>
      {projects.map((project) => (
        <Grid item xs={12} sm={6} key={project.title}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image={project.image}
              alt={project.title}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {project.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {project.description}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Technologies: {project.technologies}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}