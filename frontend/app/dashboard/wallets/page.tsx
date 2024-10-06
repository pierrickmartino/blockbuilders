"use client";
import { Grid, Box, Snackbar, Button, IconButton, SnackbarCloseReason } from "@mui/material";
import PageContainer from "../components/container/PageContainer";
// components
import SalesOverview from "../components/dashboard/TheSalesOverview";
import Blogcard from "../components/dashboard/TheBlogCard";
import ProfileCard from "../components/dashboard/TheProfileCard";
import MyContacts from "../components/dashboard/TheMyContacts";
import ActivityTimeline from "../components/dashboard/TheActivityTimeline";
import WalletTable from "../components/dashboard/WalletTable";
import Top5Positions from "../components/dashboard/TheTop5Positions";
import WalletWizard from "../components/dashboard/WalletWizard";
import { Fragment, useEffect, useState } from "react";
import { Wallet } from "@/app/lib/definition";
import { fetchWallets } from "@/app/lib/data";
import { Close } from "@mui/icons-material";

const Wallets = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(""); // New state for message
  const [page, setPage] = useState(0);  // State for current page
  const [rowsPerPage, setRowsPerPage] = useState(10);  // State for rows per page
  const [totalCount, setTotalCount] = useState(0);  // State for total number of items

  const handleClick = (message: string) => {
    setSnackbarMessage(message); // Set the snackbar message
    setOpen(true);
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  // Fetch wallets function
  const fetchWalletData = async () => {
    await fetchWallets(setWallets, setTotalCount, page, rowsPerPage);
  };

  // Fetch wallets using the fetchWallets function from your data.ts file
  useEffect(() => {
    fetchWalletData(); // Pass setWallets directly to fetchWallets
  }, [page, rowsPerPage]);

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

  const handlePageChange = (newPage: number) => {
    setPage(newPage);  // Update page state
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);  // Update rows per page state
    setPage(0);  // Reset page to 0 whenever rows per page changes
  };

  const action = (
    <Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
      </Button>
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
      <Box mt={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={4}>
            <Top5Positions />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Top5Positions />
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
            <ActivityTimeline />
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
