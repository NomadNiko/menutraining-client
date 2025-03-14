import React from 'react';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import { X, MapPin, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ProductItem } from '@/app/[language]/types/product-item';
import { useTranslation } from "@/services/i18n/client";
import { formatDuration } from '@/components/utils/duration-utils';
import { Image } from "@nextui-org/react";
import useAuth from '@/services/auth/use-auth';
import { useRouter } from 'next/navigation';

interface PublicItemDetailModalProps {
  item: ProductItem | null;
  open: boolean;
  onClose: () => void;
  onAddToCart: (item: ProductItem) => Promise<void>;
  isAddingToCart: boolean;
}



export default function PublicItemDetailModal({
  item,
  open,
  onClose,
  onAddToCart,
  isAddingToCart
}: PublicItemDetailModalProps) {
  const { t } = useTranslation("product-items");
  const { user } = useAuth();
  const router = useRouter();

  if (!item) return null;

  const handleAddToCart = () => {
    if (!user) {
      router.push('/sign-in');
      return;
    }
    
    onAddToCart(item);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(17, 25, 40, 0.75)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.125)',
          zIndex: 300,
          position: 'fixed',
          top: '16px',
          margin: 0,
          height: 'auto',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1">{item.templateName}</Typography>
          <IconButton onClick={onClose} size="small">
            <X size={16} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 2 }}>
        {item.imageURL && (
          <Box sx={{ mb: 2, borderRadius: 1, overflow: 'hidden' }}>
            <Image
              src={item.imageURL}
              alt={item.templateName}
              style={{
                width: '100%',
                height: '150px',
                objectFit: 'cover'
              }}
            />
          </Box>
        )}

        <Typography variant="body2" paragraph>
          {item.description}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Calendar size={16} />
            <Typography variant="body2">
              {format(new Date(item.productDate), 'PPPP')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Clock size={16} />
            <Typography variant="body2">
              {format(new Date(`2000-01-01T${item.startTime}`), 'h:mm a')} ({formatDuration(item.duration)})
            </Typography>
          </Box>

          {item.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MapPin size={16} />
              <Button 
                variant="text" 
                size="small"
                onClick={() => window.open(
                  `https://www.google.com/maps/search/?api=1&query=${item.location.coordinates[1]},${item.location.coordinates[0]}`,
                  '_blank'
                )}
              >
                {t('viewLocation')}
              </Button>
            </Box>
          )}
        </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          bgcolor: 'background.paper',
          p: 1.5,
          borderRadius: 1,
          mb: 2
        }}>
          <Typography variant="h6" color="primary">
            ${item.price.toFixed(2)}
          </Typography>
          {item.quantityAvailable > 0 ? (
            <Typography variant="caption" color="success.main">
              {t('available')}
            </Typography>
          ) : (
            <Typography variant="caption" color="error">
              {t('soldOut')}
            </Typography>
          )}
        </Box>

        {item.requirements && item.requirements.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              {t('requirements')}
            </Typography>
            {item.requirements.map((req, index) => (
              <Typography key={index} variant="body2" sx={{ ml: 2, fontSize: '0.875rem' }}>
                • {req}
              </Typography>
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 1.5 }}>
        <Button onClick={onClose} color="inherit" size="small">
          {t('close')}
        </Button>
        <Button
      variant="contained"
      size="small"
      onClick={handleAddToCart}  // Update this to use the new handler
      disabled={isAddingToCart || item.quantityAvailable === 0}
      startIcon={isAddingToCart ? <CircularProgress size={16} /> : null}
    >
      {isAddingToCart ? t('addingToCart') : t('addToCart')}
    </Button>
      </DialogActions>
    </Dialog>
  );
}