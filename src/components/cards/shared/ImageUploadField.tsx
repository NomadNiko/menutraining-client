import React, { useState, useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useFileUploadService } from "@/services/api/services/files";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import { X, Upload } from 'lucide-react';
import { useDropzone } from "react-dropzone";
import { useTranslation } from "@/services/i18n/client";
import { FormData, ImageUploadFieldProps } from './types';

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  field,
  mode = 'edit'
}) => {
  const { t } = useTranslation("tests");
  const [isLoading, setIsLoading] = useState(false);
  const { setValue, control } = useFormContext<FormData>();
  const fetchFileUpload = useFileUploadService();

  const imageUrl = useWatch({
    control,
    name: field.name,
  }) as string | undefined;

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const file = acceptedFiles[0];
      const { status, data } = await fetchFileUpload(file);
      
      if (status === HTTP_CODES_ENUM.CREATED) {
        // Only set the path/URL instead of the full FileEntity
        setValue(field.name, data.file.path);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('File upload failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFileUpload, setValue, field.name, isLoading, t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    },
    maxFiles: 1,
    maxSize: 1024 * 1024 * 5, // 5MB
    disabled: isLoading || (mode === 'edit' && field.prefilled)
  });

  const handleRemove = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    setValue(field.name, undefined);
  };

  return (
    <Box 
      sx={{
        width: '100%',
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 1,
        p: 3,
        position: 'relative',
        '&:hover': {
          borderColor: 'primary.main',
        }
      }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      
      {isDragActive && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            borderRadius: 1,
          }}
        >
          <Typography variant="h6" color="white">
            {t('dropImageHere')}
          </Typography>
        </Box>
      )}

      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            borderRadius: 1,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {imageUrl ? (
        <Box sx={{ position: 'relative' }}>
          <Box
            component="img"
            src={imageUrl}
            alt="Uploaded image"
            sx={{
              width: '100%',
              height: 'auto',
              maxHeight: 300,
              objectFit: 'contain',
              borderRadius: 1,
            }}
          />
          <IconButton
            onClick={handleRemove}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'background.paper',
              '&:hover': {
                bgcolor: 'background.paper',
              }
            }}
          >
            <X size={20} />
          </IconButton>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Upload size={48} opacity={0.5} />
          <Button 
            variant="contained" 
            component="span"
            disabled={isLoading}
          >
            {isLoading ? t('uploading') : t('selectImage')}
          </Button>
          <Typography variant="body2" color="text.secondary" align="center">
            {t('dragAndDropImage')}
          </Typography>
          {field.required && (
            <Typography variant="caption" color="error">
              {t('fieldRequired')}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ImageUploadField;