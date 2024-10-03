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

import { Transaction } from "../../../lib/definition";

// Define the props type that will be passed into WalletTable
interface TransactionTableProps {
  transactions: Transaction[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
              <TableCell>
                <Typography color="textSecondary" variant="h6">
                  Quantity
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="h6">
                  Running Quantity
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="h6">
                  Price
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="h6">
                  Cost
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="h6">
                  Total Cost
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="h6">
                  Average Cost
                </Typography>
              </TableCell>
              <TableCell>
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
                  <Typography fontSize="12px">
                    {transaction.position.contract.symbol} {transaction.against_contract?.symbol || ''}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex">
                    <Box>
                      <Typography fontSize="12px">{transaction.quantity}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex">
                    <Box>
                      <Typography fontSize="12px">{transaction.running_quantity}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex">
                    <Box>
                      <Typography fontSize="12px">{transaction.against_fiat.short_symbol} {transaction.price}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex">
                    <Box>
                      <Typography fontSize="12px">{transaction.against_fiat.short_symbol} {transaction.cost}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex">
                    <Box>
                      <Typography fontSize="12px">{transaction.against_fiat.short_symbol} {transaction.total_cost}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex">
                    <Box>
                      <Typography fontSize="12px">{transaction.against_fiat.short_symbol} {transaction.average_cost}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Chip
                    sx={{
                      pl: "4px",
                      pr: "4px",
                      backgroundColor: "", 
                      // wallet.realized_color,
                      color: "#fff",
                    }}
                    size="small"
                    label={transaction.capital_gain}
                  ></Chip>
                </TableCell>
                <TableCell>
                  <Box display="flex">
                    <Box>
                      <Typography fontSize="12px">{transaction.date}</Typography>
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
          rowsPerPageOptions={[5, 10, 25]}
          count={transactions.length}
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