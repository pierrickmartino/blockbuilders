"use client";
import {
  Grid,
  Box,
  Snackbar,
  Button,
  IconButton,
  SnackbarCloseReason,
  Stack,
  Typography,
} from "@mui/material";
import PageContainer from "../components/container/PageContainer";
// components
import SalesOverview from "../components/dashboard/TheSalesOverview";
import Blogcard from "../components/dashboard/TheBlogCard";
import ProfileCard from "../components/dashboard/TheProfileCard";
import MyContacts from "../components/dashboard/TheMyContacts";
import WalletTable from "../components/dashboard/WalletTable";
import Top5Positions from "../components/dashboard/Top5Positions";
import WalletWizard from "../components/dashboard/WalletWizard";
import { Fragment, useEffect, useState } from "react";
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
} from "@/app/lib/data";
import { Close } from "@mui/icons-material";
import Top5Blockchains from "../components/dashboard/Top5Blockchains";
import LastTransactions from "../components/dashboard/LastTransactions";

const Wallets = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [top5_positions, setTop5Positions] = useState<Position[]>([]);
  const [top5_blockchains, setTop5Blockchains] = useState<Blockchain[]>([]);
  const [last_transactions, setLastTransactions] = useState<Transaction[]>([]);
  const [count_transactions, setCountTransactions] = useState(0);
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(""); // New state for message
  const [page, setPage] = useState(0); // State for current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // State for rows per page
  const [totalCount, setTotalCount] = useState(0); // State for total number of items

  const handleClick = (message: string) => {
    setSnackbarMessage(message); // Set the snackbar message
    setOpen(true);
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  // Fetch wallets function
  const fetchWalletData = async () => {
    await fetchWallets(setWallets, setTotalCount, page, rowsPerPage);
  };

  // Fetch top5 positions function
  const fetchTop5PositionData = async () => {
    await fetchTopPositions(5, setTop5Positions);
  };

  // Fetch top5 blockchain function
  const fetchTop5BlockchainData = async () => {
    await fetchTopBlockchains(5, setTop5Blockchains);
  };

  // Fetch last transaction function
  const fetchLastTransactionData = async () => {
    await fetchLastTransactions(5, setLastTransactions);
  };

  // Fetch last transaction function
  const fetchCountTransactionData = async () => {
    await fetchCountTransactions(setCountTransactions);
  };

  // Fetch wallets using the fetchWallets function from your data.ts file
  useEffect(() => {
    fetchWalletData(); // Pass setWallets directly to fetchWallets
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchTop5PositionData();
  }, []);

  useEffect(() => {
    fetchTop5BlockchainData();
  }, []);

  useEffect(() => {
    fetchLastTransactionData();
  }, []);

  useEffect(() => {
    fetchCountTransactionData();
  }, []);

  const handleWalletCreated = () => {
    fetchWalletData(); // Re-fetch wallet data after a new wallet is created
  };

  const handleWalletDeleted = () => {
    fetchWalletData(); // Re-fetch wallet data after a new wallet is created
  };

  const handleWalletDownloaded = () => {
    handleClick("Download in progress"); // Show download message
  };

  const handleWalletRefreshed = () => {
    handleClick("Refresh in progress"); // Show refresh message
  };

  const handleWalletFullRefreshed = () => {
    handleClick("Full refresh in progress"); // Show refresh message
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage); // Update page state
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage); // Update rows per page state
    setPage(0); // Reset page to 0 whenever rows per page changes
  };

  const action = (
    <Fragment>
      <Button color="secondary" size="small" onClick={handleClose}></Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <Close fontSize="small" />
      </IconButton>
    </Fragment>
  );

  return (
    <PageContainer title="Wallets" description="this is Wallets">
      <Box mt={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="textSecondary" variant="h4">
                Dashboard
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Top5Positions positions={top5_positions} />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Top5Blockchains blockchains={top5_blockchains} />
          </Grid>
          <Grid item xs={12} lg={4}>
            <WalletWizard onWalletCreated={handleWalletCreated} />
          </Grid>
          <Grid item xs={12} lg={8}>
            <SalesOverview />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Blogcard />
          </Grid>
          <Grid item xs={12} lg={12}>
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
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ProfileCard />
              </Grid>
              <Grid item xs={12}>
                <MyContacts />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={8}>
            <LastTransactions transactions={last_transactions} count={count_transactions} />
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={snackbarMessage}
        action={action}
      />
    </PageContainer>
  );
};

export default Wallets;
