"use client";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import React from "react";
import { Blockchain } from "@/app/lib/definition";
import { Box, Typography } from "@mui/material";

// Define the props type that will be passed into WalletTable
interface Top5BlockchainsGraphProps {
  blockchains: Blockchain[];
}

const Top5BlockchainsGraph: React.FC<Top5BlockchainsGraphProps> = ({
  blockchains,
}) => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.primary.light;
  const secondary = theme.palette.secondary.main;
  const secondarylight = theme.palette.secondary.light;
  const warning = theme.palette.warning.main;

  const seriesdoughnutchart = blockchains
    .filter((blockchain) => blockchain.progress_percentage > 0) // Keep only items with progress_percentage > 0
    .map((blockchain) => Math.round(blockchain.progress_percentage));

  const labelsdoughnutchart = blockchains
    .filter((blockchain) => blockchain.progress_percentage > 0) // Keep only items with progress_percentage > 0
    .map((blockchain) => blockchain.name);

  // 1
  const optionsdoughnutchart: any = {
    chart: {
      id: "donut-chart",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: "#adb0bb",
    },
    dataLabels: {
      enabled: false,
    },
    labels: labelsdoughnutchart,
    plotOptions: {
      pie: {
        donut: {
          size: "60px",
        },
      },
    },
    legend: {
      show: true,
      position: "bottom",
      width: "50px",
    },
    colors: [primary, primarylight, secondary, secondarylight, warning],
    tooltip: {
      theme: "dark",
      fillSeriesColor: false,
    },
  };

  return blockchains.length > 0 ? (
    <Box px={3}>
      <Chart
        options={optionsdoughnutchart}
        series={seriesdoughnutchart}
        type="donut"
        height="300px"
        width={"100%"}
      />
    </Box>
  ) : (
    <Box px={3} py={2} mt={2}>
      <Typography key="2" sx={{ color: "text.primary" }}>
        Loading Positions...
      </Typography>
    </Box>
  );
};

export default Top5BlockchainsGraph;
