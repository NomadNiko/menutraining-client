import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { Phone, X, Mail } from "lucide-react";
import Chip from "@mui/material/Chip";
import { useTranslation } from "@/services/i18n/client";
import { Vendor } from "@/app/[language]/types/vendor";

interface VendorShortViewProps {
  vendor: Vendor;
  onViewMore: () => void;
  onClose: () => void;
}

export const VendorShortView = ({ vendor, onViewMore, onClose }: VendorShortViewProps) => {
  const { t } = useTranslation("vendor");
  
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 80,
        left: { xs: 0, md: '50%' },
        right: { xs: 0, md: 'auto' },
        transform: { xs: 'none', md: 'translateX(-50%)' },
        width: { xs: '100%', sm: '600px' },
        padding: theme => ({ 
          xs: 0, 
          md: theme.spacing(0, 2)
        }),
        zIndex: 1000,
        transition: 'bottom 0.3s ease-in-out' // Smooth transition for position changes
      }}
    >
      <Card sx={{
        background: 'rgba(17, 25, 40, 0.75)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.125)',
        borderRadius: { xs: '12px 12px 0 0', md: 2 },
        overflow: 'visible',
      }}>
        <CardContent>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'flex-start',
            gap: 2,
            position: 'relative',
            pt: 1
          }}>
            <Box 
              sx={{ 
                width: 80,
                height: 80,
                position: 'relative',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.paper',
                borderRadius: 1,
                overflow: 'hidden'
              }}
            >
              {vendor.logoUrl && (
                <Box
                  component="img"
                  src={vendor.logoUrl}
                  alt={vendor.businessName}
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    width: 'auto',
                    height: 'auto'
                  }}
                />
              )}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start'
              }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {vendor.businessName}
                  </Typography>
                  <Chip
                    label={t(`vendorTypes.${vendor.vendorTypes?.[0] || 'tours'}`)}
                    size="small"
                    color="primary"
                    sx={{ mb: 1 }}
                  />
                </Box>
                <IconButton 
                  onClick={onClose}
                  sx={{ 
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'text.primary'
                    }
                  }}
                >
                  <X size={20} />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1 
                  }}
                >
                  <Phone size={14} />
                  {vendor.phone}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1 
                  }}
                >
                  <Mail size={14} />
                  {vendor.email}
                </Typography>
              </Box>
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'flex-end',
                mt: 2
              }}>
                <Button 
                  variant="contained"
                  onClick={onViewMore}
                  size="small"
                  sx={{
                    background: theme => theme.palette.customGradients.buttonMain,
                    '&:hover': {
                      background: theme => theme.palette.customGradients.buttonMain,
                      filter: 'brightness(0.9)',
                    }
                  }}
                >
                  {t("learnMore")}
                </Button>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VendorShortView;