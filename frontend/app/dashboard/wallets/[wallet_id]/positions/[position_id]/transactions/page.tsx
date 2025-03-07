"use client";
import {
  Box,
  Card,
  Stack,
  Typography,
  Chip,
  Link,
  CardContent,
  Avatar,
} from "@mui/material";
// components
import Grid from "@mui/material/Grid2";
import { useTheme } from "@mui/material/styles";
import { Fragment, useEffect, useState, useCallback } from "react";
import { MarketData, Transaction } from "@/app/lib/definition";
import {
  fetchContractMarketPriceHisto,
  fetchTransactions,
} from "@/app/lib/data";
import TransactionTable from "@/app/dashboard/components/dashboard/TransactionTable";
import { useParams } from "next/navigation";
import formatNumber from "@/app/utils/formatNumber";
import {
  ArrowDropDown,
  ArrowDropUp,
} from "@mui/icons-material";
import BasicCard from "@/app/dashboard/components/shared/BasicCard";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import { areaElementClasses } from "@mui/x-charts/LineChart";

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

function getLast30Days(): string[] {
  const labels = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - i);

    const day = pastDate.getDate(); // Numéro du jour
    const monthName = pastDate.toLocaleDateString('en-US', { month: 'short' }); // Mois au format abrégé

    labels.push(`${monthName} ${day}`);
  }

  return labels.reverse(); // Inverser pour avoir du plus ancien au plus récent
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [market_data, setMarketDataHisto] = useState<MarketData[]>([]);
  const [page, setPage] = useState(0); // State for current page
  const [rowsPerPage, setRowsPerPage] = useState(25); // State for rows per page
  const [totalCount, setTotalCount] = useState(0); // State for total number of items

  const theme = useTheme();
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

  // Fetch market price data
  const fetchContractMarketPriceHistoData = useCallback(async () => {
    if (transactions.length > 0 && transactions[0]?.position) {
      console.log("fetchContractMarketPriceHistoData");
      await fetchContractMarketPriceHisto(
        30,
        transactions[0].position.contract.symbol,
        "USD",
        setMarketDataHisto
      );
    } else {
      console.warn("No transactions or position data available");
    }
  }, [transactions, fetchContractMarketPriceHisto, setMarketDataHisto]);

  useEffect(() => {
    fetchTransactionData();
  }, [page, rowsPerPage, fetchTransactionData]); // Include fetchTransactionData as a dependency

  useEffect(() => {
    fetchContractMarketPriceHistoData();
  }, [fetchContractMarketPriceHistoData]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage); // Update page state
    fetchTransactionData();
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage); // Update rows per page state
    setPage(0); // Reset page to 0 whenever rows per page changes
    fetchTransactionData();
  };

  const last30Days = getLast30Days();

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
                <Box sx={{ width: "100%", height: 80 }}>
                  {market_data.length > 0 && market_data[0]?.close ? (
                    <SparkLineChart
                      colors={[theme.palette.grey[400]]}
                      // colors={[chartColor]}
                      data={market_data.map((item) => item.close).reverse()}
                      area
                      showHighlight
                      showTooltip
                      xAxis={{
                        scaleType: "band",
                        data: last30Days, // Use the correct property 'data' for xAxis
                      }}
                      sx={{
                        [`& .${areaElementClasses.root}`]: {
                          fill: `url(#area-gradient-${market_data[0].close})`,
                        },
                      }}
                    >
                      {/* <AreaGradient color={theme.palette.grey[400]} id={`area-gradient-325`} /> */}
                      <AreaGradient
                        color={theme.palette.grey[400]}
                        id={`area-gradient-${market_data[0].close}`}
                      />
                    </SparkLineChart>
                  ) : (
                    <Typography>No data available</Typography> // Fallback if transactions are not available
                  )}
                </Box>
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
                    color={
                      transactions[0].position.capital_gain < 0
                        ? "error"
                        : transactions[0].position.capital_gain > 0
                        ? "success"
                        : "default"
                    }
                    // sx={{
                    //   pl: "4px",
                    //   pr: "4px",
                    //   mb: "4px",
                    // }}
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
                    color={
                      transactions[0].position.unrealized_gain < 0
                        ? "error"
                        : transactions[0].position.unrealized_gain > 0
                        ? "success"
                        : "default"
                    }
                    // sx={{
                    //   pl: "4px",
                    //   pr: "4px",
                    //   mb: "4px",
                    // }}
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
                    color={
                      transactions[0].position.daily_price_delta < 0
                        ? "error"
                        : transactions[0].position.daily_price_delta > 0
                        ? "success"
                        : "default"
                    }
                    // sx={{
                    //   pl: "4px",
                    //   pr: "4px",
                    //   mb: "4px",
                    // }}
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
                    color={
                      transactions[0].position.weekly_price_delta < 0
                        ? "error"
                        : transactions[0].position.weekly_price_delta > 0
                        ? "success"
                        : "default"
                    }
                    // sx={{
                    //   pl: "4px",
                    //   pr: "4px",
                    //   mb: "4px",
                    // }}
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
                    color={
                      transactions[0].position.monthly_price_delta < 0
                        ? "error"
                        : transactions[0].position.monthly_price_delta > 0
                        ? "success"
                        : "default"
                    }
                    // sx={{
                    //   pl: "4px",
                    //   pr: "4px",
                    //   mb: "4px",
                    // }}
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
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <BasicCard title="Information">
            {transactions.length > 0 && transactions[0]?.position.contract ? (
              <Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  justifyContent="space-between"
                  mb={1}
                >
                  <Typography variant="h5" gutterBottom>
                    {transactions[0].position.contract.name}
                  </Typography>

                  <Avatar
                    alt={transactions[0].position.contract.name}
                    sx={{ width: 24, height: 24 }}
                    src={transactions[0].position.contract.logo_uri || `A`}
                  />
                </Stack>
                {/* <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  justifyContent="space-between"
                  mb={1}
                > */}
                <Typography color="textSecondary" fontSize="12px">
                  {transactions[0].position.contract.description}
                </Typography>

                <Grid container spacing={3} mb={1} mt={1}>
                  <Grid size={{ xs: 6, sm: 4 }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight="500"
                      fontSize="13px"
                    >
                      Supply Total
                    </Typography>
                    <Typography color="textSecondary" fontSize="12px">
                      {formatNumber(
                        transactions[0].position.contract.supply_total,
                        "quantity_rounded"
                      )}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 4 }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight="500"
                      fontSize="13px"
                    >
                      Supply Locked
                    </Typography>
                    <Typography color="textSecondary" fontSize="12px">
                      {formatNumber(
                        transactions[0].position.contract.supply_locked,
                        "quantity_rounded"
                      )}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 4 }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight="500"
                      fontSize="13px"
                    >
                      Supply Burnt
                    </Typography>
                    <Typography color="textSecondary" fontSize="12px">
                      {formatNumber(
                        transactions[0].position.contract.supply_burnt,
                        "quantity_rounded"
                      )}
                    </Typography>
                  </Grid>
                </Grid>
                {/* </Stack> */}
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
        {/* <Grid size={{ xs: 12, lg: 12 }}>
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
        </Grid> */}
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
