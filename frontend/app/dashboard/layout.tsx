"use client";
import { styled, Container, Box, PaletteMode } from "@mui/material";
import React, { useMemo, useState } from "react";
import Sidebar from "./layout/sidebar/Sidebar";
import Footer from "./layout/footer/page";
import { basedarkTheme, baselightTheme } from "../utils/theme/DefaultColors";

const MainWrapper = styled("div")(() => ({
  // display: "flex",
  // minHeight: "100vh",
  // width: "100%",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  paddingBottom: "60px",
  flexDirection: "column",
  zIndex: 1,
  backgroundColor: "transparent",
}));

// interface Props {
//   children: React.ReactNode;
// }



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // State to manage light or dark mode
  const [mode, setMode] = useState<PaletteMode>("light");

  // Create theme based on mode
  const theme = useMemo(() => {
    return mode === "light" ? baselightTheme : basedarkTheme;
  }, [mode]);


  return (
    <MainWrapper className="mainwrapper">

      {/* ------------------------------------------- */}
      {/* page Wrapper */}
      {/* ------------------------------------------- */}
      <PageWrapper className="page-wrapper"
          sx={{
              [theme.breakpoints.up("xl")]: {
                ml: `0px`,
              },
          }}
      >

        {/* ------------------------------------------- */}
        {/* Sidebar */}
        {/* ------------------------------------------- */}
        {/* <Sidebar
          isSidebarOpen={isSidebarOpen}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onSidebarClose={() => setMobileSidebarOpen(false)}
        /> */}

        {/* ------------------------------------------- */}
        {/* PageContent */}
        {/* ------------------------------------------- */}
        <Container
          sx={{
            paddingTop: "16px",
            maxWidth: "1600px",
          }}
        >
          {/* ------------------------------------------- */}
          {/* Page Route */}
          {/* ------------------------------------------- */}
          <Box mt={2} sx={{ minHeight: "calc(100vh - 170px)" }}>{children}</Box>
          {/* ------------------------------------------- */}
          {/* End Page */}
          {/* ------------------------------------------- */}

          {/* ------------------------------------------- */}
          {/* Footer */}
          {/* ------------------------------------------- */}
          {/* <Footer /> */}
        </Container>
      </PageWrapper>
    </MainWrapper>
  );
}
