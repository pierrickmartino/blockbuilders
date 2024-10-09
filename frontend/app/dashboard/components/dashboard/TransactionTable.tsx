import React, { useEffect, useState } from "react";

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
} from "@mui/material";
import BaseCard from "../shared/DashboardCard";
import formatNumber from "@/app/utils/formatNumber";
import formatDate from "@/app/utils/formatDate";
import { Transaction } from "../../../lib/definition";

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
  onRowsPerPageChange }) => {
  
    const handleChangePage = (
      event: React.MouseEvent<HTMLButtonElement> | null,
      newPage: number
    ) => {
      onPageChange(newPage);  // Call the passed prop to update the page state in the parent
    };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));  // Call the passed prop to update the rows per page state
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <BaseCard title="Transaction Table">
      <>
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
          sx={{
            whiteSpace: "nowrap",
            mt: 0,
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography color="textSecondary" variant="h6">
                  Position
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography color="textSecondary" variant="h6">
                  Quantity
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography color="textSecondary" variant="h6">
                  Running Qty.
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography color="textSecondary" variant="h6">
                  Price
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography color="textSecondary" variant="h6">
                  Cost
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography color="textSecondary" variant="h6">
                  Total Cost
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography color="textSecondary" variant="h6">
                  Avg.Cost
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography color="textSecondary" variant="h6">
                  Cap.gain
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="h6">
                  Date
                </Typography>
              </TableCell>
              {/* <TableCell>
              </TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction : Transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <Typography fontSize="14px">
                    {transaction.position.contract.symbol}
                  </Typography><Typography fontSize="12px">
                    {transaction.against_contract?.symbol || ''}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                      <Typography fontSize="12px" color={transaction.type == "OUT" ? "error.main" : "success.main"}>{formatNumber(transaction.quantity, "quantity_precise")}</Typography>
                </TableCell>
                <TableCell align="right">
                      <Typography fontSize="12px">{formatNumber(transaction.running_quantity, "quantity_precise")}</Typography>
                </TableCell>
                <TableCell align="right">
                      <Typography fontSize="12px">{transaction.against_fiat.short_symbol} {formatNumber(transaction.price, "quantity")}</Typography>
                </TableCell>
                <TableCell align="right">
                      <Typography fontSize="12px">{transaction.against_fiat.short_symbol} {formatNumber(transaction.cost, "quantity")}</Typography>
                </TableCell>
                <TableCell align="right">
                      <Typography fontSize="12px">{transaction.against_fiat.short_symbol} {formatNumber(transaction.total_cost, "quantity")}</Typography>
                </TableCell>
                <TableCell align="right">
                      <Typography fontSize="12px">{transaction.against_fiat.short_symbol} {formatNumber(transaction.average_cost, "quantity")}</Typography>
                </TableCell>
                <TableCell align="right">
                  <Chip
                    sx={{
                      pl: "4px",
                      pr: "4px",
                      backgroundColor:
                        transaction.capital_gain < 0
                          ? "error.main"
                          : transaction.capital_gain > 0
                          ? "success.main"
                          : "", // No background color if the capital gain is 0
                      color: "#fff",
                    }}
                    size="small"
                    label={formatNumber(transaction.capital_gain, "currency")}
                  ></Chip>
                </TableCell>
                <TableCell>
                  <Box display="flex">
                    <Box>
                      <Typography fontSize="12px">{formatDate(transaction.date)}</Typography>
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
        </>
    </BaseCard>
  );

}

export default TransactionTable;