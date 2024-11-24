"use client";
import {
  Box,
  Snackbar,
  SnackbarCloseReason,
  Stack,
  Typography,
  Alert,
  AlertTitle,
  AlertColor,
  Drawer,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import PageContainer from "../components/container/PageContainer";
import SalesOverview from "../components/dashboard/TheSalesOverview";
import Blogcard from "../components/dashboard/TheBlogCard";
import ProfileCard from "../components/dashboard/TheProfileCard";
import MyContacts from "../components/dashboard/TheMyContacts";
import WalletTable from "../components/dashboard/WalletTable";
import { useEffect, useState, useCallback } from "react";
import {
  Wallet,
  Position,
  Blockchain,
  Transaction,
} from "@/app/lib/definition";
import {
  fetchWallets,
  fetchTopPositions,
  fetchTopBlockchains,
  fetchLastTransactions,
  fetchCountTransactions,
  fetchTaskStatus,
} from "@/app/lib/data";
import LastTransactions from "../components/dashboard/LastTransactions";
import TopRepartition from "../components/dashboard/TopRepartition";
import TradingCalendar from "../components/dashboard/TradingCalendar";
import React from "react";
import CreateWalletForm from "@/app/ui/wallets/CreateWalletForm";

const Wallets = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [top_positions, setTopPositions] = useState<Position[]>([]);
  const [top_blockchains, setTopBlockchains] = useState<Blockchain[]>([]);
  const [last_transactions, setLastTransactions] = useState<Transaction[]>([]);
  const [count_transactions, setCountTransactions] = useState(0);
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(""); 
  const [snackbarTitle, setSnackbarTitle] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>("info"); 
  const [page, setPage] = useState(0); // State for current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // State for rows per page
  const [totalCount, setTotalCount] = useState(0); // State for total number of items
  const [taskPolling, setTaskPolling] = useState<{
    [taskId: string]: NodeJS.Timeout;
  }>({}); // New state for task polling
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open : boolean) => {
    setDrawerOpen(open);
  };

  const handleAddWalletClick = () => {
    toggleDrawer(true);
  };

  // const handleClick = (message: string, title: string, severity: AlertColor) => {
  //   setSnackbarMessage(message);
  //   setSnackbarSeverity(severity);
  //   setSnackbarTitle(title);
  //   setOpen(true);
  // };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
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
          setSnackbarTitle('Great News !');
          setSnackbarSeverity('success');
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

  // Memoize fetchWalletData using useCallback
  const fetchWalletData = useCallback(async () => {
    await fetchWallets(setWallets, setTotalCount, page, rowsPerPage);
  }, [page, rowsPerPage]); // Dependencies include page and rowsPerPage

  // Use useEffect to call fetchWalletData
  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]); // Include fetchWalletData as a dependency

  // Fetch top positions function
  const fetchTopPositionData = async () => {
    await fetchTopPositions(5, setTopPositions);
  };

  // Fetch top blockchain function
  const fetchTopBlockchainData = async () => {
    await fetchTopBlockchains(5, setTopBlockchains);
  };

  // Fetch last transaction function
  const fetchLastTransactionData = async () => {
    await fetchLastTransactions(5, setLastTransactions);
  };

  // Fetch last transaction function
  const fetchCountTransactionData = async () => {
    await fetchCountTransactions(setCountTransactions);
  };

  useEffect(() => {
    fetchTopPositionData();
  }, []);

  useEffect(() => {
    fetchTopBlockchainData();
  }, []);

  useEffect(() => {
    fetchLastTransactionData();
  }, []);

  useEffect(() => {
    fetchCountTransactionData();
  }, []);

  const handleWalletCreated = () => {
    fetchWalletData(); // Re-fetch wallet data after a new wallet is created
    toggleDrawer(false);
  };

  const handleWalletDeleted = () => {
    fetchWalletData(); // Re-fetch wallet data after a new wallet is created
  };

  const handleWalletDownloaded = (taskId: string) => {
    // handleClick("Download in progress for " + taskId, "Info", "info");
    pollTaskStatus(taskId); // Start polling task status
  };

  const handleWalletRefreshed = (taskId: string) => {
    // handleClick("Refresh in progress for " + taskId, "Info", "info");
    pollTaskStatus(taskId); // Start polling task status
  };

  const handleWalletFullRefreshed = (taskId: string) => {
    // handleClick("Full refresh in progress for " + taskId, "Info", "info");
    pollTaskStatus(taskId); // Start polling task status
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage); // Update page state
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage); // Update rows per page state
    setPage(0); // Reset page to 0 whenever rows per page changes
  };

  // Handle cleanup on component unmount
  useEffect(() => {
    return () => {
      // Clear all intervals
      Object.values(taskPolling).forEach((intervalId) =>
        clearInterval(intervalId)
      );
    };
  }, [taskPolling]);

  const DrawerList = (
    <Box sx={{ width: 350, height: '100%' }} role="presentation">
      <CreateWalletForm />
    </Box>
  );

  return (
    <PageContainer title="Wallets" description="this is Wallets">
      <Box mt={0}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 12 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="textPrimary" variant="h4">
                Dashboard
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, lg: 8 }}>
            <TopRepartition
              blockchains={top_blockchains}
              positions={top_positions}
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <TradingCalendar />
          </Grid>
          <Grid size={{ xs: 12, lg: 12 }}>
            <WalletTable
              wallets={wallets}
              page={page}
              rowsPerPage={rowsPerPage}
              totalCount={totalCount}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onWalletDeleted={handleWalletDeleted}
              onWalletDownloaded={handleWalletDownloaded}
              onWalletRefreshed={handleWalletRefreshed}
              onWalletFullRefreshed={handleWalletFullRefreshed}
              onCreateWallet={handleAddWalletClick}
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 8 }}>
            <SalesOverview />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <Blogcard />
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <ProfileCard />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <MyContacts />
              </Grid>
            </Grid>
          </Grid>
          <Grid size={{ xs: 12, lg: 8 }}>
            <LastTransactions
              transactions={last_transactions}
              count={count_transactions}
            />
          </Grid>
        </Grid>
      </Box>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert severity={snackbarSeverity} onClose={handleClose} sx={{ width: "100%" }}>
          <AlertTitle>{snackbarTitle}</AlertTitle>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Drawer anchor="right" open={drawerOpen} onClose={() => toggleDrawer(false)}>
    {DrawerList}
  </Drawer>
    </PageContainer>
  );
};

export default Wallets;
