import { createTheme } from "@mui/material/styles";
import { Inter } from "next/font/google";
import theme from "../theme";

export const inter = Inter({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

const baselightTheme = createTheme({
  direction: "ltr",
  palette: {
    mode: "light",
    primary: {
      main: "rgba(31, 41, 55, 1)",
      light: "#e3f1fc",
      dark: "rgba(17, 24, 39, 1)",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "rgba(79, 70, 229, 1)",
      light: "rgba(58, 65, 81, 1)",
      dark: "rgba(17, 24, 39, 1)",
      contrastText: "rgba(255, 255, 255, 1)",
    },
    success: {
      main: "rgba(21, 128, 61, 1)",
      light: "rgba(240, 253, 244, 1)",
      dark: "rgba(22, 163, 74, 0.2)",
      contrastText: "rgba(255, 255, 255, 1)",
    },
    info: {
      main: "#7460ee",
      light: "#dedaf9",
      dark: "#1682d4",
      contrastText: "#ffffff",
    },
    error: {
      main: "rgba(185, 28, 28, 1)",
      light: "rgba(254, 242, 242, 1)",
      dark: "rgba(220, 38, 38, 0.1)",
      contrastText: "rgba(255, 255, 255, 1)",
    },
    warning: {
      main: "#ffb22b",
      light: "#FEF5E5",
      dark: "#ae8e59",
      contrastText: "#ffffff",
    },
    grey: {
      100: "#F2F6FA",
      200: "#EAEFF4",
      300: "#DFE5EF",
      400: "#7C8FAC",
      500: "#5A6A85",
      600: "#2a3547",
    },
    text: {
      primary: "rgba(17, 24, 39, 1)",
      secondary: "#6b7280",
    },
    action: {
      disabledBackground: "rgba(73,82,88,0.12)",
      hoverOpacity: 0.02,
      hover: "#f6f9fc",
    },
    divider: "#e5eaef",
    background: {
      default: "rgba(250,250,250,1)",
      paper: "#ffffff",
    },
  },

  typography: {
    fontFamily: inter.style.fontFamily,
    h1: {
      fontWeight: 600,
      fontSize: '2.25rem',
      lineHeight: '2.75rem',
      fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
    },
    h2: {
      fontWeight: 600,
      fontSize: '1.875rem',
      lineHeight: '2.25rem',
      fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: '1.75rem',
      fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.3125rem',
      lineHeight: '1.6rem',
      fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: '1.75rem',
      letterSpacing: '-.015em',
      fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
    },
    h6: {
      fontWeight: 600,
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
      letterSpacing: '-.015em',
      fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
    },
    button: {
      textTransform: 'capitalize',
      fontWeight: 400,
      fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
    },
    body1: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: '1.25rem',
      fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
    },
    body2: {
      fontSize: '0.75rem',
      letterSpacing: '0rem',
      fontWeight: 400,
      lineHeight: '1rem',
      fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
    },
    subtitle1: {
      fontSize: '0.875rem',
      fontWeight: 400,
      fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
      lineHeight: '1rem',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
      lineHeight: '1rem',
    },
  },
  components: {

  
    MuiCssBaseline: {
      styleOverrides: {
        ".MuiPaper-elevation9, .MuiPopover-root .MuiPaper-elevation": {
          boxShadow:
            "rgba(145 158 171 / 30%) 0px 0px 2px 0px, rgba(145 158 171 / 12%) 0px 12px 24px -4px !important",
        },
        a: {
          textDecoration: "none",
        },
        ".MuiTimelineConnector-root": {
          width: "1px !important",
          backgroundColor: "rgba(0, 0, 0, 0.12) !important"
        },
      },
    },
    MuiButtonGroup: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          borderRadius:'7px'
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: "16px 24px",
        },
        title: {
          fontSize: "1.125rem",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "7px",
          padding: "0",
          boxShadow: "0px 0px 0px 1px rgba(9, 9, 11, .07), 0px 2px 2px 0px rgba(9, 9, 11, .05)",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "30px",
        },
      },
    },  
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid #e5eaef`,
          paddingTop: "0px",
          paddingBottom: "0px",
        },
        head: {
          paddingTop: "6px",
          paddingBottom: "6px",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:last-child td": {
            borderBottom: 0,
            paddingBottom: "12px",
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.grey[200],
          borderRadius: "6px",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: theme.palette.divider,
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor:
              theme.palette.mode === "dark"
                ? theme.palette.grey[200]
                : theme.palette.grey[300],
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.grey[300],
          },
        },
        input: {
          padding: "12px 14px",
        },
        inputSizeSmall: {
          padding: "8px 14px",
        },
      },
    },

  },
  
});

