import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  Edit2,
  Clock,
  DollarSign,
  Calendar,
  Clock3,
} from "lucide-react";
import { Product } from "./types/product";
import { useTranslation } from "react-i18next";
import CardMedia from "@mui/material/CardMedia";
import { ProductStatusBadge } from "./product-status-badge";
import { format } from "date-fns";
import Divider from "@mui/material/Divider";
import ClickAwayListener from "@mui/material/ClickAwayListener";

interface ProductFullViewProps {
  product: Product;
  onEdit: () => void;
  onClose: () => void;
}

const ProductFullView = ({
  product,
  onEdit,
  onClose,
}: ProductFullViewProps) => {
  const { t } = useTranslation("products");

  return (
    <ClickAwayListener onClickAway={onClose}>
      <Card
        sx={{
          position: "relative",
          fontSize: "0.7rem",
        }}
      >
        <ProductStatusBadge status={product.productStatus} />

        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 3,
            }}
          >
            <Typography variant="h4">{product.productName}</Typography>
            <Button
              startIcon={<Edit2 size={20} />}
              onClick={onEdit}
              sx={{
                mb: 2,
              }}
            >
              {t("edit")}
            </Button>
          </Box>

          {product.productImageURL && (
            <Box sx={{ mb: 3 }}>
              <CardMedia
                component="img"
                height={300}
                image={product.productImageURL}
                alt={product.productName}
                sx={{ borderRadius: 1, objectFit: "cover" }}
              />
            </Box>
          )}

          <Typography variant="body1" color="text.secondary" paragraph>
            {product.productDescription}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <DollarSign size={20} />
              <Typography variant="h6">
                {product.productPrice.toFixed(2)}
              </Typography>
            </Box>

            {product.productDuration && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Clock size={20} />
                <Typography variant="h6">
                  {product.productDuration} {t("hours")}
                </Typography>
              </Box>
            )}

            {product.productDate && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Calendar size={20} />
                <Typography variant="h6">
                  {format(new Date(product.productDate), "PPP")}
                </Typography>
              </Box>
            )}
          </Box>

          {(product.productStartTime) && (
            <Box sx={{ mb: 3 }}>
              {product.productStartTime && (
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Clock3 size={20} />
                  <Typography variant="body1">
                    {t("startTime")}: {product.productStartTime}
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {product.productRequirements &&
            product.productRequirements.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom>
                  {t("requirements")}
                </Typography>
                <Box sx={{ mb: 3 }}>
                  {product.productRequirements.map((req, index) => (
                    <Typography key={index} variant="body1" sx={{ mb: 1 }}>
                      • {req}
                    </Typography>
                  ))}
                </Box>
              </>
            )}

          {product.productWaiver && (
            <>
              <Typography variant="h6" gutterBottom>
                {t("waiver")}
              </Typography>
              <Typography variant="body1" paragraph>
                {product.productWaiver}
              </Typography>
            </>
          )}

          {product.productAdditionalInfo && (
            <>
              <Typography variant="h6" gutterBottom>
                {t("additionalInfo")}
              </Typography>
              <Typography variant="body1" paragraph>
                {product.productAdditionalInfo}
              </Typography>
            </>
          )}

          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {t("created")}: {format(new Date(product.createdAt), "PPP")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("lastUpdated")}: {format(new Date(product.updatedAt), "PPP")}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </ClickAwayListener>
  );
};

export default ProductFullView;
