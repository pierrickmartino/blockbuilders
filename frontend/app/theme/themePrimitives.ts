import { createTheme, alpha, PaletteMode, Shadows } from '@mui/material/styles';
import { Inter } from "next/font/google";

export const inter = Inter({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    highlighted: true;
  }
}
declare module '@mui/material/styles/createPalette' {
  interface ColorRange {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  }

  interface PaletteColor extends ColorRange {}

  interface Palette {
    baseShadow: string;
  }
}

const defaultTheme = createTheme();

const customShadows: Shadows = [...defaultTheme.shadows];

export const brand = {
  50: 'hsl(210, 100%, 97%)',
  100: 'hsl(210, 100%, 94%)',
  200: 'hsl(210, 100%, 87%)',
  300: 'hsl(210, 100%, 77%)',
  400: 'hsl(210, 98%, 50%)',
  500: 'hsl(210, 98%, 30%)',
  600: 'hsl(210, 98%, 25%)',
  700: 'hsl(210, 100%, 18%)',
  800: 'hsl(210, 100%, 12%)',
  900: 'hsl(210, 100%, 6%)',
};

export const gray = {
  50: 'hsl(220, 35%, 97%)',
  100: 'hsl(220, 30%, 94%)',
  200: 'hsl(220, 20%, 87%)',
  300: 'hsl(220, 20%, 77%)',
  400: 'hsl(220, 20%, 50%)',
  500: 'hsl(220, 20%, 30%)',
  600: 'hsl(220, 20%, 25%)',
  700: 'hsl(220, 20%, 18%)',
  800: 'hsl(220, 30%, 12%)',
  900: 'hsl(220, 35%, 6%)',
};

export const green = {
  50: 'hsl(142, 80%, 98%)',
  100: 'hsl(142, 75%, 94%)',
  200: 'hsl(142, 75%, 87%)',
  300: 'hsl(142, 61%, 77%)',
  400: 'hsl(142, 44%, 50%)',
  500: 'hsl(142, 59%, 30%)',
  600: 'hsl(142, 70%, 25%)',
  700: 'hsl(142, 75%, 18%)',
  800: 'hsl(142, 84%, 12%)',
  900: 'hsl(142, 87%, 6%)',
};

export const orange = {
  50: 'hsl(45, 100%, 97%)',
  100: 'hsl(45, 92%, 94%)',
  200: 'hsl(45, 94%, 87%)',
  300: 'hsl(45, 90%, 77%)',
  400: 'hsl(45, 90%, 50%)',
  500: 'hsl(45, 90%, 30%)',
  600: 'hsl(45, 91%, 25%)',
  700: 'hsl(45, 94%, 18%)',
  800: 'hsl(45, 95%, 12%)',
  900: 'hsl(45, 93%, 6%)',
};

export const red = {
  50: 'hsl(0, 74%, 97%)',
  100: 'hsl(0, 74%, 94%)',
  200: 'hsl(0, 74%, 87%)',
  300: 'hsl(0, 74%, 77%)',
  400: 'hsl(0, 74%, 50%)',
  500: 'hsl(0, 75%, 30%)',
  600: 'hsl(0, 75%, 25%)',
  700: 'hsl(0, 76%, 18%)',
  800: 'hsl(0, 95%, 12%)',
  900: 'hsl(0, 93%, 6%)',
};

export const purple = {
  50: 'hsl(248, 81%, 97%)',
  100: 'hsl(248, 81%, 94%)',
  200: 'hsl(248, 81%, 87%)',
  300: 'hsl(248, 81%, 77%)',
  400: 'hsl(248, 81%, 65%)',
  500: 'hsl(248, 81%, 30%)',
  600: 'hsl(248, 81%, 25%)',
  700: 'hsl(248, 81%, 18%)',
  800: 'hsl(248, 81%, 12%)',
  900: 'hsl(247, 81%, 6%)',
};

