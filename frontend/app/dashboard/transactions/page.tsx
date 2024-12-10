"use client";
import {
  Grid,
  Box,
  Card,
  Stack,
  Typography,
  Button,
  Link,
  Breadcrumbs,
} from "@mui/material";
// components
import { useEffect, useState, useCallback } from "react";
import { Transaction } from "@/app/lib/definition";
import {
  fetchTransactionsAll,
  fetchTransactionsAllWithSearch,
} from "@/app/lib/data";
import PageContainer from "@/app/dashboard/components/container/PageContainer";
import TransactionTable from "@/app/dashboard/components/dashboard/TransactionTable";
import { SearchForm } from "@/app/ui/shared/SearchForm";
import { NavigateNext } from "@mui/icons-material";

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(0); // State for current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // State for rows per page
  const [totalCount, setTotalCount] = useState(0); // State for total number of items

  // Memoize fetchTransactionData using useCallback
  const fetchTransactionData = useCallback(async () => {
    await fetchTransactionsAll(
      setTransactions,
      setTotalCount,
      page,
      rowsPerPage
    );
  }, [page, rowsPerPage]); // Dependencies include page and rowsPerPage

  // Use useEffect to call fetchTransactionData
  useEffect(() => {
    fetchTransactionData();
  }, [fetchTransactionData]); // Include fetchTransactionData as a dependency

  const fetchTransactionDataWithSearch = async (searchTerm: string) => {
    await fetchTransactionsAllWithSearch(
      String(searchTerm),
      setTransactions,
      setTotalCount,
      page,
      rowsPerPage
    );
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

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/dashboard">
      Dashboard
    </Link>,
    transactions.length > 0 ? (
      <Typography key="2" sx={{ color: "text.primary" }}>
        Transactions
      </Typography>
    ) : (
      <Typography key="2" sx={{ color: "text.primary" }}>
        Loading Transactions...
      </Typography>
    ),
  ];

  return (
    <PageContainer title="Transactions" description="this is Transactions">
      <Box mt={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="textSecondary" variant="h4">
                Transactions
              </Typography>
              <Button variant="outlined" size="small" href="/dashboard">
                Back
              </Button>
            </Stack>
            <Breadcrumbs
              separator={<NavigateNext fontSize="small" />}
              aria-label="breadcrumb"
            >
              {breadcrumbs}
            </Breadcrumbs>
          </Grid>
          <Grid item xs={12} lg={12}>
            <Card variant="outlined" sx={{ p: 3 }}>
              <Box px={0} py={0} mb="-15px">
                <Typography variant="h5">Filter</Typography>
              </Box>
              <Box px={0} py={0} mt={3}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  justifyContent="space-between"
                  mb={0}
                >
                  <SearchForm onSearch={handleSearch} />
                </Stack>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} lg={12}>
            {/* <TransactionTable
              transactions={transactions}
              page={page}
              rowsPerPage={rowsPerPage}
              totalCount={totalCount}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            /> */}
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Transactions;