export { baselightTheme };

const basedarkTheme = createTheme({
  direction: "ltr",
  palette: {
    mode: "dark",
    primary: {
      main: "#1e88e5",
      light: "#e3f1fc",
      dark: "#1e88e5",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#21c1d6",
      light: "#e1f7f8",
      dark: "#21c1d6",
      contrastText: "#ffffff",
    },
    success: {
      main: "rgba(21, 128, 61, 1)",
      light: "rgba(240, 253, 244, 1)",
      dark: "rgba(22, 163, 74, 0.2)",
      contrastText: "rgba(255, 255, 255, 1)",
    },
    info: {
      main: "#7460ee",
      light: "#dedaf9",
      dark: "#1682d4",
      contrastText: "#ffffff",
    },
    error: {
      main: "rgba(185, 28, 28, 1)",
      light: "rgba(254, 242, 242, 1)",
      dark: "rgba(220, 38, 38, 0.1)",
      contrastText: "rgba(255, 255, 255, 1)",
    },
    warning: {
      main: "#ffb22b",
      light: "#FEF5E5",
      dark: "#ae8e59",
      contrastText: "#ffffff",
    },
    grey: {
      100: "#F2F6FA",
      200: "#EAEFF4",
      300: "#DFE5EF",
      400: "#7C8FAC",
      500: "#5A6A85",
      600: "#2a3547",
    },
    text: {
      primary: "#eaeff4",
      secondary: "#7c8fac",
    },
    action: {
      disabledBackground: "rgba(73,82,88,0.12)",
      hoverOpacity: 0.02,
      hover: "#f6f9fc",
    },
    divider: "#e5eaef",
    background: {
      default: "#192838",
      paper: "#152332",
    },
  },

  typography: {
    fontFamily: inter.style.fontFamily,
    h1: {
      fontWeight: 600,
      fontSize: '2.25rem',
      lineHeight: '2.75rem',
      fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
    },
    h2: {
      fontWeight: 600,
      fontSize: '1.875rem',
      lineHeight: '2.25rem',
      fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: '1.75rem',
      fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.3125rem',
      lineHeight: '1.6rem',
      fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: '1.6rem',
      fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
    },
    h6: {
      fontWeight: 600,
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
      fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
    },
    button: {
      textTransform: 'capitalize',
      fontWeight: 400,
      fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
    },
    body1: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: '1.25rem',
      fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
    },
    body2: {
      fontSize: '0.75rem',
      letterSpacing: '0rem',
      fontWeight: 400,
      lineHeight: '1rem',
      fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
    },
    subtitle1: {
      fontSize: '0.875rem',
      fontWeight: 400,
      fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
      lineHeight: '1rem',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
      lineHeight: '1rem',
    },
  },
  components: {

  
    MuiCssBaseline: {
      styleOverrides: {
        ".MuiPaper-elevation9, .MuiPopover-root .MuiPaper-elevation": {
          boxShadow:
            "rgba(145 158 171 / 30%) 0px 0px 2px 0px, rgba(145 158 171 / 12%) 0px 12px 24px -4px !important",
        },
        a: {
          textDecoration: "none",
        },
        ".MuiTimelineConnector-root": {
          width: "1px !important",
          backgroundColor: "rgba(244, 249, 248, 0.12) !important"
        },
      },
    },
    MuiButtonGroup: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          borderRadius:'7px'
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: "16px 24px",
        },
        title: {
          fontSize: "1.125rem",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "7px",
          padding: "0",
          boxShadow: "0px 7px 30px 0px rgba(90, 114, 123, 0.11)",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "30px",
        },
      },
    },  
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid #e5eaef`,
          paddingTop: "0px",
          paddingBottom: "0px",
        },
        head: {
          paddingTop: "6px",
          paddingBottom: "6px",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:last-child td": {
            borderBottom: 0,
            paddingBottom: "12px",
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.grey[200],
          borderRadius: "6px",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: theme.palette.divider,
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor:
              theme.palette.mode === "dark"
                ? theme.palette.grey[200]
                : theme.palette.grey[300],
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.grey[300],
          },
        },
        input: {
          padding: "12px 14px",
        },
        inputSizeSmall: {
          padding: "8px 14px",
        },
      },
    },

  },
  
});

export { basedarkTheme };