export const getDesignTokens = (mode: PaletteMode) => {
  customShadows[1] =
    mode === 'dark'
      ? 'hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px'
      : 'hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px';

  return {
    palette: {
      mode,
      primary: {
        light: brand[300],
        main: brand[400],
        dark: brand[500],
        contrastText: brand[50],
        ...(mode === 'dark' && {
          contrastText: brand[50],
          light: brand[300],
          main: brand[400],
          dark: brand[700],
        }),
      },
      info: {
        light: brand[300],
        main: brand[400],
        dark: brand[500],
        contrastText: gray[50],
        ...(mode === 'dark' && {
          contrastText: brand[300],
          light: brand[500],
          main: brand[700],
          dark: brand[900],
        }),
      },
      warning: {
        light: orange[300],
        main: orange[400],
        dark: orange[500],
        contrastText: orange[50],
        ...(mode === 'dark' && {
          light: orange[400],
          main: orange[500],
          dark: orange[700],
        }),
      },
      error: {
        light: red[300],
        main: red[400],
        dark: red[500],
        contrastText: red[50],
        ...(mode === 'dark' && {
          light: red[400],
          main: red[500],
          dark: red[700],
        }),
      },
      success: {
        light: green[300],
        main: green[400],
        dark: green[500],
        contrastText: green[50],
        ...(mode === 'dark' && {
          light: green[400],
          main: green[500],
          dark: green[700],
        }),
      },
      grey: {
        ...gray,
      },
      divider: mode === 'dark' ? alpha(gray[700], 0.6) : alpha(gray[300], 0.4),
      background: {
        default: 'hsl(0, 0%, 99%)',
        paper: 'hsl(220, 35%, 97%)',
        ...(mode === 'dark' && { default: gray[900], paper: 'hsl(220, 30%, 7%)' }),
      },
      text: {
        primary: gray[800],
        secondary: gray[600],
        warning: orange[400],
        ...(mode === 'dark' && { primary: 'hsl(0, 0%, 100%)', secondary: gray[400] }),
      },
      action: {
        hover: alpha(gray[200], 0.2),
        selected: `${alpha(gray[200], 0.3)}`,
        ...(mode === 'dark' && {
          hover: alpha(gray[600], 0.2),
          selected: alpha(gray[600], 0.3),
        }),
      },
    },
    typography: {
      fontFamily: inter.style.fontFamily,
      h1: {
        fontSize: defaultTheme.typography.pxToRem(48),
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: -0.5,
        fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
      },
      h2: {
        fontSize: defaultTheme.typography.pxToRem(36),
        fontWeight: 600,
        lineHeight: 1.2,
        fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
      },
      h3: {
        fontSize: defaultTheme.typography.pxToRem(30),
        lineHeight: 1.2,
        fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
      },
      h4: {
        fontSize: defaultTheme.typography.pxToRem(24),
        fontWeight: 600,
        lineHeight: 1.5,
        fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
      },
      h5: {
        fontSize: defaultTheme.typography.pxToRem(20),
        fontWeight: 600,
        fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
      },
      h6: {
        fontSize: defaultTheme.typography.pxToRem(18),
        fontWeight: 600,
        fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
      },
      subtitle1: {
        fontSize: defaultTheme.typography.pxToRem(18),
        fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
      },
      subtitle2: {
        fontSize: defaultTheme.typography.pxToRem(14),
        fontWeight: 500,
        fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
      },
      body1: {
        fontSize: defaultTheme.typography.pxToRem(14),
        fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
      },
      body2: {
        fontSize: defaultTheme.typography.pxToRem(14),
        fontWeight: 400,
        fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
      },
      caption: {
        fontSize: defaultTheme.typography.pxToRem(12),
        fontWeight: 400,
        fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
      },
    },
    shape: {
      borderRadius: 8,
    },
    shadows: customShadows,
  };
};

