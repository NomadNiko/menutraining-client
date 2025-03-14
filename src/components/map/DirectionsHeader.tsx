import React from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Navigation2, X } from "lucide-react";

interface DirectionsHeaderProps {
  onClose?: () => void;
}

const DirectionsHeader: React.FC<DirectionsHeaderProps> = ({ onClose }) => {
  return (
    <Box sx={{
      p: 2,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: 1,
      borderColor: "divider",
    }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Navigation2 size={20} />
        <Typography variant="h6">Directions</Typography>
      </Box>
      {onClose && (
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      )}
    </Box>
  );
};

export default DirectionsHeader;