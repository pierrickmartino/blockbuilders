import React, { Fragment } from "react";

import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  TableContainer,
  IconButton,
  TablePagination,
  Stack,
  Button,
} from "@mui/material";
import BaseCard from "../shared/DashboardCard";
import formatNumber from "@/app/utils/formatNumber";
import formatDate from "@/app/utils/formatDate";
import { Transaction } from "../../../lib/definition";
import Link from "next/link";
import { Link as LinkIcon } from "@mui/icons-material";
import { exportTransactions } from "@/app/lib/export-transaction";
import { saveAs } from "file-saver";
import PerformanceChip from "../../ui-components/chips/PerformanceChip";

// Define the props type that will be passed into WalletTable
interface TransactionTableProps {
  transactions: Transaction[];
  page: number;
  rowsPerPage: number;
  totalCount: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    onPageChange(newPage); // Call the passed prop to update the page state in the parent
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onRowsPerPageChange(parseInt(event.target.value, 10)); // Call the passed prop to update the rows per page state
  };

  const handleExportTransactions = async (position_id: string) => {
    console.log("Export function called"); // Debug log

    if (position_id !== null) {
      try {
        console.log(
          "Attempting to export transactions with ID:",
          position_id
        );

        const response = await exportTransactions(
          position_id.toString()
        );

        // Log response to check if we got it successfully
        console.log("Export API response received:", response);

        // Check if response is OK and contains data
        // if (response.status === 200) {
        console.log("Response status is 200. Proceeding to download.");

        // Create a Blob from the response data
        const blob = new Blob([response], {
          type: "text/csv;charset=utf-8;",
        });
        saveAs(
          blob,
          `transactions_${new Date().toISOString().replace(/[:.-]/g, "")}.csv`
        );
        // } else {
        //   console.error(
        //     "Failed to export transactions, unexpected response status:",
        //     response.status
        //   );
        // }
      } catch (error) {
        console.error("An error occurred while exporting transactions:", error);
      }
    } else {
      console.error("No position ID provided to export transactions");
    }
  };

  const action = (
    <Fragment>
      <Button
        variant="contained"
        size="small"
        onClick={() => {
         handleExportTransactions(transactions[0].position.id);
        }}
      >
        Export
      </Button>
    </Fragment>
  );

  return (
    <BaseCard
      title="Transaction History"
      subtitle="A detailed log of all recent transactions and movements"
      action={action}
    >
      <Fragment>
        <TableContainer
          sx={{
            width: {
              xs: "274px",
              sm: "100%",
            },
          }}
        >
          <Table
            aria-label="simple table"
            size="small"
            sx={{
              whiteSpace: "nowrap",
              mt: 0,
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">
                    Position
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">
                    Quantity
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">
                    Running Qty.
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">
                    Price
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">
                    Cost
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">
                    Total Cost
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">
                    Avg.Cost
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">
                    Cap.gain
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">
                    Date
                  </Typography>
                </TableCell>
                {/* <TableCell>
              </TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction: Transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Link
                        href={
                          transaction.position.contract.blockchain
                            .transaction_link + transaction.hash
                        }
                        passHref
                      >
                        <IconButton
                          component="a"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <LinkIcon fontSize="small" color="primary" />
                        </IconButton>
                      </Link>
                      <Stack>
                        <Typography>
                          {transaction.position.contract.symbol}
                        </Typography>
                        <Typography color="textSecondary" variant="body2">
                          {transaction.against_contract?.symbol || ""}
                        </Typography>
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      color={
                        transaction.type == "OUT"
                          ? "error.main"
                          : "success.main"
                      }
                    >
                      {formatNumber(transaction.quantity, "quantity_precise")}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography color="textSecondary">
                      {formatNumber(
                        transaction.running_quantity,
                        "quantity_precise"
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography color="textSecondary">
                      {formatNumber(transaction.price, "currency")}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography color="textSecondary">
                      {formatNumber(transaction.cost, "currency")}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography color="textSecondary">
                      {formatNumber(transaction.total_cost, "currency")}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography color="textSecondary">
                      {formatNumber(transaction.average_cost, "currency")}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <PerformanceChip input={transaction.capital_gain} type="currency" />
                  </TableCell>
                  <TableCell>
                    <Box display="flex">
                      <Box>
                        <Typography color="textSecondary" variant="body2" >
                          {formatDate(transaction.date)}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  {/* <TableCell>
                <IconButton>
                  <IconDotsVertical width={18} />
                </IconButton>
                </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          rowsPerPageOptions={[5, 10, 25, 50]}
          count={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Fragment>
    </BaseCard>
  );
};

export default TransactionTable;
