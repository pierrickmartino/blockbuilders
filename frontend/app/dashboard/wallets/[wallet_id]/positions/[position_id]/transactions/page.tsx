"use client";
import {
  Box,
  Card,
  Stack,
  Typography,
  Chip,
  Link,
  CardContent,
} from "@mui/material";
// components
import Grid from "@mui/material/Grid2";
import { Fragment, useEffect, useState, useCallback } from "react";
import { Transaction } from "@/app/lib/definition";
import { fetchTransactions, fetchTransactionsWithSearch } from "@/app/lib/data";
import TransactionTable from "@/app/dashboard/components/dashboard/TransactionTable";
import { useParams } from "next/navigation";
import { SearchForm } from "@/app/ui/shared/SearchForm";
import formatNumber from "@/app/utils/formatNumber";
import {
  ArrowDropDown,
  ArrowDropUp,
  NavigateBefore,
  NavigateNext,
} from "@mui/icons-material";
import StatCard, {
  StatCardProps,
} from "@/app/dashboard/components/dashboard/StatCard";
import HighlightedCard from "@/app/dashboard/components/dashboard/HighlightedCard";
import BasicCard from "@/app/dashboard/components/shared/BasicCard";

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(0); // State for current page
  const [rowsPerPage, setRowsPerPage] = useState(25); // State for rows per page
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
  }, [page, rowsPerPage, fetchTransactionData]); // Include fetchTransactionData as a dependency

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
    fetchTransactionData();
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage); // Update rows per page state
    setPage(0); // Reset page to 0 whenever rows per page changes
    fetchTransactionData();
  };

  const handleSearch = (searchTerm: string) => {
    // Implement your search logic here, such as making API calls
    fetchTransactionDataWithSearch(searchTerm);
  };

  const data: StatCardProps[] = [
    {
      title: "Total amount",
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
      title: "Total capital gain",
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
      title: "Total unrealized",
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

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/dashboard">
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
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Transactions
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
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card variant="outlined" sx={{ height: "100%", flexGrow: 1 }}>
            <CardContent>
              <Typography component="h2" variant="subtitle2" gutterBottom>
                Total amount
              </Typography>
              <Stack
                direction="column"
                sx={{ justifyContent: "space-between", flexGrow: "1", gap: 1 }}
              >
                <Stack sx={{ justifyContent: "space-between" }}>
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {transactions.length > 0 && transactions[0]?.position ? (
                      <Typography variant="h4" component="p">
                        {formatNumber(
                          transactions[0].position.amount,
                          "currency"
                        )}
                      </Typography>
                    ) : (
                      <Typography>No data available</Typography> // Fallback if transactions are not available
                    )}
                    <Chip size="small" color={"success"} label={"+25%"} />
                  </Stack>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Last 30 days
                  </Typography>
                </Stack>
                {/* <Box sx={{ width: '100%', height: 50 }}>
            <SparkLineChart
              colors={[chartColor]}
              data={data}
              area
              showHighlight
              showTooltip
              xAxis={{
                scaleType: 'band',
                data: daysInWeek, // Use the correct property 'data' for xAxis
              }}
              sx={{
                [`& .${areaElementClasses.root}`]: {
                  fill: `url(#area-gradient-${value})`,
                },
              }}
            >
              <AreaGradient color={chartColor} id={`area-gradient-${value}`} />
            </SparkLineChart>
          </Box> */}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card variant="outlined" sx={{ height: "100%", flexGrow: 1 }}>
            <CardContent>
              <Typography component="h2" variant="subtitle2" gutterBottom>
                Market price
              </Typography>
              <Stack
                direction="column"
                sx={{ justifyContent: "space-between", flexGrow: "1", gap: 1 }}
              >
                <Stack sx={{ justifyContent: "space-between" }}>
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {transactions.length > 0 && transactions[0]?.position ? (
                      <Typography variant="h4" component="p">
                        {formatNumber(
                          transactions[0].position.contract.price,
                          "currency"
                        )}
                      </Typography>
                    ) : (
                      <Typography>No data available</Typography> // Fallback if transactions are not available
                    )}
                    <Chip size="small" color={"success"} label={"+25%"} />
                  </Stack>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Last 30 days
                  </Typography>
                </Stack>
                {/* <Box sx={{ width: '100%', height: 50 }}>
            <SparkLineChart
              colors={[chartColor]}
              data={data}
              area
              showHighlight
              showTooltip
              xAxis={{
                scaleType: 'band',
                data: daysInWeek, // Use the correct property 'data' for xAxis
              }}
              sx={{
                [`& .${areaElementClasses.root}`]: {
                  fill: `url(#area-gradient-${value})`,
                },
              }}
            >
              <AreaGradient color={chartColor} id={`area-gradient-${value}`} />
            </SparkLineChart>
          </Box> */}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <BasicCard title="Performance">
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
                      color:
                        transactions[0].position.capital_gain < 0
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
                      color:
                        transactions[0].position.unrealized_gain < 0
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
                      color:
                        transactions[0].position.daily_price_delta < 0
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
                      color:
                        transactions[0].position.weekly_price_delta < 0
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
                      color:
                        transactions[0].position.monthly_price_delta < 0
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
          </BasicCard>
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
  );
};

export default Transactions;
