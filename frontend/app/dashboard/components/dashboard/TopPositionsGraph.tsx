"use client";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import React from "react";
import { Position } from "@/app/lib/definition";
import { Box, Skeleton, Typography } from "@mui/material";

// Define the props type that will be passed into WalletTable
interface TopPositionsGraphProps {
  positions: Position[];
}

const TopPositionsGraph: React.FC<TopPositionsGraphProps> = ({
  positions,
}) => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.primary.light;
  const secondary = theme.palette.secondary.main;
  const secondarylight = theme.palette.secondary.light;
  const warning = theme.palette.warning.main;

  const seriesdoughnutchart = positions
    .filter((position) => position.progress_percentage > 0) // Keep only items with progress_percentage > 0
    .map((position) => Math.round(position.progress_percentage));

  const labelsdoughnutchart = positions
    .filter((position) => position.progress_percentage > 0) // Keep only items with progress_percentage > 0
    .map((position) => position.contract.symbol);

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

  return positions.length > 0 ? (
    <Box px={3}>
      <Chart
        options={optionsdoughnutchart}
        series={seriesdoughnutchart}
        type="donut"
        height="250px"
        width={"100%"}
      />
    </Box>
  ) : (
    <Box px={3} py={2} mt={2}>
      <Skeleton variant="circular" width={200} height={200} />
    </Box>
  );
};

export default TopPositionsGraph;
