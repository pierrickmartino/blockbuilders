import React, { Fragment } from "react";

import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  IconButton,
  TablePagination,
  Stack,
  Button,
  Chip,
  Card,
  CardHeader,
  CardContent,
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
import { DataGrid, GridColDef } from "@mui/x-data-grid";

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
        console.log("Attempting to export transactions with ID:", position_id);

        const response = await exportTransactions(position_id.toString());

        // Log response to check if we got it successfully
        console.log("Export API response received:", response);

        // Create a Blob from the response data
        const blob = new Blob([response], {
          type: "text/csv;charset=utf-8;",
        });
        saveAs(
          blob,
          `transactions_${new Date().toISOString().replace(/[:.-]/g, "")}.csv`
        );
      } catch (error) {
        console.error("An error occurred while exporting transactions:", error);
      }
    } else {
      console.error("No position ID provided to export transactions");
    }
  };

  function renderChipAmount(
    amount: number,
    type: "currency" | "quantity_precise" | "quantity" | "percentage"
  ) {
    return (
      <Chip
        label={formatNumber(amount, type)}
        color={amount < 0 ? "error" : amount > 0 ? "success" : "default"}
        size="small"
      />
    );
  }

  const columns: GridColDef[] = [
    { field: "position", headerName: "Position", flex: 1.5, minWidth: 150 },
    {
      field: "quantity",
      headerName: "Quantity",
      headerAlign: "right",
      align: "right",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "running_quantity",
      headerName: "Running Qty",
      headerAlign: "right",
      align: "right",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "price",
      headerName: "Price",
      headerAlign: "right",
      align: "right",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "cost",
      headerName: "Cost",
      headerAlign: "right",
      align: "right",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "total_cost",
      headerName: "Total Cost",
      headerAlign: "right",
      align: "right",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "average_cost",
      headerName: "Avg Cost",
      headerAlign: "right",
      align: "right",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "capital_gain",
      headerName: "Capital Gain",
      headerAlign: "right",
      align: "right",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => renderChipAmount(params.value, "currency"),
    },
    { field: "date", headerName: "Date", flex: 1.5, minWidth: 150 },
  ];

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
    <Card variant="outlined" sx={{ height: "100%", flexGrow: 1 }}>
      <CardHeader action={action}></CardHeader>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Transaction History
        </Typography>
        <Stack
          direction="column"
          sx={{ justifyContent: "space-between", flexGrow: "1", gap: 1 }}
        >
          <Stack sx={{ justifyContent: "space-between" }}>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              A detailed log of all recent transactions and movements
            </Typography>
          </Stack>
          <Box>
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
                        <Typography variant="h6">Position</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="h6">Quantity</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="h6">Running Qty.</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="h6">Price</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="h6">Cost</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="h6">Total Cost</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="h6">Avg.Cost</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="h6">Cap.gain</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6">Date</Typography>
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
                            {formatNumber(
                              transaction.quantity,
                              "quantity_precise"
                            )}
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
                          <PerformanceChip
                            input={transaction.capital_gain}
                            type="currency"
                          />
                        </TableCell>
                        <TableCell>
                          <Box display="flex">
                            <Box>
                              <Typography color="textSecondary" variant="body2">
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
              <DataGrid
              checkboxSelection
              rows={transactions}
              columns={columns}
              getRowClassName={(params) =>
                params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
              }
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              pageSizeOptions={[10, 20, 50]}
              disableColumnResize
              density="compact"
              slotProps={{
                filterPanel: {
                  filterFormProps: {
                    logicOperatorInputProps: {
                      variant: "outlined",
                      size: "small",
                    },
                    columnInputProps: {
                      variant: "outlined",
                      size: "small",
                      sx: { mt: "auto" },
                    },
                    operatorInputProps: {
                      variant: "outlined",
                      size: "small",
                      sx: { mt: "auto" },
                    },
                    valueInputProps: {
                      InputComponentProps: {
                        variant: "outlined",
                        size: "small",
                      },
                    },
                  },
                },
              }}
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TransactionTable;
