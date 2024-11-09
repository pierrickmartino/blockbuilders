import { createTheme } from "@mui/material/styles";
// import { TimelineConnector } from '@mui/lab';
import { Inter, Poppins } from "next/font/google";
import theme from "../theme";

// export const poppins = Poppins({
//   weight: ["300", "400", "500", "600", "700"],
//   subsets: ["latin"],
//   display: "swap",
//   fallback: ["Helvetica", "Arial", "sans-serif"],
// });

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
      main: "#13deb9",
      light: "#E6FFFA",
      dark: "#02b3a9",
      contrastText: "#ffffff",
    },
    info: {
      main: "#7460ee",
      light: "#dedaf9",
      dark: "#1682d4",
      contrastText: "#ffffff",
    },
    error: {
      main: "#fa896b",
      light: "#FDEDE8",
      dark: "#f3704d",
      contrastText: "#ffffff",
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
      primary: "#2a3547",
      secondary: "#2a3547",
    },
    action: {
      disabledBackground: "rgba(73,82,88,0.12)",
      hoverOpacity: 0.02,
      hover: "#f6f9fc",
    },
    divider: "#e5eaef",
    background: {
      default: "#eef5f9",
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
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
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
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:last-child td": {
            borderBottom: 0,
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
  
    MuiAlert: {
      styleOverrides: {
        filledSuccess: {
          color: "white",
        },
        filledInfo: {
          color: "white",
        },
        filledError: {
          color: "white",
        },
        filledWarning: {
          color: "white",
        },
        standardSuccess: {
          backgroundColor: theme.palette.success.light,
          color: theme.palette.success.main,
        },
        standardError: {
          backgroundColor: theme.palette.error.light,
          color: theme.palette.error.main,
        },
        standardWarning: {
          backgroundColor: theme.palette.warning.light,
          color: theme.palette.warning.main,
        },
        standardInfo: {
          backgroundColor: theme.palette.info.light,
          color: theme.palette.info.main,
        },
        outlinedSuccess: {
          borderColor: theme.palette.success.main,
          color: theme.palette.success.main,
        },
        outlinedWarning: {
          borderColor: theme.palette.warning.main,
          color: theme.palette.warning.main,
        },
        outlinedError: {
          borderColor: theme.palette.error.main,
          color: theme.palette.error.main,
        },
        outlinedInfo: {
          borderColor: theme.palette.info.main,
          color: theme.palette.info.main,
        }
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
      main: "#13deb9",
      light: "#E6FFFA",
      dark: "#02b3a9",
      contrastText: "#ffffff",
    },
    info: {
      main: "#7460ee",
      light: "#dedaf9",
      dark: "#1682d4",
      contrastText: "#ffffff",
    },
    error: {
      main: "#fa896b",
      light: "#FDEDE8",
      dark: "#f3704d",
      contrastText: "#ffffff",
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
      fontSize: '1rem',
      lineHeight: '1.2rem',
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
      lineHeight: '1.334rem',
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
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
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
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:last-child td": {
            borderBottom: 0,
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
  
    MuiAlert: {
      styleOverrides: {
        filledSuccess: {
          color: "white",
        },
        filledInfo: {
          color: "white",
        },
        filledError: {
          color: "white",
        },
        filledWarning: {
          color: "white",
        },
        standardSuccess: {
          backgroundColor: theme.palette.success.light,
          color: theme.palette.success.main,
        },
        standardError: {
          backgroundColor: theme.palette.error.light,
          color: theme.palette.error.main,
        },
        standardWarning: {
          backgroundColor: theme.palette.warning.light,
          color: theme.palette.warning.main,
        },
        standardInfo: {
          backgroundColor: theme.palette.info.light,
          color: theme.palette.info.main,
        },
        outlinedSuccess: {
          borderColor: theme.palette.success.main,
          color: theme.palette.success.main,
        },
        outlinedWarning: {
          borderColor: theme.palette.warning.main,
          color: theme.palette.warning.main,
        },
        outlinedError: {
          borderColor: theme.palette.error.main,
          color: theme.palette.error.main,
        },
        outlinedInfo: {
          borderColor: theme.palette.info.main,
          color: theme.palette.info.main,
        }
      },
    },

  },
  
});

export { basedarkTheme };
