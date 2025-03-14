import Chip from "@mui/material/Chip";
import { useTranslation } from "@/services/i18n/client";
import { ProductStatusEnum } from './types/product';

interface ProductStatusBadgeProps {
  status: ProductStatusEnum;
}

export const ProductStatusBadge: React.FC<ProductStatusBadgeProps> = ({ status }) => {
  const { t } = useTranslation("products");
  
  const getStatusColor = (status: ProductStatusEnum): "success" | "warning" | "error" | "default" => {
    switch (status) {
      case ProductStatusEnum.PUBLISHED:
        return 'success';
      case ProductStatusEnum.DRAFT:
        return 'warning';
      case ProductStatusEnum.ARCHIVED:
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Chip
      size="small"
      label={t(`status.${status.toLowerCase()}`)}
      color={getStatusColor(status)}
      sx={{ position: 'absolute', top: 8, right: 8 }}
    />
  );
};