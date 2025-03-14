import { format } from 'date-fns';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { alpha, Theme } from '@mui/material/styles';
import { ProductItem } from '@/app/[language]/types/product-item';
import { useTranslation } from "@/services/i18n/client";
import { formatDuration } from '@/components/utils/duration-utils';
import { JSX } from 'react';

interface PublicDayColumnProps {
  date: Date;
  items: ProductItem[];
  onItemClick: (item: ProductItem) => void;
  isToday: boolean;
}

interface StyleProps {
  theme: Theme;
  isLowQuantity?: boolean;
  isSoldOut?: boolean;
}

const getItemStyles = ({ theme, isLowQuantity, isSoldOut }: StyleProps) => ({
  p: 1.5,
  mb: 1,
  cursor: 'pointer',
  transition: 'transform 0.2s, box-shadow 0.2s',
  position: 'relative',
  overflow: 'hidden',
  bgcolor: isSoldOut ? alpha(theme.palette.error.main, 0.1) : 'background.paper',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: 2,
    bgcolor: isSoldOut 
      ? alpha(theme.palette.error.main, 0.15)
      : 'action.hover',
  },
  borderLeft: 3,
  borderColor: isLowQuantity 
    ? 'warning.main'
    : isSoldOut 
      ? 'error.main' 
      : 'transparent'
});

export default function PublicDayColumn({
  date,
  items,
  onItemClick,
  isToday
}: PublicDayColumnProps): JSX.Element {
  const { t } = useTranslation("tests");

  return (
    <Box sx={{
      flex: 1,
      minWidth: 0,
      height: '100%',
      borderRight: 1,
      borderColor: 'divider',
      '&:last-child': {
        borderRight: 0,
      }
    }}>
      <Box sx={{
        p: 1,
        textAlign: 'center',
        bgcolor: (theme) =>
          isToday
            ? alpha(theme.palette.primary.main, 0.1)
            : 'transparent',
        borderBottom: 1,
        borderColor: 'divider',
      }}>
        <Typography variant="subtitle2">{format(date, 'EEE')}</Typography>
        <Typography
          variant="h6"
          color={isToday ? "primary" : "text.primary"}
        >
          {format(date, 'd')}
        </Typography>
      </Box>

      <Box sx={{
        height: 'calc(100% - 70px)',
        overflow: 'auto',
        p: 1,
      }}>
        {items.map((item) => {
          const isLowQuantity = item.quantityAvailable > 0 && item.quantityAvailable <= 3;
          const isSoldOut = item.quantityAvailable === 0;

          return (
            <Paper
              key={item._id}
              onClick={() => onItemClick(item)}
              sx={(theme) => getItemStyles({ theme, isLowQuantity, isSoldOut })}
              elevation={1}
            >
              {isSoldOut && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(2px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: 'error.main',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      textShadow: '0 0 4px rgba(0,0,0,0.3)'
                    }}
                  >
                    {t('soldOut')}
                  </Typography>
                </Box>
              )}

              <Typography
                variant="subtitle2"
                sx={{
                  wordBreak: 'break-word',
                  mb: 0.5
                }}
              >
                {item.templateName}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block' }}
              >
                {format(new Date(`2000-01-01T${item.startTime}`), 'h:mm a')}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block' }}
              >
                {formatDuration(item.duration)}
              </Typography>

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mt: 0.5 
              }}>
                <Typography
                  variant="caption"
                  color="primary"
                  sx={{ fontWeight: 'bold' }}
                >
                  ${item.price.toFixed(2)}
                </Typography>
                {isLowQuantity && (
                  <Typography
                    variant="caption"
                    color="warning.main"
                    sx={{ fontWeight: 'medium' }}
                  >
                    {t('only')} {item.quantityAvailable} {t('left')}
                  </Typography>
                )}
              </Box>
            </Paper>
          );
        })}

        {items.length === 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center', py: 2 }}
          >
            {t('noAvailableItems')}
          </Typography>
        )}
      </Box>
    </Box>
  );
}