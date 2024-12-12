import React, { Fragment } from "react";

import { Typography, Box, Stack, Button, Chip } from "@mui/material";
import formatNumber from "@/app/utils/formatNumber";
import formatDate from "@/app/utils/formatDate";
import { Transaction } from "../../../lib/definition";
import { Add, Download, Link as LinkIcon, Remove, TrendingDown, TrendingUp } from "@mui/icons-material";
import { exportTransactions } from "@/app/lib/export-transaction";
import { saveAs } from "file-saver";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import BasicCard from "../shared/BasicCard";
import capitalizeFirstLetter from "@/app/utils/capitalizeFirstLetter";

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
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: rowsPerPage,
    page: page,
  });

  const handlePaginationModelChange = (model: {
    page: number;
    pageSize: number;
  }) => {
    // console.log(
    //   "Child paginationModelChange:",
    //   model.page,
    //   "PageSize:",
    //   model.pageSize
    // );
    setPaginationModel(model);
    if (model.page !== page) {
      onPageChange(model.page); // Notify parent of page change
    }
    if (model.pageSize !== rowsPerPage) {
      onRowsPerPageChange(model.pageSize); // Notify parent of rows per page change
    }
  };

  const handleNavigateToExplorer = (url: string, id: string) => {
    window.location.href = `${url}${id}`;
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

  function renderGreyNumber(
    amount: number,
    type: "currency" | "quantity_precise" | "quantity" | "percentage"
  ) {
    const input = amount ?? "";
    return (
      <Box>
        <Typography color="textSecondary" sx={{ lineHeight: "inherit" }}>
          {formatNumber(input, type)}
        </Typography>
      </Box>
    );
  }

  function renderGreyDate(date: string) {
    const input = date ?? "";
    return (
      <Box>
        <Typography color="textSecondary" sx={{ lineHeight: "inherit" }}>
          {formatDate(input)}
        </Typography>
      </Box>
    );
  }

  function renderPosition(
    contract_symbol: string,
    against_contract_symbol?: string
  ) {
    return (
      <Stack alignItems="center" direction="row" spacing={2}>
        <Typography sx={{ lineHeight: "inherit" }}>
          {contract_symbol}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
          sx={{ lineHeight: "inherit" }}
        >
          {against_contract_symbol || ""}
        </Typography>
      </Stack>
    );
  }

  function renderStatus(
    status_label: string,
    status_value: number
  ) {

    const label = status_label == "close" || status_label == "open" ? capitalizeFirstLetter(status_label) : formatNumber(status_value, "percentage")
    const sign = status_label == "diminution" ? "-" : status_label == "increase" ? "+" : ""
    const color = status_label == "close" || status_label == "diminution" ? "error" : status_label == "open" || status_label == "increase" ? "success" : "default"

    return (
      <Chip
        // {...(status_label === "increase" && { icon: <TrendingUp /> })}
        // {...(status_label === "diminution" && { icon: <TrendingDown /> })}
        label={sign + " " + label}
        color={color}
        size="small"
      />
    );
  }

  const columns: GridColDef[] = [
    {
      field: "position",
      headerName: "Position",
      flex: 1,
      minWidth: 100,
      renderCell: (params) =>
        renderPosition(
          params.row.position.contract.symbol,
          params.row.against_contract?.symbol
        ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 100,
      renderCell: (params) =>
        renderStatus(
          params.row.status,
          params.row.status_value
        ),
    },
    {
      field: "quantity",
      headerName: "Quantity",
      headerAlign: "right",
      align: "right",
      flex: 1,
      minWidth: 100,
      renderCell: (params) =>
        renderGreyNumber(params.value, "quantity_precise"),
    },
    {
      field: "running_quantity",
      headerName: "Running Qty",
      headerAlign: "right",
      align: "right",
      flex: 1,
      minWidth: 100,
      renderCell: (params) =>
        renderGreyNumber(params.value, "quantity_precise"),
    },
    {
      field: "price",
      headerName: "Price",
      headerAlign: "right",
      align: "right",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => renderGreyNumber(params.value, "currency"),
    },
    {
      field: "cost",
      headerName: "Cost",
      headerAlign: "right",
      align: "right",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => renderGreyNumber(params.value, "currency"),
    },
    {
      field: "total_cost",
      headerName: "Total Cost",
      headerAlign: "right",
      align: "right",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => renderGreyNumber(params.value, "currency"),
    },
    {
      field: "average_cost",
      headerName: "Avg Cost",
      headerAlign: "right",
      align: "right",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => renderGreyNumber(params.value, "currency"),
    },
    {
      field: "capital_gain",
      headerName: "Capital Gain",
      headerAlign: "right",
      align: "right",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => renderChipAmount(params.value, "currency"),
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1.5,
      minWidth: 150,
      renderCell: (params) => renderGreyDate(params.value),
    },
    {
      field: "actions",
      type: "actions",
      width: 70,
      getActions: (cell) => [
        <GridActionsCellItem
          key="transaction-explorer"
          label="See explorer"
          icon={<LinkIcon fontSize="small" />}
          onClick={() =>
            handleNavigateToExplorer(
              cell.row.position.contract.blockchain.transaction_link,
              cell.row.hash
            )
          }
          showInMenu
        />,
      ],
    },
  ];

  const action = (
    <Fragment>
      <Button
        variant="contained"
        size="small"
        color="secondary"
        startIcon={<Download />}
        onClick={() => {
          handleExportTransactions(transactions[0].position.id);
        }}
      >
        Export
      </Button>
    </Fragment>
  );

  return (
    <BasicCard
      title="Transaction History"
      subtitle="A detailed log of all recent transactions and movements"
      action={action}
    >
      <DataGrid
        checkboxSelection
        rows={transactions}
        columns={columns}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        pagination
        pageSizeOptions={[10, 25, 50]}
        rowCount={totalCount}
        paginationModel={{ page: page, pageSize: rowsPerPage }}
        onPaginationModelChange={handlePaginationModelChange}
        paginationMode="server"
        disableColumnResize
        disableColumnSorting
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
    </BasicCard>
  );
};

export default TransactionTable;
