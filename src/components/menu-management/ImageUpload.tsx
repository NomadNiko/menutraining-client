import React, {
  useCallback,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useFileUploadService } from "@/services/api/services/files";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import { useDropzone } from "react-dropzone";

type ImageUploadProps = {
  onImageUrlChange: (url: string) => void;
  label: string;
  testId?: string;
  error?: string;
  initialImageUrl?: string;
};

const ImageUploadContainer = styled("div")(({ theme }) => ({
  display: "flex",
  position: "relative",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  border: "1px dashed",
  borderColor: theme.palette.divider,
  borderRadius: theme.shape.borderRadius,
  cursor: "pointer",
  "&:hover": {
    borderColor: theme.palette.text.primary,
  },
}));

const ImagePreview = styled("img")(({ theme }) => ({
  maxWidth: "100%",
  maxHeight: theme.spacing(25),
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(0.5),
}));

const ImageUpload = forwardRef<{ resetImage: () => void }, ImageUploadProps>(
  ({ onImageUrlChange, label, testId, error, initialImageUrl }, ref) => {
    const theme = useTheme();
    const [imageUrl, setImageUrl] = useState<string | undefined>(
      initialImageUrl
    );
    const [isLoading, setIsLoading] = useState(false);
    const fileUploadService = useFileUploadService();

    // Expose the resetImage method to parent components
    useImperativeHandle(ref, () => ({
      resetImage: () => {
        setImageUrl(undefined);
      },
    }));

    const onDrop = useCallback(
      async (acceptedFiles: File[]) => {
        if (isLoading || acceptedFiles.length === 0) return;
        setIsLoading(true);
        try {
          const { status, data } = await fileUploadService(acceptedFiles[0]);
          if (status === HTTP_CODES_ENUM.CREATED) {
            const fullUrl = data.file.path;
            setImageUrl(fullUrl);
            onImageUrlChange(fullUrl);
          }
        } catch (error) {
          console.error("Image upload failed:", error);
        } finally {
          setIsLoading(false);
        }
      },
      [fileUploadService, isLoading, onImageUrlChange]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: {
        "image/*": [],
      },
      maxFiles: 1,
      disabled: isLoading,
    });

    return (
      <ImageUploadContainer {...getRootProps()} data-testid={testId}>
        <input {...getInputProps()} />
        {isDragActive && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                color: "white",
                fontWeight: "bold",
              }}
              variant="h6"
            >
              Drop the image here
            </Typography>
          </Box>
        )}
        {imageUrl && <ImagePreview src={imageUrl} alt="Preview" />}
        <Button variant="contained" disabled={isLoading}>
          {isLoading ? "Uploading..." : label}
        </Button>
        {error && (
          <Typography color="error" sx={{ mt: theme.spacing(1) }}>
            {error}
          </Typography>
        )}
      </ImageUploadContainer>
    );
  }
);

// Add display name for easier debugging
ImageUpload.displayName = "ImageUpload";

export default ImageUpload;
