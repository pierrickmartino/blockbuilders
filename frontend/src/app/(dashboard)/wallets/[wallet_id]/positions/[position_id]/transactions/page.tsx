"use client";
import { Box, Stack, Avatar, Tooltip, Drawer, Skeleton, InputLabel, Select, MenuItem, SelectChangeEvent, FormControl } from "@mui/material";
// components
import Grid from "@mui/material/Grid2";
import { Fragment, useEffect, useState, useCallback } from "react";
import { CapitalGainHisto, MarketData, Transaction } from "@/lib/definition";
import { fetchContractMarketPriceHisto, fetchPositionCapitalGainHisto, fetchTransactions } from "@/lib/data";
import { useParams } from "next/navigation";
import { formatNumber } from "@/lib/format";
import getLast30Days from "@/lib/getLast30Days";
import { Badge1 } from "@/components/BadgeCustom";
import { Card } from "@/components/Card";
import { Heading } from "@/components/Heading";

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [market_data, setMarketDataHisto] = useState<MarketData[]>([]);
  const [position_capital_gains, setPositionCapitalGainHisto] = useState<CapitalGainHisto[]>([]);
  const [page, setPage] = useState(0); // State for current page
  const [rowsPerPage, setRowsPerPage] = useState(25); // State for rows per page
  const [totalCount, setTotalCount] = useState(0); // State for total number of items

  const [age, setAge] = useState("30");
  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };

  /* Drawer for transaction detail */
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };
  const handleShowTransactionDrawer = () => {
    toggleDrawer(true);
  };

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
      // console.log("fetchContractMarketPriceHistoData");
      await fetchContractMarketPriceHisto(30, transactions[0].position.contract.symbol, "USD", setMarketDataHisto);
    } else {
      console.warn("No transactions or position data available");
    }
  }, [transactions, fetchContractMarketPriceHisto, setMarketDataHisto]);

  const fetchPositionCapitalGainHistoData = useCallback(async () => {
    if (position_id) {
      // console.log("fetchPositionCapitalGainHistoData");
      await fetchPositionCapitalGainHisto(30, String(position_id), setPositionCapitalGainHisto);
    } else {
      console.warn("No position data available");
    }
  }, [position_id, fetchPositionCapitalGainHisto, setPositionCapitalGainHisto]);

  useEffect(() => {
    fetchTransactionData();
  }, [page, rowsPerPage, fetchTransactionData]); // Include fetchTransactionData as a dependency

  useEffect(() => {
    fetchPositionCapitalGainHistoData();
  }, [fetchPositionCapitalGainHistoData]);

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
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <Heading variant="h6" className="mb-2">
          Transactions
        </Heading>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel id="demo-simple-select-standard-label"></InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={age}
            onChange={handleChange}
            label="Filter"
          >
            <MenuItem value={"30"}>Last 30 days</MenuItem>
            <MenuItem value={"60"}>Last 60 days</MenuItem>
            <MenuItem value={"90"}>Last 90 days</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card>
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
                    <Heading variant="h4">{formatNumber(transactions[0].position.amount, "currency")}</Heading>
                  ) : (
                    <Skeleton variant="text" width={100} sx={{ fontSize: "1.5rem" }} />
                  )}
                  <Badge1 color={"success"} label={"+25%"} />
                </Stack>
                <Heading variant="caption">Total amount</Heading>
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
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card>
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
                    <Heading variant="h4">{formatNumber(transactions[0].position.contract.price, "currency")}</Heading>
                  ) : (
                    <Skeleton variant="text" width={100} sx={{ fontSize: "1.5rem" }} />
                  )}
                  {market_data.length > 1 ? (
                    <>{market_data.map((m) => m.close).reverse()}</>
                  ) : (
                    <Skeleton variant="text" width={50} />
                  )}
                </Stack>
                <Heading variant="caption">Market price</Heading>
              </Stack>
              <Box sx={{ width: "100%", height: 100 }}>
                {market_data.length > 0 && market_data[0]?.close ? (
                  <>{market_data.map((m) => m.close).reverse()}</>
                ) : (
                  <Skeleton variant="rounded" height={100} />
                )}
              </Box>
            </Stack>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card>
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
                    <Heading variant="h4">{formatNumber(transactions[0].position.capital_gain, "currency")}</Heading>
                  ) : (
                    <Skeleton variant="text" width={100} sx={{ fontSize: "1.5rem" }} />
                  )}
                  {position_capital_gains.length > 1 ? (
                    <> {position_capital_gains.map((m) => m.running_capital_gain)} </>
                  ) : (
                    <Skeleton variant="text" width={50} />
                  )}
                </Stack>
                <Heading variant="caption">Capital gain</Heading>
              </Stack>
              <Box sx={{ width: "100%", height: 100 }}>
                {position_capital_gains.length > 0 && position_capital_gains[0]?.running_capital_gain ? (
                  <> {position_capital_gains.map((m) => m.running_capital_gain)} </>
                ) : (
                  <Skeleton variant="rounded" height={100} />
                )}
              </Box>
            </Stack>
          </Card>
          
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card>
            <Stack direction="column" sx={{ justifyContent: "space-between", flexGrow: "1", gap: 1 }}>
              {transactions.length > 0 && transactions[0]?.position.contract ? (
                <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between" mb={1}>
                  <Heading variant="h5">{transactions[0].position.contract.name}</Heading>
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
                  <Heading variant="body2">{truncateText(transactions[0].position.contract.description, 160)}</Heading>
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
                    <Heading variant="subtitle2">
                      {formatNumber(transactions[0].position.contract.supply_total, "quantity_rounded")}
                    </Heading>
                    <Heading variant="caption">Supply total</Heading>
                  </Stack>
                  <Stack>
                    <Heading variant="subtitle2">
                      {formatNumber(transactions[0].position.contract.supply_locked, "quantity_rounded")}
                    </Heading>
                    <Heading variant="caption">Supply locked</Heading>
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
          </Card>

          {/* {transactions.length > 0 && transactions[0]?.position.contract ? (
           */}

          {/* <Stack>
               
                
              </Stack> // Fallback if transactions are not available
            )} */}
          {/* </Stack> */}
          {/* </Stack> */}
        </Grid>
        {/* <Grid size={{ xs: 12, lg: 12 }}>
          <Card variant="outlined" sx={{ p: 3 }}>
            <Box px={0} py={0} mb="-15px">
              <Heading variant="h5">Filter</Heading>
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
          
        </Grid>
      </Grid>
      <Drawer anchor="right" open={drawerOpen} onClose={() => toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </Box>
  );
};

export default Transactions;
