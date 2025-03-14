import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Image } from "@nextui-org/react";
import { VendorHeaderProps } from "./types";

export const VendorHeader: React.FC<VendorHeaderProps> = ({
  logoUrl,
  businessName,
  description,
}) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "column", sm: "row" },
      gap: 3,
      mb: 2,
    }}
  >
    <Box
      sx={{
        width: { xs: "100%", sm: 100 },
        height: { xs: 100, sm: 100 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Image
        src={logoUrl}
        alt={businessName}
        style={{
          maxWidth: "100px",
          maxHeight: "100px",
          objectFit: "contain",
        }}
      />
    </Box>
    <Box sx={{ flex: 1 }}>
      <Typography variant="h5" gutterBottom>
        {businessName}
      </Typography>
      <Typography
        color="text.secondary"
        component="p"
        variant="body2"
        sx={{ mb: 2 }}
      >
        {description}
      </Typography>
    </Box>
  </Box>
);