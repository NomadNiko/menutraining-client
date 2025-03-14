import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { formatDistance } from 'date-fns';
import { useTranslation } from "@/services/i18n/client";
import { Clock, DollarSign } from 'lucide-react';
import { Product, ProductStatusEnum } from '@/app/[language]/types/product';
import { ProductStatusBadge } from './product-status-badge';
import { useEffect, useState } from 'react';
import ProductFullView from "./product-full-view";
import ProductEditCard from "../cards/edit-cards/ProductEditCard";

interface ProductCardProps {
  product: Product;
  onStatusChange?: (id: string, status: ProductStatusEnum) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onUpdate?: () => Promise<void>;
}

export const ProductCard = ({ 
  product, 
  onStatusChange,
  onDelete,
  onUpdate 
}: ProductCardProps) => {
  const { t } = useTranslation("products");
  const [showFullView, setShowFullView] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsEditing(true);
    setTimeout(() => setIsEditing(false), 100);
  }, []);


  if (isEditing) {
    return (
      <ProductEditCard
        product={product}
        onSave={async () => {
          setIsEditing(false);
          if (onUpdate) {
            await onUpdate();
          }
        }}
        onCancel={() => setIsEditing(false)}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
      />
    );
  }

  if (showFullView) {
    return (
      <ProductFullView
        product={product}
        onEdit={() => setIsEditing(true)}
        onClose={() => setShowFullView(false)}
      />
    );
  }

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        position: 'relative',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          transition: 'transform 0.2s ease-in-out'
        }
      }}
      onClick={() => setShowFullView(true)}
    >
      <ProductStatusBadge status={product.productStatus} />
      
      {product.productImageURL && (
        <CardMedia
          component="img"
          height="140"
          image={product.productImageURL}
          alt={product.productName}
          sx={{ objectFit: 'cover' }}
        />
      )}
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {product.productName}
        </Typography>
        
        <Typography color="text.secondary" noWrap sx={{ mb: 2 }}>
          {product.productDescription}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <DollarSign size={16} />
            <Typography>
              {product.productPrice.toFixed(2)}
            </Typography>
          </Box>
          
          {product.productDuration && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Clock size={16} />
              <Typography>
                {product.productDuration} {t('hours')}
              </Typography>
            </Box>
          )}
        </Box>
        
        <Typography variant="caption" color="text.secondary">
          {t('updated')} {formatDistance(new Date(product.updatedAt), new Date(), { addSuffix: true })}
        </Typography>
      </CardContent>
    </Card>
  );
};