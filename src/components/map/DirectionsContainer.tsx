import React from 'react';
import Box from "@mui/material/Box";

interface DirectionsContainerProps {
  children: React.ReactNode;
}

const DirectionsContainer: React.FC<DirectionsContainerProps> = ({ children }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 70,
        left: { xs: 0, md: '50%' },
        right: { xs: 0, md: 'auto' },
        height: { xs: '22%', md: '22%' },
        width: { xs: '100%', sm: '600px' },
        transform: { xs: 'none', md: 'translateX(-50%)' },
        bgcolor: "background.glass",
        backdropFilter: "blur(10px)",
        borderRadius: { xs: "12px 12px 0 0", md: 2 },
        border: "1px solid",
        borderColor: "divider",
        zIndex: 75,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
    </Box>
  );
};

export default DirectionsContainer;