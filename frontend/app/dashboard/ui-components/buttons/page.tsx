"use client";
import { Box, Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";
import BasicCard from "../../components/shared/BasicCard";
import { formatNumber } from "@/lib/format";
import { Button } from "@/components/shared/Button";
import { Badge1, Badge2, Badge3, Badge4 } from "@/components/shared/Badge";
import { Fragment } from "react";

// const Item = styled(Paper)(({ theme }) => ({
//   ...theme.typography.body1,
//   textAlign: 'center',
//   color: theme.palette.text.secondary,
//   height: 60,
//   lineHeight: '60px',
// }));
// const darkTheme = createTheme({ palette: { mode: 'dark' } });
// const lightTheme = createTheme({ palette: { mode: 'light' } });

const Buttons = () => {
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <BasicCard title="Color Buttons">
            <Box sx={{ "& button": { mr: 1 } }}>
              <Button variant="primary" className="me-2 mb-2">
                Primary
              </Button>
              <Button variant="secondary" className="me-2 mb-2">
                Secondary
              </Button>
              <Button variant="light" className="me-2 mb-2">
                Light
              </Button>
              <Button variant="ghost" className="me-2 mb-2">
                Ghost
              </Button>
              <Button variant="destructive" className="me-2 mb-2">
                Destructive
              </Button>
            </Box>
          </BasicCard>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <BasicCard title="Outlined Buttons">
            <Box sx={{ "& button": { mr: 1 } }}>
              <Button className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 bg-white dark:bg-gray-950">
                Default
              </Button>
              <Button
                type="button"
                className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800 bg-white dark:bg-gray-950"
              >
                Dark
              </Button>
              <Button
                type="button"
                className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800 bg-white dark:bg-gray-950"
              >
                Green
              </Button>
              <Button
                type="button"
                className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900 bg-white dark:bg-gray-950"
              >
                Red
              </Button>
              <Button
                type="button"
                className="text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-center me-2 mb-2 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900 bg-white dark:bg-gray-950 "
              >
                Yellow
              </Button>
              <Button
                type="button"
                className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-center me-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900 bg-white dark:bg-gray-950"
              >
                Purple
              </Button>
            </Box>
          </BasicCard>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <BasicCard title="Text Buttons">
            <Box sx={{ "& button": { mr: 1 } }}>
              <Button isLoading>Primary</Button>
              <Button isLoading loadingText="Loading text">
                Primary
              </Button>
            </Box>
          </BasicCard>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <BasicCard title="Badges">
            <Fragment>
              <div className="flex flex-wrap justify-start gap-4 mb-4">
                <Badge1 label={formatNumber(9.5, "percentage")} color="success" />
                <Badge1 label={formatNumber(-12.56, "percentage")} color="error" />
                <Badge1 label={formatNumber(0.0, "percentage")} color="neutral" />
              </div>
              <div className="flex flex-wrap justify-start gap-4 mb-4">
                <Badge2 label={formatNumber(9.5, "percentage")} color="success" />
                <Badge2 label={formatNumber(-12.56, "percentage")} color="error" />
                <Badge2 label={formatNumber(0.0, "percentage")} color="neutral" />
              </div>
              <div className="flex flex-wrap justify-start gap-4 mb-4">
                <Badge3 label={formatNumber(9.5, "percentage")} color="success" />
                <Badge3 label={formatNumber(-12.56, "percentage")} color="error" />
                <Badge3 label={formatNumber(0.0, "percentage")} color="neutral" />
              </div>
              <div className="flex flex-wrap justify-start gap-4">
                <Badge4 label={formatNumber(9.5, "percentage")} color="success" />
                <Badge4 label={formatNumber(-12.56, "percentage")} color="error" />
                <Badge4 label={formatNumber(0.0, "percentage")} color="neutral" />
              </div>
            </Fragment>
          </BasicCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Buttons;
