"use client";
import {
  Box,
  Stack,
  Card,
  Typography,
  Switch,
  FormGroup,
  FormControlLabel,
  CardContent,
  Chip,
  Snackbar,
  Alert,
  AlertTitle,
  AlertColor,
  SnackbarCloseReason,
  Drawer,
  Skeleton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect, useState, useCallback } from "react";
import { CapitalGainHisto, MarketData, Position } from "@/app/lib/definition";
import {
  fetchContractMarketPriceHisto,
  fetchPositions,
  fetchPositionsWithSearch,
  fetchTaskStatus,
  fetchWalletCapitalGainHisto,
} from "@/app/lib/data";
import PositionTable from "@/app/dashboard/components/dashboard/PositionTable";
import { useParams } from "next/navigation";
import { SearchForm } from "@/app/ui/shared/SearchForm";
import formatNumber from "@/app/utils/formatNumber";
import getLast30Days from "@/app/utils/getLast30Days";
import HighlightedCard from "@/app/dashboard/components/dashboard/HighlightedCard";
import { useTheme } from "@mui/material/styles";
import PriceSparkline from "@/app/dashboard/components/dashboard/PriceSparkline";
import DeltaChip from "@/app/dashboard/components/dashboard/DeltaChip";

const Positions = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [page, setPage] = useState(0); // State for current page
  const [rowsPerPage, setRowsPerPage] = useState(25); // State for rows per page
  const [totalCount, setTotalCount] = useState(0); // State for total number of items
  const [market_data, setMarketDataHisto] = useState<MarketData[]>([]);
  const [wallet_capital_gains, setWalletCapitalGainHisto] = useState<CapitalGainHisto[]>([]);

  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarTitle, setSnackbarTitle] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>("info");

  /* Drawer for position detail */
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };
  const handleShowPositionDrawer = () => {
    toggleDrawer(true);
  };

  const [taskPolling, setTaskPolling] = useState<{
    [taskId: string]: NodeJS.Timeout;
  }>({}); // New state for task polling

  const params = useParams();
  const wallet_id = params.wallet_id;

  //TODO : MOCK-UP
  // Fetch market price data
  const fetchContractMarketPriceHistoData = useCallback(async () => {
    await fetchContractMarketPriceHisto(30, "WBTC", "USD", setMarketDataHisto);
  }, [fetchContractMarketPriceHisto, setMarketDataHisto]);

  //TODO : MOCK-UP
  useEffect(() => {
    fetchContractMarketPriceHistoData();
  }, [fetchContractMarketPriceHistoData]);

  const fetchWalletCapitalGainHistoData = useCallback(async () => {
    if (wallet_id) {
      // console.log("fetchPositionCapitalGainHistoData");
      await fetchWalletCapitalGainHisto(30, String(wallet_id), setWalletCapitalGainHisto);
    } else {
      console.warn("No position data available");
    }
  }, [wallet_id, fetchWalletCapitalGainHisto, setWalletCapitalGainHisto]);

  useEffect(() => {
    fetchWalletCapitalGainHistoData();
  }, [fetchWalletCapitalGainHistoData]);

  const fetchPositionData = useCallback(async () => {
    if (wallet_id) {
      await fetchPositions(String(wallet_id), setPositions, setTotalCount, page, rowsPerPage);
    }
  }, [wallet_id, page, rowsPerPage]);

  useEffect(() => {
    fetchPositionData();
  }, [page, rowsPerPage, fetchPositionData]);

  const fetchPositionDataWithSearch = async (searchTerm: string) => {
    if (wallet_id) {
      await fetchPositionsWithSearch(String(wallet_id), String(searchTerm), setPositions, setTotalCount, page, rowsPerPage);
    }
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  // New function to poll task status
  const pollTaskStatus = (taskId: string) => {
    const intervalId = setInterval(async () => {
      try {
        const status = await fetchTaskStatus(taskId);
        console.log("Task result in pollTaskStatus:", status);
        if (status === "SUCCESS") {
          setSnackbarMessage(`Task ${taskId} finished successfully.`);
          setSnackbarTitle("Great News !");
          setSnackbarSeverity("success");
          setOpen(true);
          clearInterval(taskPolling[taskId]);
          setTaskPolling((prev) => {
            const { [taskId]: _, ...remainingPolling } = prev; // Remove the completed task
            return remainingPolling;
          });
        }
      } catch (error) {
        console.error("Error polling task status:", error);
        clearInterval(intervalId);
        setTaskPolling((prev) => {
          const { [taskId]: _, ...remainingPolling } = prev; // Remove the errored task
          return remainingPolling;
        });
      }
    }, 3000); // Poll every 3 seconds

    setTaskPolling((prev) => ({
      ...prev,
      [taskId]: intervalId,
    }));
  };

  const handlePageChange = (newPage: number) => {
    // console.log("Parent handlePageChange called with:", newPage);
    setPage(newPage); // Update page state
    fetchPositionData();
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    // console.log("Parent handleRowsPerPageChange called with:", newRowsPerPage);
    setRowsPerPage(newRowsPerPage); // Update rows per page state
    setPage(0); // Reset page to 0 whenever rows per page changes
    fetchPositionData();
  };

  const handleContractSetAsSuspicious = () => {
    fetchPositionData(); // Re-fetch wallet data after a new wallet is created
  };

  const handleContractSetAsStable = () => {
    fetchPositionData(); // Re-fetch wallet data after a new wallet is created
  };

  const handleSearch = (searchTerm: string) => {
    // Implement your search logic here, such as making API calls
    fetchPositionDataWithSearch(searchTerm);
  };

  const handleContractInfoDownloaded = (taskId: string) => {
    // handleClick("Refresh in progress for " + taskId, "Info", "info");
    pollTaskStatus(taskId); // Start polling task status
  };

  const DrawerList = (
    <Box sx={{ width: 350, height: "100%" }} role="presentation">
      {/* <CreateWalletForm /> */}
    </Box>
  );

  // Handle cleanup on component unmount
  useEffect(() => {
    return () => {
      // Clear all intervals
      Object.values(taskPolling).forEach((intervalId) => clearInterval(intervalId));
    };
  }, [taskPolling]);

  const last30Days = getLast30Days();

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Positions
      </Typography>
      <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
        {/* {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <HighlightedCard />
        </Grid>  */}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card variant="outlined" sx={{ height: "100%", flexGrow: 1 }}>
            <CardContent>
              <Stack direction="column" sx={{ justifyContent: "space-between", flexGrow: "1", gap: 1 }}>
                <Stack sx={{ justifyContent: "space-between" }}>
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {positions.length > 0 && positions[0]?.wallet ? (
                      <Typography variant="h4" component="p">
                        {formatNumber(positions[0].wallet.balance, "currency")}
                      </Typography>
                    ) : (
                      <Skeleton variant="text" width={100} sx={{ fontSize: "1.5rem" }} />
                    )}
                    <Chip size="small" color={"success"} label={"+25%"} />
                  </Stack>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Total amount
                  </Typography>
                </Stack>
                <Box sx={{ width: "100%", height: 100 }}>
                  {market_data.length > 0 && market_data[0]?.close ? (
                    <PriceSparkline data={market_data.map((m) => m.close).reverse()} days={last30Days} />
                  ) : (
                    <Skeleton variant="rounded" height={100} />
                  )}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card variant="outlined" sx={{ height: "100%", flexGrow: 1 }}>
            <CardContent>
              <Stack direction="column" sx={{ justifyContent: "space-between", flexGrow: "1", gap: 1 }}>
                <Stack sx={{ justifyContent: "space-between" }}>
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {positions.length > 0 && positions[0]?.wallet ? (
                      <Typography variant="h4" component="p">
                        {formatNumber(positions[0].wallet.capital_gain, "currency")}
                      </Typography>
                    ) : (
                      <Skeleton variant="text" width={100} sx={{ fontSize: "1.5rem" }} />
                    )}
                    {wallet_capital_gains.length > 1 ? (
                      <DeltaChip data={wallet_capital_gains.map((m) => m.running_capital_gain).reverse()} />
                    ) : (
                      <Skeleton variant="text" width={50} />
                    )}
                  </Stack>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Total capital gain
                  </Typography>
                </Stack>
                <Box sx={{ width: "100%", height: 100 }}>
                  {wallet_capital_gains.length > 0 && wallet_capital_gains[0]?.running_capital_gain ? (
                    <PriceSparkline data={wallet_capital_gains.map((m) => m.running_capital_gain).reverse()} days={last30Days} />
                  ) : (
                    <Skeleton variant="rounded" height={100} />
                  )}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card variant="outlined" sx={{ height: "100%", flexGrow: 1 }}>
            <CardContent>
              <Stack direction="column" sx={{ justifyContent: "space-between", flexGrow: "1", gap: 1 }}>
                <Stack sx={{ justifyContent: "space-between" }}>
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {positions.length > 0 && positions[0]?.wallet ? (
                      <Typography variant="h4" component="p">
                        {formatNumber(positions[0].wallet.unrealized_gain, "percentage")}
                      </Typography>
                    ) : (
                      <Skeleton variant="text" width={100} sx={{ fontSize: "1.5rem" }} />
                    )}
                    <Chip size="small" color={"default"} label={"+0%"} />
                  </Stack>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Total unrealized
                  </Typography>
                </Stack>
                <Box sx={{ width: "100%", height: 100 }}>
                  {market_data.length > 0 && market_data[0]?.close ? (
                    <PriceSparkline data={market_data.map((m) => m.close).reverse()} days={last30Days} />
                  ) : (
                    <Skeleton variant="rounded" height={100} />
                  )}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <HighlightedCard />
        </Grid>
        <Grid size={{ xs: 12, lg: 9 }}>
          {positions.length > 0 && positions[0]?.wallet ? (
            <PositionTable
              positions={positions}
              wallet={positions[0].wallet}
              page={page}
              rowsPerPage={rowsPerPage}
              totalCount={totalCount}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onContractSetAsStable={handleContractSetAsStable}
              onContractSetAsSuspicious={handleContractSetAsSuspicious}
              onContractInfoDownloaded={handleContractInfoDownloaded}
              onPositionClick={handleShowPositionDrawer}
            />
          ) : (
            <Typography>No data available</Typography> // Fallback if positions are not available
          )}
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Card variant="outlined" sx={{ height: "100%", flexGrow: 1 }}>
            <CardContent>
              <Stack direction="column" sx={{ justifyContent: "space-between", flexGrow: "1", gap: 1 }}>
                <Typography variant="h5">Filter</Typography>
                <SearchForm onSearch={handleSearch} />
                <FormGroup>
                  <FormControlLabel control={<Switch />} label="Only relevant positions" />
                </FormGroup>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert severity={snackbarSeverity} onClose={handleClose} sx={{ width: "100%" }}>
          <AlertTitle>{snackbarTitle}</AlertTitle>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Drawer anchor="right" open={drawerOpen} onClose={() => toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </Box>
  );
};

export default Positions;