export const colorSchemes = {
  light: {
    palette: {
      primary: {
        light: brand[300],
        main: brand[400],
        dark: brand[500],
        contrastText: brand[50],
      },
      secondary: {
        light: purple[300],
        main: purple[400],
        dark: purple[500],
        contrastText: purple[50],
      },
      info: {
        light: brand[300],
        main: brand[400],
        dark: brand[500],
        contrastText: gray[50],
      },
      warning: {
        light: orange[300],
        main: orange[400],
        dark: orange[500],
        contrastText: orange[50],
      },
      error: {
        light: red[300],
        main: red[400],
        dark: red[500],
        contrastText: red[50],
      },
      success: {
        light: green[300],
        main: green[400],
        dark: green[500],
        contrastText: green[50],
      },
      grey: {
        ...gray,
      },
      divider: alpha(gray[300], 0.4),
      background: {
        default: 'hsl(0, 0%, 99%)',
        paper: 'hsl(220, 35%, 97%)',
      },
      text: {
        primary: gray[800],
        secondary: gray[600],
        warning: orange[400],
      },
      action: {
        hover: alpha(gray[200], 0.2),
        selected: `${alpha(gray[200], 0.3)}`,
      },
      baseShadow:
        'hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px',
    },
  },
  dark: {
    palette: {
      primary: {
        light: brand[300],
        main: brand[400],
        dark: brand[700],
        contrastText: brand[50],
      },
      secondary: {
        light: purple[300],
        main: purple[400],
        dark: purple[600],
        contrastText: purple[50],
      },
      info: {
        light: brand[500],
        main: brand[700],
        dark: brand[900],
        contrastText: brand[50],
      },
      warning: {
        light: orange[400],
        main: orange[500],
        dark: orange[700],
        contrastText: orange[50],
      },
      error: {
        light: red[400],
        main: red[500],
        dark: red[700],
        contrastText: red[50],
      },
      success: {
        light: green[400],
        main: green[500],
        dark: green[700],
        contrastText: green[50],
      },
      grey: {
        ...gray,
      },
      divider: alpha(gray[700], 0.6),
      background: {
        default: gray[900],
        paper: 'hsl(220, 30%, 7%)',
      },
      text: {
        primary: 'hsl(0, 0%, 100%)',
        secondary: gray[400],
      },
      action: {
        hover: alpha(gray[600], 0.2),
        selected: alpha(gray[600], 0.3),
      },
      baseShadow:
        'hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px',
    },
  },
};

export const typography = {
  fontFamily: inter.style.fontFamily,
  h1: {
    fontSize: defaultTheme.typography.pxToRem(48),
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: -0.5,
    fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
  },
  h2: {
    fontSize: defaultTheme.typography.pxToRem(36),
    fontWeight: 600,
    lineHeight: 1.2,
    fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
  },
  h3: {
    fontSize: defaultTheme.typography.pxToRem(30),
    lineHeight: 1.2,
    fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
  },
  h4: {
    fontSize: defaultTheme.typography.pxToRem(24),
    fontWeight: 600,
    lineHeight: 1.5,
    fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
  },
  h5: {
    fontSize: defaultTheme.typography.pxToRem(20),
    fontWeight: 600,
    fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
  },
  h6: {
    fontSize: defaultTheme.typography.pxToRem(18),
    fontWeight: 600,
    fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
  },
  subtitle1: {
    fontSize: defaultTheme.typography.pxToRem(18),
    fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
  },
  subtitle2: {
    fontSize: defaultTheme.typography.pxToRem(14),
    fontWeight: 500,
    fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
  },
  body1: {
    fontSize: defaultTheme.typography.pxToRem(14),
    fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
  },
  body2: {
    fontSize: defaultTheme.typography.pxToRem(14),
    fontWeight: 400,
    fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
  },
  caption: {
    fontSize: defaultTheme.typography.pxToRem(12),
    fontWeight: 400,
    fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
  },
};

export const shape = {
  borderRadius: 8,
};

// @ts-expect-error: TODO
const defaultShadows: Shadows = [
  'none',
  'var(--template-palette-baseShadow)',
  ...defaultTheme.shadows.slice(2),
];
export const shadows = defaultShadows;