"use client";
import { Box, Stack, Typography, Drawer } from "@mui/material";
// components
import Grid from "@mui/material/Grid2";
import { useEffect, useState, useCallback } from "react";
import { Transaction } from "@/app/lib/definition";
import { fetchTransactionsAll, fetchTransactionsAllWithSearch } from "@/app/lib/data";
import TransactionTable from "@/app/dashboard/components/dashboard/TransactionTable";

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(0); // State for current page
  const [rowsPerPage, setRowsPerPage] = useState(25); // State for rows per page
  const [totalCount, setTotalCount] = useState(0); // State for total number of items

  // Memoize fetchTransactionData using useCallback
  const fetchTransactionData = useCallback(async () => {
    await fetchTransactionsAll(setTransactions, setTotalCount, page, rowsPerPage);
  }, [page, rowsPerPage]); // Dependencies include page and rowsPerPage

  // Use useEffect to call fetchTransactionData
  useEffect(() => {
    fetchTransactionData();
  }, [fetchTransactionData]); // Include fetchTransactionData as a dependency

  const fetchTransactionDataWithSearch = async (searchTerm: string) => {
    await fetchTransactionsAllWithSearch(String(searchTerm), setTransactions, setTotalCount, page, rowsPerPage);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage); // Update page state
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage); // Update rows per page state
    setPage(0); // Reset page to 0 whenever rows per page changes
  };

  const handleSearch = (searchTerm: string) => {
    // Implement your search logic here, such as making API calls
    fetchTransactionDataWithSearch(searchTerm);
  };

  /* Drawer for transaction detail */
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };
  const handleShowTransactionDrawer = () => {
    toggleDrawer(true);
  };

  const DrawerList = (
    <Box sx={{ width: 350, height: "100%" }} role="presentation">
      {/* <CreateWalletForm /> */}
    </Box>
  );

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
          Transactions
        </Typography>
      </Stack>
      <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
        <Grid size={{ xs: 12, lg: 12 }}>
          <TransactionTable
            transactions={transactions}
            page={page}
            rowsPerPage={rowsPerPage}
            totalCount={totalCount}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onTransactionClick={handleShowTransactionDrawer}
          />
        </Grid>
      </Grid>
      <Drawer anchor="right" open={drawerOpen} onClose={() => toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </Box>
  );
};

export default Transactions;
