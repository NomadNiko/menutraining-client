import { useState } from 'react';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useTranslation } from "@/services/i18n/client";
import { Product, ProductStatusEnum } from "@/app/[language]/types/product";
import { Check, X, AlertTriangle, Trash2 } from 'lucide-react';
import { Image } from "@nextui-org/react";
import useConfirmDialog from '@/components/confirm-dialog/use-confirm-dialog';
import Divider from '@mui/material/Divider';

interface ProductApprovalCardProps {
  product: Product;
  onAction: (id: string, action: ProductStatusEnum, notes: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const ProductApprovalCard: React.FC<ProductApprovalCardProps> = ({
  product,
  onAction,
  onDelete
}) => {
  const { t } = useTranslation("approvals");
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { confirmDialog } = useConfirmDialog();

  const handleAction = async (action: ProductStatusEnum) => {
    if (isSubmitting) return;
    
    if (action === ProductStatusEnum.ARCHIVED && !notes.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    await onAction(product._id, action, notes);
    setIsSubmitting(false);
    setNotes('');
  };

  const handleDelete = async () => {
    const confirmed = await confirmDialog({
      title: t('deleteConfirm.title'),
      message: t('deleteConfirm.message'),
      successButtonText: t('deleteConfirm.confirm'),
      cancelButtonText: t('deleteConfirm.cancel'),
    });

    if (confirmed) {
      setIsSubmitting(true);
      await onDelete(product._id);
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 3,
          mb: 2
        }}>
          <Box sx={{ 
            width: { xs: '100%', sm: 120 },
            height: { xs: 120, sm: 120 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Image
              src={product.productImageURL || '/api/placeholder/120/120'}
              alt={product.productName}
              style={{
                maxWidth: '100px',
                maxHeight: '100px',
                objectFit: 'contain'
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" gutterBottom>
              {product.productName}
            </Typography>
            
            <Typography color="text.secondary" paragraph>
              {product.productDescription}
            </Typography>

            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2
            }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  {t("details")}
                </Typography>
                <Typography>${product.productPrice}</Typography>
                <Typography>{product.productType}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  {t("timing")}
                </Typography>
                {product.productDuration && (
                  <Typography>{product.productDuration} {t("hours")}</Typography>
                )}
                {product.productDate && (
                  <Typography>{new Date(product.productDate).toLocaleDateString()}</Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          placeholder={t("notesPlaceholder")}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          flexWrap: 'wrap'
        }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<Check size={16} />}
            onClick={() => handleAction(ProductStatusEnum.PUBLISHED)}
            disabled={isSubmitting}
          >
            {t("actions.approve")}
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<X size={16} />}
            onClick={() => handleAction(ProductStatusEnum.ARCHIVED)}
            disabled={isSubmitting}
          >
            {t("actions.reject")}
          </Button>
          <Button
            variant="contained"
            color="warning" 
            startIcon={<AlertTriangle size={16} />}
            onClick={() => handleAction(ProductStatusEnum.DRAFT)}
            disabled={isSubmitting}
          >
            {t("actions.backToDraft")}
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Trash2 size={16} />}
            onClick={handleDelete}
            disabled={isSubmitting}
            sx={{ ml: 'auto' }}
          >
            {t("actions.delete")}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductApprovalCard;