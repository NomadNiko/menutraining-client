"use client";
import { format } from 'date-fns';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import { X } from 'lucide-react';
import { ProductItem, ProductItemStatus } from '@/app/[language]/types/product-item';
import { useTranslation } from "@/services/i18n/client";
import { useRouter } from 'next/navigation';

interface ProductItemDetailModalProps {
    item: ProductItem | null;
    open: boolean;
    onClose: () => void;
    isVendorView?: boolean;
    onUpdateStatus: (itemId: string, newStatus: ProductItemStatus) => Promise<void>;
   }

export default function ProductItemDetailModal({ 
  item, 
  open, 
  onClose, 
  isVendorView = false 
}: ProductItemDetailModalProps) {
  const { t } = useTranslation("product-items");
  const router = useRouter();

  if (!item) return null;

  const getStatusColor = (status: ProductItemStatus): "success" | "error" | "warning" | "default" => {
    switch (status) {
      case ProductItemStatus.PUBLISHED:
        return 'success';
      case ProductItemStatus.CANCELLED:
        return 'error';
      case ProductItemStatus.DRAFT:
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleEdit = () => {
    router.push(`/product-items/${item._id}/edit`);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{item.templateName}</Typography>
          <IconButton onClick={onClose} size="small">
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {item.imageURL && (
          <Box
            component="img"
            src={item.imageURL}
            alt={item.templateName}
            sx={{
              width: '100%',
              height: 300,
              objectFit: 'cover',
              borderRadius: 1,
              mb: 2
            }}
          />
        )}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              {item.description}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2">{t('date')}</Typography>
            <Typography>
              {format(new Date(item.productDate), 'PPP')}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2">{t('time')}</Typography>
            <Typography>
              {format(new Date(`2000-01-01T${item.startTime}`), 'h:mm a')}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2">{t('duration')}</Typography>
            <Typography>{item.duration} {t('minutes')}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2">{t('price')}</Typography>
            <Typography>${item.price.toFixed(2)}</Typography>
          </Grid>

          {isVendorView && (
            <>
              <Grid item xs={6}>
                <Typography variant="subtitle2">{t('available')}</Typography>
                <Typography>{item.quantityAvailable}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="subtitle2">{t('statusTitle')}</Typography>
                <Chip
                  size="small"
                  label={t(`status.${item.itemStatus.toLowerCase()}`)}
                  color={getStatusColor(item.itemStatus)}
                />
              </Grid>
            </>
          )}

          {(item.instructorName || item.tourGuide || item.equipmentSize) && (
            <Grid item xs={12}>
              {item.instructorName && (
                <Typography variant="body2">
                  {t('instructorName')}: {item.instructorName}
                </Typography>
              )}
              {item.tourGuide && (
                <Typography variant="body2">
                  {t('tourGuide')}: {item.tourGuide}
                </Typography>
              )}
              {item.equipmentSize && (
                <Typography variant="body2">
                  {t('equipmentSize')}: {item.equipmentSize}
                </Typography>
              )}
            </Grid>
          )}

          {item.notes && (
            <Grid item xs={12}>
              <Typography variant="subtitle2">{t('notes')}</Typography>
              <Typography variant="body2">{item.notes}</Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        {isVendorView && (
          <Button onClick={handleEdit} color="primary">
            {t('edit')}
          </Button>
        )}
        <Button onClick={onClose} color="inherit">
          {t('close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}