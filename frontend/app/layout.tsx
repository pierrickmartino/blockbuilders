"use client";
import { PaletteMode, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { basedarkTheme, baselightTheme } from "./utils/theme/DefaultColors";
import { useMemo, useState } from "react";
import Header from "./dashboard/layout/header/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [mode, setMode] = useState<PaletteMode>("light");
  const theme = useMemo(() => {
    return mode === "light" ? baselightTheme : basedarkTheme;
  }, [mode]);

  // Handle theme change
  const handleThemeChange = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  // Handle theme change
  const handleMobileSidebar = () => {
    console.log("");
  };

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />

          {/* ------------------------------------------- */}
          {/* Header */}
          {/* ------------------------------------------- */}
          <Header mode={mode} onThemeChange={handleThemeChange} toggleMobileSidebar={handleMobileSidebar}/>
                   
          {/* Render the rest of the page content */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
