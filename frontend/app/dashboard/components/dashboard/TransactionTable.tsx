import React, { Fragment, useState } from "react";

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
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";
import BaseCard from "../shared/DashboardCard";
import formatNumber from "@/app/utils/formatNumber";
import formatDate from "@/app/utils/formatDate";
import { Transaction } from "../../../lib/definition";
import Link from "next/link";
import { Download, Link as LinkIcon } from "@mui/icons-material";
import { IconDotsVertical } from "@tabler/icons-react";
import { exportTransactions } from "@/app/lib/export-transaction";
import { saveAs } from "file-saver";

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

  const transactionMenuItems = [
    {
      title: "Export",
      key: "transaction-export",
      value: "transaction-export",
      button: <Download fontSize="small" />,
    },
  ];

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(
    null
  );

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onRowsPerPageChange(parseInt(event.target.value, 10)); // Call the passed prop to update the rows per page state
  };

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    position_id: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedPositionId(position_id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedPositionId(null);
  };

  const handleExportTransactions = async () => {
    console.log("Export function called"); // Debug log

    if (selectedPositionId !== null) {
      try {
        console.log(
          "Attempting to export transactions with ID:",
          selectedPositionId
        );

        const response = await exportTransactions(
          selectedPositionId.toString()
        );

        // Log response to check if we got it successfully
        console.log("Export API response received:", response);

        // Check if response is OK and contains data
        if (response.status === 200) {
          console.log("Response status is 200. Proceeding to download.");

          // Create a Blob from the response data
          const blob = new Blob([response.data], {
            type: "text/csv;charset=utf-8;",
          });
          saveAs(
            blob,
            `transactions_${new Date().toISOString().replace(/[:.-]/g, "")}.csv`
          );
        } else {
          console.error(
            "Failed to export transactions, unexpected response status:",
            response.status
          );
        }
      } catch (error) {
        console.error("An error occurred while exporting transactions:", error);
      }
    } else {
      console.error("No position ID provided to export transactions");
    }
  };

  // const truncateText = (text: string, maxLength: number) => {
  //   return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  // };

  const action = (
    <Fragment>
      <IconButton
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={(event) => handleClick(event, transactions[0].position.id)}
        aria-label="Open to show more"
        title="Open to show more"
      >
        <IconDotsVertical width={18} />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
      >
        {transactionMenuItems.map((item) => (
          <MenuItem
            onClick={() => {
              console.log(`Clicked on menu item: ${item.key}`);
              handleClose();
              if (item.key === "transaction-export") {
                handleExportTransactions();
              }
            }}
            key={item.key}
            value={item.value}
          >
            <ListItemIcon>{item.button}</ListItemIcon>
            {item.title}
          </MenuItem>
        ))}
      </Menu>
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
              {transactions.map((transaction: Transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <Stack direction="row" spacing={2}>
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
                        <Typography fontSize="14px">
                          {transaction.position.contract.symbol}
                        </Typography>
                        <Typography fontSize="12px">
                          {transaction.against_contract?.symbol || ""}
                        </Typography>
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      fontSize="12px"
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
                    <Typography fontSize="12px">
                      {formatNumber(
                        transaction.running_quantity,
                        "quantity_precise"
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontSize="12px">
                      {transaction.against_fiat.short_symbol}{" "}
                      {formatNumber(transaction.price, "quantity")}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontSize="12px">
                      {transaction.against_fiat.short_symbol}{" "}
                      {formatNumber(transaction.cost, "quantity")}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontSize="12px">
                      {transaction.against_fiat.short_symbol}{" "}
                      {formatNumber(transaction.total_cost, "quantity")}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontSize="12px">
                      {transaction.against_fiat.short_symbol}{" "}
                      {formatNumber(transaction.average_cost, "quantity")}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      sx={{
                        pl: "4px",
                        pr: "4px",
                        backgroundColor:
                          transaction.capital_gain < 0
                            ? "error.light"
                            : transaction.capital_gain > 0
                            ? "success.light"
                            : "", // No background color if the capital gain is 0
                        color:
                          transaction.capital_gain < 0
                            ? "error.main"
                            : transaction.capital_gain > 0
                            ? "success.main"
                            : "",
                      }}
                      size="small"
                      label={formatNumber(transaction.capital_gain, "currency")}
                    ></Chip>
                  </TableCell>
                  <TableCell>
                    <Box display="flex">
                      <Box>
                        <Typography fontSize="12px">
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
