"use client";
import { Grid, Box, Card, FormControlLabel, FormGroup, Stack, Switch, Typography } from "@mui/material";
// components
import { useEffect, useState } from "react";
import { Transaction } from "@/app/lib/definition";
import { fetchTransactions, fetchTransactionsWithSearch } from "@/app/lib/data";
import PageContainer from "@/app/dashboard/components/container/PageContainer";
import TransactionTable from "@/app/dashboard/components/dashboard/TransactionTable";
import { useParams } from "next/navigation";
import { SearchForm } from "@/app/ui/shared/SearchForm";

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(0); // State for current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // State for rows per page
  const [totalCount, setTotalCount] = useState(0); // State for total number of items

  const params = useParams();
  const wallet_id = params.wallet_id;
  const position_id = params.position_id;

  const fetchTransactionData = async () => {
    if (position_id && wallet_id) {
      await fetchTransactions(
        String(position_id),
        String(wallet_id),
        setTransactions,
        setTotalCount,
        page,
        rowsPerPage
      );
    }
  };

  const fetchTransactionDataWithSearch = async (searchTerm: string) => {
    if (position_id && wallet_id) {
      await fetchTransactionsWithSearch(
        String(position_id),
        String(wallet_id),
        String(searchTerm),
        setTransactions,
        setTotalCount,
        page,
        rowsPerPage
      );
    }
  };

  useEffect(() => {
    fetchTransactionData();
  }, [position_id, page, rowsPerPage]);

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

  return (
    <PageContainer title="Transactions" description="this is Transactions">
      <Box mt={3}>
        <Grid container spacing={3}>
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
            <TransactionTable
              transactions={transactions}
              page={page}
              rowsPerPage={rowsPerPage}
              totalCount={totalCount}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Transactions;
