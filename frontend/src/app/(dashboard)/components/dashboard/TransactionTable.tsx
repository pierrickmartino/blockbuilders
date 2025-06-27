import React, { Fragment } from "react";

import { Box, Stack, Tooltip } from "@mui/material";
import { formatNumber, formatDate, capitalizeFirstLetter } from "@/lib/format";
import { Transaction } from "../../../../lib/definition";
import { Link as LinkIcon } from "@mui/icons-material";
import { exportTransactions } from "@/lib/export-transaction";
import { saveAs } from "file-saver";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import BasicCard from "../shared/BasicCard";
import { Button } from "@/components/Button";

import { formatDistanceToNow, format } from "date-fns";
import { Badge1 } from "@/components/BadgeCustom";
import { Heading } from "@/components/Heading";

// Define the props type that will be passed into TransactionTable
interface TransactionTableProps {
  transactions: Transaction[];
  page: number;
  rowsPerPage: number;
  totalCount: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  onTransactionClick: () => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  onTransactionClick,
}) => {
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: rowsPerPage,
    page: page,
  });

  const handlePaginationModelChange = (model: { page: number; pageSize: number }) => {
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
        saveAs(blob, `transactions_${new Date().toISOString().replace(/[:.-]/g, "")}.csv`);
      } catch (error) {
        console.error("An error occurred while exporting transactions:", error);
      }
    } else {
      console.error("No position ID provided to export transactions");
    }
  };

  const isZero = (n: number | null | undefined) => Number(n) === 0;
  const cellWrapperSx = {
    width: "100%",
    height: "100%", // occupy full cell height
    display: "flex",
    alignItems: "center", // vertical centering ✅
    justifyContent: "flex-end", // keep numbers/chips right-aligned
  };

  function renderChipAmount(amount: number, type: "currency" | "quantity_precise" | "quantity" | "percentage") {
    return (
      <Box sx={cellWrapperSx}>
        {isZero(amount) ? (
          <Heading variant="body2">—{/* em-dash improves readability */}</Heading>
        ) : (
          <Badge1 label={formatNumber(amount, type)} color={amount < 0 ? "error" : amount > 0 ? "success" : "neutral"} />
        )}
      </Box>
    );
  }

  function renderGreyNumber(amount: number, type: "currency" | "quantity_precise" | "quantity" | "percentage") {
    const input = amount ?? "";
    return (
      <Box>
        <Heading variant="body2">{formatNumber(input, type)}</Heading>
      </Box>
    );
  }

  function renderGreyDate(date: string) {
    const input = date ?? "";
    return (
      <Box>
        <Tooltip title={format(new Date(input), "PPpp")}>
          <Heading variant="body2">{formatDistanceToNow(new Date(input), { addSuffix: true })}</Heading>
        </Tooltip>
      </Box>
    );
  }

  function renderPosition(contract_symbol: string, against_contract_symbol?: string) {
    return (
      <Stack alignItems="center" direction="row" spacing={2}>
        <Heading variant="body">{contract_symbol}</Heading>
        <Heading variant="body2">{against_contract_symbol || ""}</Heading>
      </Stack>
    );
  }

  function renderStatus(status_label: string, status_value: number) {
    const label =
      status_label == "close" || status_label == "open" ? capitalizeFirstLetter(status_label) : formatNumber(status_value, "percentage");
    const sign = status_label == "diminution" ? "-" : status_label == "increase" ? "+" : "";
    const color =
      status_label == "close" || status_label == "diminution"
        ? "error"
        : status_label == "open" || status_label == "increase"
        ? "success"
        : "neutral";

    return (
      <Box sx={cellWrapperSx}>
        <Badge1
          // {...(status_label === "increase" && { icon: <TrendingUp /> })}
          // {...(status_label === "diminution" && { icon: <TrendingDown /> })}
          label={sign + " " + label}
          color={color}
        />
      </Box>
    );
  }

  const columns: GridColDef[] = [
    {
      field: "position",
      headerName: "Position",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => renderPosition(params.row.position.contract.symbol, params.row.against_contract?.symbol),
    },
    {
      field: "status",
      headerName: "Status",
      headerAlign: "right",
      align: "right",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => renderStatus(params.row.status, params.row.status_value),
    },
    {
      field: "quantity",
      headerName: "Quantity",
      headerAlign: "right",
      align: "right",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => renderGreyNumber(params.value, "quantity_precise"),
    },
    {
      field: "running_quantity",
      headerName: "Running Qty",
      headerAlign: "right",
      align: "right",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => renderGreyNumber(params.value, "quantity_precise"),
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
      flex: 1.2,
      minWidth: 120,
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
          onClick={() => handleNavigateToExplorer(cell.row.position.contract.blockchain.transaction_link, cell.row.hash)}
          showInMenu
        />,
      ],
    },
  ];

  const action = (
    <Fragment>
      <Button
        variant="secondary"
        className="text-sm h-9"
        onClick={() => {
          handleExportTransactions(transactions[0].position.id);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-3.5 h-3.5 me-2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
          />
        </svg>
        Export
      </Button>
    </Fragment>
  );

  return (
    <BasicCard title="Transaction History" subtitle="A detailed log of all recent transactions and movements" action={action}>
      <DataGrid
        checkboxSelection
        rows={transactions}
        columns={columns}
        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd")}
        pagination
        pageSizeOptions={[10, 25, 50]}
        rowCount={totalCount}
        paginationModel={{ page: page, pageSize: rowsPerPage }}
        onPaginationModelChange={handlePaginationModelChange}
        onRowClick={() => {
          onTransactionClick();
        }}
        paginationMode="server"
        disableColumnResize
        disableColumnSorting
        disableRowSelectionOnClick
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
