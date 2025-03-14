import React from 'react';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Save, X, Trash2 } from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import { SharedCardActionsProps, FormData} from './types';

export const SharedCardActions: React.FC<SharedCardActionsProps> = ({
  onSave,
  onCancel,
  onDelete,
  isSubmitting,
  methods,
  customActions,
  t,
  type,
  mode = 'edit'
}) => {
  const theme = useTheme();
  
  const handleSubmit = async (data: FormData) => {
    try {
      await onSave(data);
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  return (
    <Box sx={{ 
      display: "flex", 
      justifyContent: "space-between",
      mt: 3,
      gap: 2 
    }}>
      {mode === 'edit' && onDelete && (
        <Button
          variant="contained"
          sx={{
            background: theme.palette.customGradients.buttonWarning,
            '&:hover': {
              background: theme.palette.customGradients.buttonWarning,
              filter: 'brightness(0.9)',
            }
          }}
          startIcon={<Trash2 size={16} />}
          onClick={onDelete}
          disabled={isSubmitting}
        >
          {t('delete')}
        </Button>
      )}
      <Box sx={{ 
        display: "flex", 
        gap: 2, 
        ml: mode === 'edit' ? 'auto' : undefined 
      }}>
        {customActions}
        <Button
          variant="contained"
          sx={{
            background: theme.palette.customGradients.buttonMain,
            '&:hover': {
              background: theme.palette.customGradients.buttonMain,
              filter: 'brightness(0.9)',
            }
          }}
          startIcon={<X size={16} />}
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {t('cancel')}
        </Button>
        <Button
          variant="contained"
          sx={{
            background: theme.palette.customGradients.buttonSecondary,
            '&:hover': {
              background: theme.palette.customGradients.buttonSecondary,
              filter: 'brightness(0.9)',
            }
          }}
          startIcon={<Save size={16} />}
          onClick={methods.handleSubmit(handleSubmit)}
          disabled={isSubmitting}
        >
          {mode === 'edit' ? t('save') : t(`create${type.charAt(0).toUpperCase() + type.slice(1)}`)}
        </Button>
      </Box>
    </Box>
  );
};

export default SharedCardActions;