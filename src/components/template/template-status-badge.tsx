import Chip from "@mui/material/Chip";
import { useTranslation } from "@/services/i18n/client";

export enum TemplateStatusEnum {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

interface TemplateStatusBadgeProps {
  status: TemplateStatusEnum;
}

export const TemplateStatusBadge: React.FC<TemplateStatusBadgeProps> = ({ status }) => {
  const { t } = useTranslation("templates");
  
  const getStatusColor = (status: TemplateStatusEnum): "success" | "warning" | "error" | "default" => {
    switch (status) {
      case TemplateStatusEnum.PUBLISHED:
        return 'success';
      case TemplateStatusEnum.DRAFT:
        return 'warning';
      case TemplateStatusEnum.ARCHIVED:
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