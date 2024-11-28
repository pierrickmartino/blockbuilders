"use client";

import { useMemo, useState } from "react";
import { PaletteMode } from "@mui/material/styles";
import { Box, Stack } from "@mui/material";
import { alpha } from "@mui/material/styles";

import SideMenu from "./layout/sidebar/SideMenu";
import AppNavbar from "./components/dashboard/AppNavBar";
import Header from "./layout/header/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: "flex" }}>
      <SideMenu />
      <AppNavbar />
      {/* Main content */}
      <Box
        component="main"
        sx={(theme) => ({
          flexGrow: 1,
          backgroundColor: alpha(theme.palette.background.default, 1),
          overflow: "auto",
        })}
      >
        <Stack
          spacing={2}
          sx={{
            alignItems: "center",
            mx: 3,
            pb: 5,
            mt: { xs: 8, md: 0 },
          }}
        >
          {/* ------------------------------------------- */}
          {/* Header */}
          {/* ------------------------------------------- */}
          <Header />
          {/* <Header
                  mode={mode}
                  onThemeChange={handleThemeChange}
                  toggleMobileSidebar={handleMobileSidebar}
                /> */}
          {/* <MainGrid /> */}

          {/* Render the rest of the page content */}
          {children}
        </Stack>
      </Box>
    </Box>
  );
}
