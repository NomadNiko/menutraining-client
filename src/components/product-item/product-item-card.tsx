"use client";
import { useRouter } from 'next/navigation';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { X } from 'lucide-react';
import { formatDistance, format } from 'date-fns';
import { useTranslation } from "@/services/i18n/client";
import { ProductItem, ProductItemStatus } from '@/app/[language]/types/product-item';

interface ProductItemCardProps {
  item: ProductItem;
  onUpdateStatus?: (itemId: string, newStatus: ProductItemStatus) => Promise<void>;
  isModal?: boolean;
  onClose?: () => void;
  isVendorView?: boolean;
}

export const ProductItemCard = ({ 
  item, 
  onUpdateStatus, 
  isModal = false,
  onClose,
  isVendorView = false
}: ProductItemCardProps) => {
  const { t } = useTranslation("product-items");
  const router = useRouter();

  const getStatusColor = (status: string): "success" | "error" | "default" => {
    switch (status) {
      case ProductItemStatus.PUBLISHED:
        return 'success';
      case ProductItemStatus.CANCELLED:
        return 'error';
      default:
        return 'default';
    }
  };

  const handleEdit = () => {
    router.push(`/product-items/${item._id}/edit`);
  };

  const content = (
    <>
      {item.imageURL && (
        <CardMedia
          component="img"
          height="200"
          image={item.imageURL}
          alt={item.templateName}
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {item.templateName}
          </Typography>
          {isVendorView && (
            <Chip
              label={t(`status.${item.itemStatus.toLowerCase()}`)}
              color={getStatusColor(item.itemStatus)}
              size="small"
            />
          )}
        </Box>

        <Typography color="text.secondary" paragraph>
          {item.description}
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {t('date')}
            </Typography>
            <Typography>
              {format(new Date(item.productDate), 'PPP')}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {t('time')}
            </Typography>
            <Typography>{format(new Date(`2000-01-01T${item.startTime}`), 'h:mm a')}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {t('duration')}
            </Typography>
            <Typography>
              {item.duration} {t('minutes')}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {t('price')}
            </Typography>
            <Typography>${item.price.toFixed(2)}</Typography>
          </Box>
          {isVendorView && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {t('available')}
              </Typography>
              <Typography>
                {item.quantityAvailable} / {item.quantityAvailable + (item.quantitySold || 0)}
              </Typography>
            </Box>
          )}
        </Box>

        {(item.instructorName || item.tourGuide || item.equipmentSize) && (
          <Box sx={{ mb: 2 }}>
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
          </Box>
        )}

        {item.notes && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {item.notes}
          </Typography>
        )}

        <Typography variant="caption" color="text.secondary">
          {t('updated')} {formatDistance(new Date(item.updatedAt), new Date(), { addSuffix: true })}
        </Typography>
      </CardContent>

      {isVendorView && (
        <CardActions>
          <Button
            size="small"
            color="primary"
            onClick={handleEdit}
          >
            {t('actions.edit')}
          </Button>
          {onUpdateStatus && item.itemStatus === ProductItemStatus.PUBLISHED && (
            <Button
              size="small"
              color="error"
              onClick={() => onUpdateStatus(item._id, ProductItemStatus.CANCELLED)}
            >
              {t('actions.cancel')}
            </Button>
          )}
          {onUpdateStatus && item.itemStatus === ProductItemStatus.CANCELLED && (
            <Button
              size="small"
              color="success"
              onClick={() => onUpdateStatus(item._id, ProductItemStatus.PUBLISHED)}
            >
              {t('actions.reactivate')}
            </Button>
          )}
        </CardActions>
      )}
    </>
  );

  if (isModal) {
    return (
      <Dialog
        open={true}
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
          {content}
        </DialogContent>
        <DialogActions>
          {isVendorView && (
            <Button onClick={handleEdit} color="primary">
              {t('actions.edit')}
            </Button>
          )}
          <Button onClick={onClose}>
            {t('actions.close')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return <Card>{content}</Card>;
};