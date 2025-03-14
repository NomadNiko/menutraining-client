import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  children: ReactNode;
  sx?: object;
}

export function FormSection({ title, children, sx = {} }: FormSectionProps) {
  return (
    <Box sx={{ mb: 3, ...sx }}>
      <Typography variant="subtitle2" gutterBottom>
        {title}
      </Typography>
      {children}
    </Box>
  );
}
