import React, { Fragment } from "react";

import { Box, Avatar, Stack, Typography, Button, Chip } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";

import { Transaction } from "@/app/lib/definition";
import formatNumber from "@/app/utils/formatNumber";
import formatDate from "@/app/utils/formatDate";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";

// Define the props type that will be passed into WalletTable
interface LastTransactionsProps {
  transactions: Transaction[];
  count: number;
}

const LastTransaction: React.FC<LastTransactionsProps> = ({
  transactions,
  count,
}) => {
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
                  <Avatar
                    alt={transaction.position.contract.blockchain.name}
                    src={
                      "/images/logos/" +
                      transaction.position.contract.blockchain.icon
                    }
                  />
                </TimelineDot>
                {/* Conditionally render the TimelineConnector if this is not the last item */}
                {index < transactions.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  justifyContent="space-between"
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography component="h2" variant="subtitle2">
                      {transaction.position.contract.symbol}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      {transaction.against_contract
                        ? transaction.against_contract.symbol
                        : ""}
                    </Typography>
                  </Stack>
                  <Chip
                    icon={
                      transaction.type == "IN" ? (
                        <ArrowDropUp sx={{ color: "success.main" }} />
                      ) : transaction.type == "OUT" ? (
                        <ArrowDropDown sx={{ color: "error.main" }} />
                      ) : (
                        <Fragment></Fragment>
                      )
                    }
                    color={
                      transaction.type == "OUT"
                        ? "error"
                        : transaction.type == "IN"
                        ? "success"
                        : "default"
                    }
                    size="small"
                    label={formatNumber(
                      transaction.quantity,
                      "quantity_precise"
                    )}
                  ></Chip>
                </Stack>
                <Typography variant="caption" color="textSecondary">
                  {formatDate(transaction.date)}
                </Typography>

                <Grid container spacing={3} mb={5} mt={1}>
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight="500"
                      fontSize="13px"
                    >
                      Price
                    </Typography>
                    <Typography color="textSecondary" fontSize="12px">
                      {formatNumber(transaction.price, "currency")}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight="500"
                      fontSize="13px"
                    >
                      Cost
                    </Typography>
                    <Typography color="textSecondary" fontSize="12px">
                      {formatNumber(transaction.cost, "currency")}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight="500"
                      fontSize="13px"
                    >
                      Avg.Cost
                    </Typography>
                    <Typography color="textSecondary" fontSize="12px">
                      {formatNumber(transaction.average_cost, "currency")}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight="500"
                      fontSize="13px"
                    >
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
        <Stack
          sx={{ pl: 2, pr: 2 }}
          direction="row"
          justifyContent="space-between"
        >
          <Typography variant="body2">{count} Transaction(s)</Typography>
        </Stack>
      </Stack>
    // </Box>
  );
};

export default LastTransaction;
