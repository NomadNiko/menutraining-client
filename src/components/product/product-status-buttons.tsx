import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import { Send, FileEdit, Archive } from "lucide-react";
import { useTranslation } from "@/services/i18n/client";
import { ProductStatusEnum } from "@/app/[language]/types/product";

interface ProductStatusButtonsProps {
  currentStatus: ProductStatusEnum;
  onStatusChange: (status: ProductStatusEnum) => Promise<void>;
  isSubmitting: boolean;
}

export function ProductStatusButtons({ 
  currentStatus, 
  onStatusChange, 
  isSubmitting 
}: ProductStatusButtonsProps) {
  const { t } = useTranslation("products");

  return (
    <ButtonGroup>
      <Button
        onClick={() => onStatusChange(ProductStatusEnum.PUBLISHED)}
        startIcon={<Send size={16} />}
        disabled={isSubmitting || currentStatus === ProductStatusEnum.PUBLISHED}
        color="success"
        variant="contained"
      >
        {t('publish')}
      </Button>
      <Button
        onClick={() => onStatusChange(ProductStatusEnum.DRAFT)}
        startIcon={<FileEdit size={16} />}
        disabled={isSubmitting || currentStatus === ProductStatusEnum.DRAFT}
        color="warning"
        variant="contained"
      >
        {t('draft')}
      </Button>
      <Button
        onClick={() => onStatusChange(ProductStatusEnum.ARCHIVED)}
        startIcon={<Archive size={16} />}
        disabled={isSubmitting || currentStatus === ProductStatusEnum.ARCHIVED}
        color="info"
        variant="contained"
      >
        {t('archive')}
      </Button>
    </ButtonGroup>
  );
}
