"use client";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
  Theme,
} from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import { useMemo, PropsWithChildren } from "react";
import CssBaseline from "@mui/material/CssBaseline";

declare module "@mui/material/styles" {
  interface Palette {
    customGradients: {
      primary: string;
      secondary: string;
      background: string;
      buttonMain: string;
      buttonSecondary: string;
      buttonWarning: string;
    };
  }
  interface TypographyVariants {
    logo: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    logo?: React.CSSProperties;
  }

  interface PaletteOptions {
    customGradients?: {
      primary?: string;
      secondary?: string;
      background?: string;
      buttonMain?: string;
      buttonSecondary?: string;
      buttonWarning?: string;
    };
  }
}

declare module "@mui/material/styles/createPalette" {
  interface TypeBackground {
    glass: string;
    glassHover: string;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    logo: true;
  }
}

function ThemeProvider(props: PropsWithChildren<{}>) {
  const theme = useMemo(
    () =>
      createTheme({
        spacing: 8,
        shape: {
          borderRadius: 8,
        },
        palette: {
          mode: "dark",
          primary: {
            main: "#3B82F6",
            light: "#60A5FA",
            dark: "#2563EB",
            contrastText: "#FFFFFF",
          },
          secondary: {
            main: "#8B5CF6",
            light: "#A78BFA",
            dark: "#7C3AED",
            contrastText: "#FFFFFF",
          },
          success: {
            main: "#10B981",
            light: "#34D399",
            dark: "#059669",
            contrastText: "#FFFFFF",
          },
          error: {
            main: "#EF4444",
            light: "#F87171",
            dark: "#DC2626",
            contrastText: "#FFFFFF",
          },
          warning: {
            main: "#F59E0B",
            light: "#FBBF24",
            dark: "#D97706",
            contrastText: "#FFFFFF",
          },
          info: {
            main: "#3B82F6",
            light: "#60A5FA",
            dark: "#2563EB",
            contrastText: "#FFFFFF",
          },
          grey: {
            50: "#F9FAFB",
            100: "#F3F4F6",
            200: "#E5E7EB",
            300: "#D1D5DB",
            400: "#9CA3AF",
            500: "#6B7280",
            600: "#4B5563",
            700: "#374151",
            800: "#1F2937",
            900: "#111827",
          },
          background: {
            default: "#0F172A",
            paper: "rgb(28, 40, 58, 0.92)",
            glass: "rgba(28, 40, 58, 0.8)",
            glassHover: "rgba(28, 40, 58, 0.9)",
          },
          text: {
            primary: "#F8FAFC",
            secondary: "#94A3B8",
          },
          divider: "rgba(255, 255, 255, 0.12)",
          customGradients: {
            primary: "linear-gradient(to right, #1E40AF,rgb(71, 26, 145))",
            secondary: "linear-gradient(to right,rgb(108, 73, 190),rgb(146, 48, 161))",
            background: "linear-gradient(to bottom,rgb(28, 38, 63),rgb(21, 29, 43))",
            buttonMain: "linear-gradient(to right, #1E40AF,rgb(71, 26, 145))", // Dark blue to dark purple
            buttonSecondary: "linear-gradient(to right, #059669, #065F46)", // Green to dark green
            buttonWarning:
              "linear-gradient(to right, #DC2626,rgb(126, 23, 23))", // Red to dark red
          },
        },
        typography: {
          fontFamily:
            '"Orbitron Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          logo: {
            fontFamily: '"Iceland", serif',
          },
          h1: {
            fontSize: "2.5rem",
            fontWeight: 600,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
          },
          h2: {
            fontSize: "2rem",
            fontWeight: 600,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
          },
          h3: {
            fontSize: "1.75rem",
            fontWeight: 600,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
          },
          h4: {
            fontSize: "1.5rem",
            fontWeight: 500,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
          },
          h5: {
            fontSize: "1.25rem",
            fontWeight: 500,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
          },
          h6: {
            fontSize: "1rem",
            fontWeight: 500,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
          },
          body1: {
            fontSize: "1rem",
            lineHeight: 1.5,
            letterSpacing: "-0.01em",
          },
          body2: {
            fontSize: "0.875rem",
            lineHeight: 1.5,
            letterSpacing: "-0.01em",
          },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: (theme: Theme) => ({
              body: {
                backgroundImage: theme.palette.customGradients.background,
                minHeight: "100vh",
                scrollbarWidth: "thin",
                scrollbarColor: `${theme.palette.grey[600]} ${theme.palette.grey[800]}`,
                "&::-webkit-scrollbar": {
                  width: theme.spacing(1),
                },
                "&::-webkit-scrollbar-track": {
                  background: theme.palette.grey[800],
                },
                "&::-webkit-scrollbar-thumb": {
                  background: theme.palette.grey[600],
                  borderRadius: theme.spacing(0.5),
                  "&:hover": {
                    background: theme.palette.grey[500],
                  },
                },
              },
            }),
          },
          MuiButton: {
            styleOverrides: {
              root: ({ theme }: { theme: Theme }) => ({
                textTransform: "none",
                fontWeight: 500,
                borderRadius: theme.spacing(1),
                padding: theme.spacing(1, 2),
                transition: theme.transitions.create(
                  ["transform", "box-shadow", "background-color"],
                  {
                    duration: theme.transitions.duration.shorter,
                  }
                ),
                "&:hover": {
                  transform: "translateY(-1px)",
                },
              }),
              contained: ({ theme }: { theme: Theme }) => ({
                background: theme.palette.customGradients.primary,
                boxShadow: `0 ${theme.spacing(0.25)} ${theme.spacing(
                  1.25
                )} ${alpha(theme.palette.primary.main, 0.1)}`,
                "&:hover": {
                  boxShadow: `0 ${theme.spacing(0.5)} ${theme.spacing(
                    2
                  )} ${alpha(theme.palette.primary.main, 0.2)}`,
                },
              }),
            },
          },
          MuiCard: {
            styleOverrides: {
              root: ({ theme }: { theme: Theme }) => ({
                backgroundImage:
                  "linear-gradient(to bottom right, rgba(30, 41, 59, 0.5), rgba(30, 41, 59, 0.2))",
                backdropFilter: "blur(10px)",
                border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                transition: theme.transitions.create(
                  ["transform", "box-shadow", "border-color"],
                  {
                    duration: theme.transitions.duration.shorter,
                  }
                ),
                "&:hover": {
                  transform: "translateY(-2px)",
                  borderColor: alpha(theme.palette.common.white, 0.2),
                  boxShadow: `0 ${theme.spacing(2.5)} ${theme.spacing(
                    5
                  )} -${theme.spacing(1.25)} rgba(0, 0, 0, 0.2)`,
                },
              }),
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: ({ theme }: { theme: Theme }) => ({
                "& .MuiOutlinedInput-root": {
                  borderRadius: theme.spacing(1),
                  height: theme.spacing(5.5),
                  backgroundColor: alpha(theme.palette.background.paper, 0.4),
                  transition: theme.transitions.create(
                    ["background-color", "box-shadow"],
                    {
                      duration: theme.transitions.duration.shorter,
                    }
                  ),
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.background.paper, 0.6),
                  },
                  "&.Mui-focused": {
                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                    boxShadow: `0 0 0 ${theme.spacing(0.25)} ${alpha(
                      theme.palette.primary.main,
                      0.25
                    )}`,
                  },
                  "&.MuiInputBase-multiline": {
                    height: "auto",
                    minHeight: theme.spacing(5.5),
                    padding: theme.spacing(1, 1.75),
                  },
                },
                "& .MuiInputLabel-outlined": {
                  transform: `translate(${theme.spacing(1.75)}, ${theme.spacing(
                    1.625
                  )}) scale(1)`,
                  "&.MuiInputLabel-shrink": {
                    transform: `translate(${theme.spacing(
                      1.75
                    )}, ${theme.spacing(-0.75)}) scale(0.75)`,
                  },
                },
              }),
            },
          },
          MuiTableHead: {
            styleOverrides: {
              root: ({ theme }: { theme: Theme }) => ({
                "& .MuiTableCell-head": {
                  backgroundColor: alpha(theme.palette.background.paper, 0.6),
                  color: theme.palette.text.primary,
                  fontWeight: 600,
                  padding: theme.spacing(2),
                  borderBottom: `1px solid ${alpha(
                    theme.palette.divider,
                    0.1
                  )}`,
                },
              }),
            },
          },
          MuiTableBody: {
            styleOverrides: {
              root: ({ theme }: { theme: Theme }) => ({
                "& .MuiTableRow-root": {
                  transition: theme.transitions.create("background-color", {
                    duration: theme.transitions.duration.shorter,
                  }),
                  "& .MuiTableCell-body": {
                    padding: theme.spacing(2),
                    color: theme.palette.text.secondary,
                    borderBottom: `1px solid ${alpha(
                      theme.palette.divider,
                      0.1
                    )}`,
                  },
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.action.hover, 0.1),
                  },
                },
              }),
            },
          },
          MuiChip: {
            styleOverrides: {
              root: ({ theme }: { theme: Theme }) => ({
                borderRadius: theme.spacing(0.75),
                fontWeight: 500,
                "&.MuiChip-filled": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.3),
                  },
                },
              }),
            },
          },
          MuiTooltip: {
            styleOverrides: {
              tooltip: ({ theme }: { theme: Theme }) => ({
                backgroundColor: alpha(theme.palette.grey[900], 0.95),
                backdropFilter: "blur(4px)",
                padding: theme.spacing(1, 1.5),
                fontSize: "0.875rem",
                borderRadius: theme.spacing(0.75),
                boxShadow: theme.shadows[6],
              }),
            },
          },
          MuiDialog: {
            styleOverrides: {
              paper: ({ theme }: { theme: Theme }) => ({
                backgroundImage:
                  "linear-gradient(to bottom right, rgba(30, 41, 59, 0.95), rgba(30, 41, 59, 0.85))",
                backdropFilter: "blur(10px)",
                border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                borderRadius: theme.spacing(1.5),
                padding: theme.spacing(2),
                boxShadow: theme.shadows[24],
              }),
            },
          },
          MuiToggleButton: {
            styleOverrides: {
              root: ({ theme }: { theme: Theme }) => ({
                color: theme.palette.text.primary,
                borderColor: alpha(theme.palette.common.white, 0.12),
                backgroundColor: theme.palette.background.glass,
                backdropFilter: "blur(10px)",
                "&.Mui-selected": {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                  },
                },
                "&:hover": {
                  backgroundColor: theme.palette.background.glassHover,
                },
              }),
            },
          },
        },
      }),
    []
  );
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {props.children}
    </MuiThemeProvider>
  );
}

export default ThemeProvider;
