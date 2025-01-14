"use client";
import {
  Box,
  Snackbar,
  SnackbarCloseReason,
  Typography,
  Alert,
  AlertTitle,
  AlertColor,
  Drawer,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import WalletTable from "./components/dashboard/WalletTable";
import { useEffect, useState, useCallback, Fragment } from "react";
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
import LastTransactions from "./components/dashboard/LastTransactions";
import TradingCalendar from "./components/dashboard/TradingCalendar";
import React from "react";
import CreateWalletForm from "@/app/ui/wallets/CreateWalletForm";
import StatCard, { StatCardProps } from "./components/dashboard/StatCard";
import HighlightedCard from "./components/dashboard/HighlightedCard";
import BasicCard from "./components/shared/BasicCard";
import TopPositions from "./components/dashboard/TopPositions";
import TopBlockchains from "./components/dashboard/TopBlockchains";
import { ReadMoreOutlined } from "@mui/icons-material";

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

  const toggleDrawer = (open: boolean) => {
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

  // Memoize fetchWalletData using useCallback
  const fetchWalletData = useCallback(async () => {
    await fetchWallets(setWallets, setTotalCount, page, rowsPerPage);
  }, [page, rowsPerPage]); // Dependencies include page and rowsPerPage

  // Use useEffect to call fetchWalletData
  useEffect(() => {
    fetchWalletData();
  }, [page, rowsPerPage, fetchWalletData]); // Include fetchWalletData as a dependency

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
    await fetchLastTransactions(6, setLastTransactions);
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

  // const handleWalletCreated = () => {
  //   fetchWalletData(); // Re-fetch wallet data after a new wallet is created
  //   toggleDrawer(false);
  // };

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
    fetchWalletData();
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage); // Update rows per page state
    setPage(0); // Reset page to 0 whenever rows per page changes
    fetchWalletData();
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
    <Box sx={{ width: 350, height: "100%" }} role="presentation">
      <CreateWalletForm />
    </Box>
  );

  const data: StatCardProps[] = [
    {
      title: "Users",
      value: "14k",
      interval: "Last 30 days",
      trend: "up",
      data: [
        200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360,
        340, 380, 360, 400, 380, 420, 400, 640, 340, 460, 440, 480, 460, 600,
        880, 920,
      ],
    },
    {
      title: "Conversions",
      value: "325",
      interval: "Last 30 days",
      trend: "down",
      data: [
        1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820, 840,
        600, 820, 780, 800, 760, 380, 740, 660, 620, 840, 500, 520, 480, 400,
        360, 300, 220,
      ],
    },
    {
      title: "Event count",
      value: "200k",
      interval: "Last 30 days",
      trend: "neutral",
      data: [
        500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530, 620,
        510, 530, 520, 410, 530, 520, 610, 530, 520, 610, 530, 420, 510, 430,
        520, 510,
      ],
    },
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <HighlightedCard />
        </Grid>
      </Grid>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 9 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
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
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <BasicCard
                title="Best positions"
                subtitle="Top 5 positions by amount"
                action={
                  <Fragment>
                    <IconButton size="small" href="/dashboard/positions">
                      <ReadMoreOutlined />
                    </IconButton>
                  </Fragment>
                }
              >
                <TopPositions positions={top_positions}></TopPositions>
              </BasicCard>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <BasicCard
                title="Best blockchains"
                subtitle="Top 5 blockchains by amount"
                action={
                  <Fragment>
                    <IconButton size="small" href="/dashboard/positions">
                      <ReadMoreOutlined />
                    </IconButton>
                  </Fragment>
                }
              >
                <TopBlockchains blockchains={top_blockchains}></TopBlockchains>
              </BasicCard>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <TradingCalendar />
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, lg: 3 }}>
          <BasicCard
            title="Activity"
            subtitle="Latest transactions across the various blockchains"
            action={
              <Fragment>
                <IconButton size="small" href="/dashboard/transactions">
                  <ReadMoreOutlined />
                </IconButton>
              </Fragment>
            }
          >
            <LastTransactions
              transactions={last_transactions}
              count={count_transactions}
            />
          </BasicCard>
        </Grid>
      </Grid>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical:'top', horizontal:'right' }}>
        <Alert
          severity={snackbarSeverity}
          onClose={handleClose}
          sx={{ width: "100%" }}
        >
          <AlertTitle>{snackbarTitle}</AlertTitle>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
      >
        {DrawerList}
      </Drawer>
    </Box>
  );
};

export default Wallets;
