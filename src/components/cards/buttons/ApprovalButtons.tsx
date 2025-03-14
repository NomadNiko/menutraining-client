import React from 'react';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Check, X, AlertTriangle, Archive } from "lucide-react";
import { useTranslation } from "@/services/i18n/client";
import { ProductStatusEnum } from "@/app/[language]/types/product";
import { VendorStatusEnum } from "@/app/[language]/types/vendor";
import { useTheme } from "@mui/material/styles";

export type ApprovalStatus = ProductStatusEnum | VendorStatusEnum;

interface ApprovalButtonsProps {
  type: 'vendor' | 'product' |  'template';
  currentStatus: ApprovalStatus;
  onStatusChange: (status: ApprovalStatus) => Promise<void>;
  isSubmitting: boolean;
}

export const ApprovalButtons: React.FC<ApprovalButtonsProps> = ({
  type,
  currentStatus,
  onStatusChange,
  isSubmitting
}) => {
  const { t } = useTranslation("approvals");
  const theme = useTheme();

  const getButtons = () => {
    if (type === 'product') {
      return [
        {
          status: ProductStatusEnum.PUBLISHED,
          label: t('approve'),
          icon: <Check size={16} />,
          color: 'success'
        },
        {
          status: ProductStatusEnum.DRAFT,
          label: t('backToDraft'),
          icon: <AlertTriangle size={16} />,
          color: 'warning'
        },
        {
          status: ProductStatusEnum.ARCHIVED,
          label: t('reject'),
          icon: <Archive size={16} />,
          color: 'error'
        }
      ];
    }
    
    return [
      {
        status: VendorStatusEnum.APPROVED,
        label: t('approve'),
        icon: <Check size={16} />,
        color: 'success'
      },
      {
        status: VendorStatusEnum.ACTION_NEEDED,
        label: t('needsAction'),
        icon: <AlertTriangle size={16} />,
        color: 'warning'
      },
      {
        status: VendorStatusEnum.REJECTED,
        label: t('reject'),
        icon: <X size={16} />,
        color: 'error'
      }
    ];
  };

  return (
    <Box sx={{ 
      display: 'flex',
      justifyContent: 'center',
      gap: 2,
      mb: 3,
      mt: 2,
      borderTop: 1,
      borderBottom: 1,
      borderColor: 'divider',
      py: 2
    }}>
      {getButtons().map(({ status, label, icon, color }) => (
        <Button
          key={status}
          variant="contained"
          color={color as 'success' | 'warning' | 'error'}
          startIcon={icon}
          onClick={() => onStatusChange(status)}
          disabled={isSubmitting || status === currentStatus}
          sx={{
            minWidth: 140,
            background: theme.palette.customGradients.buttonMain,
            '&:hover': {
              background: theme.palette.customGradients.buttonMain,
              filter: 'brightness(0.9)',
            }
          }}
        >
          {label}
        </Button>
      ))}
    </Box>
  );
};