"use client";
import {
  Box,
  Card,
  Stack,
  Typography,
  Chip,
  Button,
  Link,
  Breadcrumbs,
} from "@mui/material";
// components
import Grid from "@mui/material/Grid2";
import { Fragment, useEffect, useState, useCallback } from "react";
import { Transaction } from "@/app/lib/definition";
import { fetchTransactions, fetchTransactionsWithSearch } from "@/app/lib/data";
import PageContainer from "@/app/dashboard/components/container/PageContainer";
import TransactionTable from "@/app/dashboard/components/dashboard/TransactionTable";
import { useParams } from "next/navigation";
import { SearchForm } from "@/app/ui/shared/SearchForm";
import CustomCard from "@/app/dashboard/components/shared/CustomCard";
import formatNumber from "@/app/utils/formatNumber";
import {
  ArrowDropDown,
  ArrowDropUp,
  NavigateBefore,
  NavigateNext,
} from "@mui/icons-material";

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(0); // State for current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // State for rows per page
  const [totalCount, setTotalCount] = useState(0); // State for total number of items

  const params = useParams();
  const wallet_id = params.wallet_id;
  const position_id = params.position_id;

  // Wrap fetchTransactionData with useCallback to avoid unnecessary re-creations
  const fetchTransactionData = useCallback(async () => {
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
  }, [position_id, wallet_id, page, rowsPerPage]); // Add dependencies used within the function

  useEffect(() => {
    fetchTransactionData();
  }, [fetchTransactionData]); // Include fetchTransactionData as a dependency

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
    <Link underline="hover" key="1" color="inherit" href="/dashboard/wallets/">
      Dashboard
    </Link>,

    <Link
      underline="hover"
      key="2"
      color="inherit"
      href={`/dashboard/wallets/${wallet_id}/positions`}
    >
      Positions
    </Link>,
    transactions.length > 0 ? (
      <Typography key="3" sx={{ color: "text.primary" }}>
        Transactions related to {transactions[0].position.contract.name}
      </Typography>
    ) : (
      <Typography key="3" sx={{ color: "text.primary" }}>
        Loading Transactions...
      </Typography>
    ),
  ];

  return (
    <PageContainer title="Transactions" description="this is Transactions">
      <Box mt={0}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 12 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="textPrimary" variant="h4">
                Transactions
              </Typography>
              <Button
                variant="outlined"
                size="small"
                href={`/dashboard/wallets/${wallet_id}/positions`}
              >
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
          <Grid size={{ xs: 12, lg: 4 }}>
            <CustomCard title="Total Amount">
              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                {transactions.length > 0 && transactions[0]?.position ? (
                  <Typography color="textSecondary" variant="h3">
                    {formatNumber(transactions[0].position.amount, "currency")}
                  </Typography>
                ) : (
                  <Typography>No data available</Typography> // Fallback if transactions are not available
                )}
              </Stack>
            </CustomCard>
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <CustomCard title="Market Price">
              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                {transactions.length > 0 && transactions[0]?.position ? (
                  <Typography color="textSecondary" variant="h3">
                    {formatNumber(
                      transactions[0].position.contract.price,
                      "currency"
                    )}
                  </Typography>
                ) : (
                  <Typography>No data available</Typography> // Fallback if transactions are not available
                )}
              </Stack>
            </CustomCard>
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <CustomCard title="Performance">
              {transactions.length > 0 && transactions[0]?.position ? (
                <Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    justifyContent="space-between"
                    mb={1}
                  >
                    Capital Gain
                    <Chip
                      icon={
                        transactions[0].position.capital_gain < 0 ? (
                          <ArrowDropDown />
                        ) : transactions[0].position.capital_gain > 0 ? (
                          <ArrowDropUp />
                        ) : (
                          <Fragment></Fragment>
                        )
                      }
                      sx={{
                        pl: "4px",
                        pr: "4px",
                        backgroundColor:
                          transactions[0].position.capital_gain < 0
                            ? "error.light"
                            : transactions[0].position.capital_gain > 0
                            ? "success.light"
                            : "", // No background color if the capital gain is 0
                        color: transactions[0].position.capital_gain < 0
                        ? "error.main"
                        : transactions[0].position.capital_gain > 0
                        ? "success.main"
                        : "",
                        mb: "4px",
                      }}
                      size="small"
                      label={formatNumber(
                        transactions[0].position.capital_gain,
                        "currency"
                      )}
                    ></Chip>
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    justifyContent="space-between"
                    mb={1}
                  >
                    Unrealized
                    <Chip
                      icon={
                        transactions[0].position.unrealized_gain < 0 ? (
                          <ArrowDropDown />
                        ) : transactions[0].position.unrealized_gain > 0 ? (
                          <ArrowDropUp />
                        ) : (
                          <Fragment></Fragment>
                        )
                      }
                      sx={{
                        pl: "4px",
                        pr: "4px",
                        backgroundColor:
                          transactions[0].position.unrealized_gain < 0
                            ? "error.light"
                            : transactions[0].position.unrealized_gain > 0
                            ? "success.light"
                            : "", // No background color if the capital gain is 0
                        color: transactions[0].position.unrealized_gain < 0
                        ? "error.main"
                        : transactions[0].position.unrealized_gain > 0
                        ? "success.main"
                        : "",
                        mb: "4px",
                      }}
                      size="small"
                      label={formatNumber(
                        transactions[0].position.unrealized_gain,
                        "percentage"
                      )}
                    ></Chip>
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    justifyContent="space-between"
                    mb={1}
                  >
                    Daily
                    <Chip
                      icon={
                        transactions[0].position.daily_price_delta < 0 ? (
                          <ArrowDropDown />
                        ) : transactions[0].position.daily_price_delta > 0 ? (
                          <ArrowDropUp />
                        ) : (
                          <Fragment></Fragment>
                        )
                      }
                      sx={{
                        pl: "4px",
                        pr: "4px",
                        backgroundColor:
                          transactions[0].position.daily_price_delta < 0
                            ? "error.light"
                            : transactions[0].position.daily_price_delta > 0
                            ? "success.light"
                            : "", // No background color if the capital gain is 0
                        color: transactions[0].position.daily_price_delta < 0
                        ? "error.main"
                        : transactions[0].position.daily_price_delta > 0
                        ? "success.main"
                        : "",
                        mb: "4px",
                      }}
                      size="small"
                      label={formatNumber(
                        transactions[0].position.daily_price_delta,
                        "percentage"
                      )}
                    ></Chip>
                  </Stack>

                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    justifyContent="space-between"
                    mb={1}
                  >
                    Weekly
                    <Chip
                      icon={
                        transactions[0].position.weekly_price_delta < 0 ? (
                          <ArrowDropDown />
                        ) : transactions[0].position.weekly_price_delta > 0 ? (
                          <ArrowDropUp />
                        ) : (
                          <Fragment></Fragment>
                        )
                      }
                      sx={{
                        pl: "4px",
                        pr: "4px",
                        backgroundColor:
                          transactions[0].position.weekly_price_delta < 0
                            ? "error.light"
                            : transactions[0].position.weekly_price_delta > 0
                            ? "success.light"
                            : "", // No background color if the capital gain is 0
                        color: transactions[0].position.weekly_price_delta < 0
                        ? "error.main"
                        : transactions[0].position.weekly_price_delta > 0
                        ? "success.main"
                        : "",
                        mb: "4px",
                      }}
                      size="small"
                      label={formatNumber(
                        transactions[0].position.weekly_price_delta,
                        "percentage"
                      )}
                    ></Chip>
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    justifyContent="space-between"
                    mb={0}
                  >
                    Monthly
                    <Chip
                      icon={
                        transactions[0].position.monthly_price_delta < 0 ? (
                          <ArrowDropDown />
                        ) : transactions[0].position.monthly_price_delta > 0 ? (
                          <ArrowDropUp />
                        ) : (
                          <Fragment></Fragment>
                        )
                      }
                      sx={{
                        pl: "4px",
                        pr: "4px",
                        backgroundColor:
                          transactions[0].position.monthly_price_delta < 0
                            ? "error.light"
                            : transactions[0].position.monthly_price_delta > 0
                            ? "success.light"
                            : "", // No background color if the capital gain is 0
                        color: transactions[0].position.monthly_price_delta < 0
                        ? "error.main"
                        : transactions[0].position.monthly_price_delta > 0
                        ? "success.main"
                        : "",
                      }}
                      size="small"
                      label={formatNumber(
                        transactions[0].position.monthly_price_delta,
                        "percentage"
                      )}
                    ></Chip>
                  </Stack>
                </Stack>
              ) : (
                <Stack>
                  <Typography>No data available</Typography>
                </Stack> // Fallback if transactions are not available
              )}
              {/* </Stack> */}
              {/* </Stack> */}
            </CustomCard>
          </Grid>
          <Grid size={{ xs: 12, lg: 12 }}>
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
          <Grid size={{ xs: 12, lg: 12 }}>
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
