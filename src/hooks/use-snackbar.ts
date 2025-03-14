import { useCallback } from "react";
import { toast } from "react-toastify";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";

export function useSnackbar() {
  const theme = useTheme();
  
  const enqueueSnackbar = useCallback(
    (
      message: string,
      config?: { variant?: "success" | "error"; autoHideDuration?: number }
    ) => {
      toast(message, {
        type: config?.variant,
        autoClose: config?.autoHideDuration,
        style: {
          background: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: "blur(10px)",
          border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
          borderRadius: theme.shape.borderRadius,
          color: theme.palette.text.primary,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize
        },
        theme: "dark"
      });
    },
    [theme]
  );

  return { enqueueSnackbar };
}