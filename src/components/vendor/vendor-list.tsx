import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useTheme } from "@mui/material/styles";
import { VendorLocation, VendorTypes } from '@/components/mock-data/vendor-location';
import { X, Binoculars, GraduationCap, Timer, Ticket } from 'lucide-react';

const VendorIcon = ({ type }: { type: VendorTypes }) => {
  const theme = useTheme();
  const iconSize = theme.spacing(2.5); // 20px equivalent

  switch (type) {
    case 'tours':
      return <Binoculars size={iconSize} />;
    case 'lessons':
      return <GraduationCap size={iconSize} />;
    case 'rentals':
      return <Timer size={iconSize} />;
    case 'tickets':
      return <Ticket size={iconSize} />;
  }
};

export const VendorListView: React.FC<{
  vendors: VendorLocation[];
  onVendorClick: (vendor: VendorLocation) => void;
  onClose: () => void;
  position: { longitude: number; latitude: number };
}> = ({ vendors, onVendorClick, onClose, position }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'absolute',
        left: position.longitude,
        top: position.latitude,
        transform: 'translate(-50%, -100%)',
        marginTop: theme.spacing(-0.125), // Small offset to avoid overlap with markers
        width: theme.spacing(35), // Roughly the width of 4 markers
        zIndex: 2,
      }}
    >
      <Card>
        <CardContent sx={{ position: 'relative', p: 2 }}>
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: theme.spacing(1),
              right: theme.spacing(1),
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary'
              }
            }}
          >
            <X size={theme.spacing(2.5)} />
          </IconButton>

          <Typography variant="h6" gutterBottom>
            Nearby Vendors ({vendors.length})
          </Typography>

          <List
            sx={{
              maxHeight: theme.spacing(35),
              overflow: 'auto',
              '&::-webkit-scrollbar': {
                display: 'none'
              },
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {vendors.map((vendor) => (
              <ListItemButton 
                key={vendor.properties.businessName}
                onClick={() => onVendorClick(vendor)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&:hover': {
                    backgroundColor: 'background.glass',
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: theme.spacing(5) }}>
                  <VendorIcon type={vendor.properties.vendorTypes} />
                </ListItemIcon>
                <ListItemText 
                  primary={vendor.properties.businessName}
                  secondary={vendor.properties.vendorTypes.charAt(0).toUpperCase() + vendor.properties.vendorTypes.slice(1)}
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: 500
                  }}
                  secondaryTypographyProps={{
                    variant: 'caption'
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VendorListView;