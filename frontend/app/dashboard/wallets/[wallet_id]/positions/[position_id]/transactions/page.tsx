"use client";
import { Box, Card, Stack, Typography, Chip, CardContent, Avatar, Tooltip, Drawer, Skeleton } from "@mui/material";
// components
import Grid from "@mui/material/Grid2";
import { useTheme } from "@mui/material/styles";
import { Fragment, useEffect, useState, useCallback } from "react";
import { MarketData, Transaction } from "@/app/lib/definition";
import { fetchContractMarketPriceHisto, fetchTransactions } from "@/app/lib/data";
import TransactionTable from "@/app/dashboard/components/dashboard/TransactionTable";
import { useParams } from "next/navigation";
import formatNumber from "@/app/utils/formatNumber";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import BasicCard from "@/app/dashboard/components/shared/BasicCard";
import getLast30Days from "@/app/utils/getLast30Days";
import PriceSparkline from "@/app/dashboard/components/dashboard/PriceSparkline";

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [market_data, setMarketDataHisto] = useState<MarketData[]>([]);
  const [page, setPage] = useState(0); // State for current page
  const [rowsPerPage, setRowsPerPage] = useState(25); // State for rows per page
  const [totalCount, setTotalCount] = useState(0); // State for total number of items

  /* Drawer for transaction detail */
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };
  const handleShowTransactionDrawer = () => {
    toggleDrawer(true);
  };

  const theme = useTheme();
  const params = useParams();
  const wallet_id = params.wallet_id;
  const position_id = params.position_id;

  // Wrap fetchTransactionData with useCallback to avoid unnecessary re-creations
  const fetchTransactionData = useCallback(async () => {
    if (position_id && wallet_id) {
      await fetchTransactions(String(position_id), String(wallet_id), setTransactions, setTotalCount, page, rowsPerPage);
    }
  }, [position_id, wallet_id, page, rowsPerPage]); // Add dependencies used within the function

  // Fetch market price data
  const fetchContractMarketPriceHistoData = useCallback(async () => {
    if (transactions.length > 0 && transactions[0]?.position) {
      console.log("fetchContractMarketPriceHistoData");
      await fetchContractMarketPriceHisto(30, transactions[0].position.contract.symbol, "USD", setMarketDataHisto);
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

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const DrawerList = (
    <Box sx={{ width: 350, height: "100%" }} role="presentation">
      {/* <CreateWalletForm /> */}
    </Box>
  );

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Transactions
      </Typography>
      <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card variant="outlined" sx={{ height: "100%", flexGrow: 1 }}>
            <CardContent>
              <Stack direction="column" sx={{ justifyContent: "space-between", flexGrow: "1", gap: 1 }}>
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
                        {formatNumber(transactions[0].position.amount, "currency")}
                      </Typography>
                    ) : (
                      <Skeleton variant="text" width={100} sx={{ fontSize: "1.5rem" }} />
                    )}
                    <Chip size="small" color={"success"} label={"+25%"} />
                  </Stack>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Total amount
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
              <Stack direction="column" sx={{ justifyContent: "space-between", flexGrow: "1", gap: 1 }}>
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
                        {formatNumber(transactions[0].position.contract.price, "currency")}
                      </Typography>
                    ) : (
                      <Skeleton variant="text" width={100} sx={{ fontSize: "1.5rem" }} />
                    )}
                    {market_data.length > 1 ? (
                      (() => {
                        const closes = market_data.map((item) => item.close).reverse(); // from oldest to latest
                        const firstClose = closes[0];
                        const lastClose = closes[closes.length - 1];

                        const delta = ((lastClose - firstClose) / firstClose) * 100;
                        const roundedDelta = delta.toFixed(2); // e.g., 24.57

                        let chipColor: "success" | "error" | "default" = "default";
                        if (delta > 0) chipColor = "success";
                        else if (delta < 0) chipColor = "error";

                        const sign = delta >= 0 ? "+" : "-";

                        return <Chip size="small" color={chipColor} label={`${sign}${roundedDelta}%`} />;
                      })()
                    ) : (
                      <Skeleton variant="text" width={50} />
                    )}
                  </Stack>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Market price
                  </Typography>
                </Stack>
                <Box sx={{ width: "100%", height: 100 }}>
                  {market_data.length > 0 && market_data[0]?.close ? (
                    <PriceSparkline data={market_data.map((m) => m.close).reverse()} days={last30Days} />
                  ) : (
                    <Skeleton variant="rounded" height={100} />
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
                <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between" mb={1}>
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
                    label={formatNumber(transactions[0].position.capital_gain, "currency")}
                  ></Chip>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between" mb={1}>
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
                    label={formatNumber(transactions[0].position.unrealized_gain, "percentage")}
                  ></Chip>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between" mb={1}>
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
                    label={formatNumber(transactions[0].position.daily_price_delta, "percentage")}
                  ></Chip>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between" mb={1}>
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
                    label={formatNumber(transactions[0].position.weekly_price_delta, "percentage")}
                  ></Chip>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between" mb={0}>
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
                    label={formatNumber(transactions[0].position.monthly_price_delta, "percentage")}
                  ></Chip>
                </Stack>
              </Stack>
            ) : (
              <Stack>
                <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between" mb={1}>
                  <Skeleton variant="text" width={100} sx={{ fontSize: "0.875rem" }} />
                  <Skeleton variant="text" width={50} sx={{ fontSize: "0.875rem" }} />
                </Stack>
                <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between" mb={1}>
                  <Skeleton variant="text" width={100} sx={{ fontSize: "0.875rem" }} />
                  <Skeleton variant="text" width={50} sx={{ fontSize: "0.875rem" }} />
                </Stack>
                <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between" mb={1}>
                  <Skeleton variant="text" width={100} sx={{ fontSize: "0.875rem" }} />
                  <Skeleton variant="text" width={50} sx={{ fontSize: "0.875rem" }} />
                </Stack>
                <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between" mb={1}>
                  <Skeleton variant="text" width={100} sx={{ fontSize: "0.875rem" }} />
                  <Skeleton variant="text" width={50} sx={{ fontSize: "0.875rem" }} />
                </Stack>
                <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between" mb={0}>
                  <Skeleton variant="text" width={100} sx={{ fontSize: "0.875rem" }} />
                  <Skeleton variant="text" width={50} sx={{ fontSize: "0.875rem" }} />
                </Stack>
              </Stack> // Fallback if transactions are not available
            )}
            {/* </Stack> */}
            {/* </Stack> */}
          </BasicCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card variant="outlined" sx={{ height: "100%", flexGrow: 1 }}>
            <CardContent>
              <Stack direction="column" sx={{ justifyContent: "space-between", flexGrow: "1", gap: 1 }}>
                {transactions.length > 0 && transactions[0]?.position.contract ? (
                  <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between" mb={1}>
                    <Typography variant="h5" gutterBottom>
                      {transactions[0].position.contract.name}
                    </Typography>
                    <Avatar
                      alt={transactions[0].position.contract.name}
                      sx={{ width: 24, height: 24 }}
                      src={transactions[0].position.contract.logo_uri || `A`}
                    />
                  </Stack>
                ) : (
                  <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between" mb={1}>
                    <Skeleton variant="text" width={100} sx={{ fontSize: "1.5rem" }} />
                    <Skeleton variant="circular" width={24} height={24} />
                  </Stack>
                )}

                {transactions.length > 0 && transactions[0]?.position.contract ? (
                  <Tooltip title={transactions[0].position.contract.description}>
                    <Typography color="textSecondary" fontSize="12px">
                      {truncateText(transactions[0].position.contract.description, 160)}
                    </Typography>
                  </Tooltip>
                ) : (
                  <Fragment>
                    <Skeleton variant="text" width={100} />
                    <Skeleton variant="text" width={100} />
                  </Fragment>
                )}

                {transactions.length > 0 && transactions[0]?.position.contract ? (
                  <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between" mt={1}>
                    <Stack>
                      <Typography variant="subtitle2" fontWeight="500" fontSize="13px">
                        {formatNumber(transactions[0].position.contract.supply_total, "quantity_rounded")}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        Supply total
                      </Typography>
                    </Stack>
                    <Stack>
                      <Typography variant="subtitle2" fontWeight="500" fontSize="13px">
                        {formatNumber(transactions[0].position.contract.supply_locked, "quantity_rounded")}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        Supply locked
                      </Typography>
                    </Stack>
                  </Stack>
                ) : (
                  <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between" mt={1}>
                    <Stack>
                      <Skeleton variant="text" width={50} />
                      <Skeleton variant="text" width={50} />
                    </Stack>
                    <Stack>
                      <Skeleton variant="text" width={50} />
                      <Skeleton variant="text" width={50} />
                    </Stack>
                  </Stack>
                )}
              </Stack>
            </CardContent>
          </Card>

          {/* {transactions.length > 0 && transactions[0]?.position.contract ? (
           */}

          {/* <Stack>
               
                
              </Stack> // Fallback if transactions are not available
            )} */}
          {/* </Stack> */}
          {/* </Stack> */}
          {/* </BasicCard> */}
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
