"use client";

import { CssBaseline } from "@mui/material";
import AppTheme from "./theme/AppTheme";
import { chartsCustomizations } from "./theme/customizations/charts";
import { dataGridCustomizations } from "./theme/customizations/dataGrid";
import { datePickersCustomizations } from "./theme/customizations/datePicker";
import { treeViewCustomizations } from "./theme/customizations/treeView";
import "@/styles/globals.css";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark:bg-gray-950 antialiased">
      <body>
        <AppTheme themeComponents={xThemeComponents}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          {/* Render the rest of the page content */}
          {children}
        </AppTheme>
      </body>
    </html>
  );
}
