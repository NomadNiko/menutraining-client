"use client";
import { format } from 'date-fns';
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { ProductItem, ProductItemStatus } from '@/app/[language]/types/product-item';
import { useTranslation } from "@/services/i18n/client";

interface ProductItemCompactCardProps {
  item: ProductItem;
  onClick: (item: ProductItem) => void;
  isVendorView?: boolean;
}

export default function ProductItemCompactCard({ item, onClick, isVendorView = false }: ProductItemCompactCardProps) {
  const { t } = useTranslation("product-items");

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

  return (
    <Paper
      onClick={() => onClick(item)}
      elevation={1}
      sx={{
        p: 1.5,
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 2,
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
        <Typography variant="subtitle2" noWrap sx={{ flex: 1 }}>
          {item.templateName}
        </Typography>
        {isVendorView && (
          <Chip
            size="small"
            label={t(`status.${item.itemStatus.toLowerCase()}`)}
            color={getStatusColor(item.itemStatus)}
          />
        )}
      </Box>

      <Typography variant="body2" color="text.secondary">
        {format(new Date(`2000-01-01T${item.startTime}`), 'h:mm a')}
      </Typography>

      {isVendorView ? (
        <Typography variant="caption" color="text.secondary">
          {item.quantityAvailable} / {item.quantityAvailable + (item.quantitySold || 0)} {t('available')}
        </Typography>
      ) : (
        <Typography variant="caption" color="text.secondary">
          ${item.price.toFixed(2)}
        </Typography>
      )}
    </Paper>
  );
}