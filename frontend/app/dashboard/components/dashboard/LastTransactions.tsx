import React, { Fragment } from "react";

import { Avatar, Stack, Typography, Tooltip, Badge } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";

import { Transaction } from "@/lib/definition";
import { formatNumber } from "@/lib/format";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";

import { formatDistanceToNow, format } from "date-fns";
import { useTheme } from "@mui/material/styles";
import { Badge1 } from "@/components/shared/Badge";

// Define the props type that will be passed into WalletTable
interface LastTransactionsProps {
  transactions: Transaction[];
  count: number;
}

const LastTransaction: React.FC<LastTransactionsProps> = ({ transactions, count }) => {
  const theme = useTheme();

  return (
    // <Box sx={{ width: "100%" }}>
    <Stack direction="column" justifyContent="space-between" spacing={0}>
      <Timeline
        sx={{
          mt: 0,
          px: 1,
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
        }}
      >
        {transactions.map((transaction: Transaction, index: number) => (
          <TimelineItem key={transaction.id}>
            <TimelineSeparator>
              <TimelineDot
                sx={{
                  backgroundColor: "transparent",
                  margin: 0,
                  boxShadow: "none",
                  [".MuiTimelineConnector-root"]: {
                    width: "1px !important",
                    backgroundColor: "rgba(244, 249, 248, 0.12) !important",
                  },
                }}
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={
                    <Avatar
                      alt={transaction.position.contract.blockchain.name}
                      sx={{ width: 16, height: 16, border: `2px solid ${theme.palette.background.paper}` }}
                      src={`/images/logos/${transaction.position.contract.blockchain.icon}`}
                    />
                  }
                >
                  <Avatar
                    alt={transaction.position.contract.blockchain.name}
                    src={transaction.position.contract.logo_uri || `/images/logos/${transaction.position.contract.blockchain.icon}`}
                  />
                </Badge>
              </TimelineDot>
              {/* Conditionally render the TimelineConnector if this is not the last item */}
              {index < transactions.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Stack direction="row" alignItems="center" spacing={0} justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography component="h2" variant="subtitle2">
                    {transaction.position.contract.symbol}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {transaction.against_contract ? transaction.against_contract.symbol : ""}
                  </Typography>
                </Stack>
                <Badge1
                  color={transaction.type == "OUT" ? "error" : transaction.type == "IN" ? "success" : "neutral"}
                  label={formatNumber(transaction.quantity, "quantity_precise")}
                ></Badge1>
              </Stack>
              {/* <Typography variant="caption" color="textSecondary">
                  {formatDate(transaction.date)}
                </Typography> */}
              <Tooltip title={format(new Date(transaction.date), "PPpp")}>
                <Typography variant="caption" color="textSecondary">
                  {formatDistanceToNow(new Date(transaction.date), { addSuffix: true })}
                </Typography>
              </Tooltip>

              <Grid container spacing={2} mb={5} mt={1}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant="subtitle2" fontWeight="500" fontSize="13px">
                    Price
                  </Typography>
                  <Typography color="textSecondary" fontSize="12px">
                    {formatNumber(transaction.price, "currency")}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant="subtitle2" fontWeight="500" fontSize="13px">
                    Cost
                  </Typography>
                  <Typography color="textSecondary" fontSize="12px">
                    {formatNumber(transaction.cost, "currency")}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant="subtitle2" fontWeight="500" fontSize="13px">
                    Avg.Cost
                  </Typography>
                  <Typography color="textSecondary" fontSize="12px">
                    {formatNumber(transaction.average_cost, "currency")}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant="subtitle2" fontWeight="500" fontSize="13px">
                    Cap.Gain
                  </Typography>
                  <Typography color="textSecondary" fontSize="12px">
                    {formatNumber(transaction.capital_gain, "currency")}
                  </Typography>
                </Grid>
              </Grid>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
      <Stack sx={{ pl: 2, pr: 2 }} direction="row" justifyContent="space-between">
        <Typography variant="body2">{count} Transaction(s)</Typography>
      </Stack>
    </Stack>
    // </Box>
  );
};

export default LastTransaction;
