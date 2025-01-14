import React, { Fragment } from "react";

import {
  Typography,
  Box,
  Chip,
  Button,
} from "@mui/material";
import formatNumber from "@/app/utils/formatNumber";
import { Wallet } from "@/app/lib/definition";
import { Add, Edit, EventRepeat, Refresh, Visibility } from "@mui/icons-material";
import { Download } from "@mui/icons-material";
import { Delete } from "@mui/icons-material";
import {
  deleteWallet,
  downloadWallet,
  refreshWallet,
  refreshFullWallet,
} from "@/app/lib/actions";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import BasicCard from "../shared/BasicCard";

// Define the props type that will be passed into WalletTable
interface WalletTableProps {
  wallets: Wallet[];
  page: number;
  rowsPerPage: number;
  totalCount: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  onWalletDeleted: () => void;
  onWalletDownloaded: (response: string) => void;
  onWalletRefreshed: (response: string) => void;
  onWalletFullRefreshed: (response: string) => void;
  onCreateWallet: () => void;
}

const WalletTable: React.FC<WalletTableProps> = ({
  wallets,
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  onWalletDeleted,
  onWalletDownloaded,
  onWalletRefreshed,
  onWalletFullRefreshed,
  onCreateWallet,
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

  // Handle navigation to wallet details
  const handleNavigateToDetails = (selectedWalletId: string) => {
    if (selectedWalletId !== null) {
      window.location.href = `/dashboard/wallets/${selectedWalletId}/positions`;
    }
  };

  // Handle navigation to wallet details
  const handleDeletion = async (selectedWalletId: string) => {
    if (selectedWalletId !== null) {
      const response = await deleteWallet(selectedWalletId.toString());
      if (response.message !== "Database Error: Failed to delete wallet.") {
        onWalletDeleted(); // Notify parent to refresh wallets
      }
    }
  };

  const handleDownload = async (selectedWalletId: string) => {
    if (selectedWalletId !== null) {
      const response = await downloadWallet(selectedWalletId.toString());
      if (response.task_id) {
        // console.log("Task triggered in handleDownload:", response.task_id);
        onWalletDownloaded(response.task_id); // Notify the parent component with the task ID
      } else {
        console.error("Error: Task ID not found in the response.");
      }
    }
  };

  const handleRefresh = async (selectedWalletId: string) => {
    if (selectedWalletId !== null) {
      const response = await refreshWallet(selectedWalletId.toString());
      if (response.task_id) {
        onWalletRefreshed(response.task_id); // Notify the parent component with the task ID
      } else {
        console.error("Error: Task ID not found in the response.");
      }
    }
  };

  const handleRefreshFull = async (selectedWalletId: string) => {
    if (selectedWalletId !== null) {
      const response = await refreshFullWallet(selectedWalletId.toString());
      if (response.task_id) {
        onWalletFullRefreshed(response.task_id); // Notify the parent component with the task ID
      } else {
        console.error("Error: Task ID not found in the response.");
      }
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  function renderGreyString(params: GridRenderCellParams<any, string, any>) {
    const input = params.value ?? "";
    return (
      <Box>
        <Typography color="textSecondary" sx={{ lineHeight: "inherit", fontSize: "0.79rem" }}>
          {input}
        </Typography>
      </Box>
    );
  }

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
        <Typography
          color="textSecondary"
          sx={{ lineHeight: "inherit", fontSize: "0.79rem" }}
        >
          {formatNumber(input, type)}
        </Typography>
      </Box>
    );
  }

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    {
      field: "description",
      headerName: "Description",
      flex: 1.5,
      minWidth: 150,
      renderCell: renderGreyString,
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
      minWidth: 150,
      valueFormatter: (value?: string) => {
        if (!value || typeof value !== "string") {
          return value;
        }
        return `${truncateText(value, 15)}`;
      },
    },
    {
      field: "balance",
      headerName: "Balance",
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
      field: "unrealized_gain",
      headerName: "Unrealized Gain",
      headerAlign: "right",
      align: "right",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => renderChipAmount(params.value, "percentage"),
    },
    {
      field: "actions",
      type: "actions",
      width: 100,
      getActions: (cell) => [
        <GridActionsCellItem
          key="wallet-details"
          label="See details"
          icon={<Visibility fontSize="small" />}
          onClick={() => handleNavigateToDetails(cell.id.toString())}
          showInMenu
        />,
        // <GridActionsCellItem
        //   label="Edit wallet"
        //   onClick={() => openPickModal(cell.row)}
        //   showInMenu
        // />,
        <GridActionsCellItem
          key="wallet-download"
          label="Download history"
          icon={<Download fontSize="small" />}
          onClick={() => handleDownload(cell.id.toString())}
          showInMenu
        />,
        <GridActionsCellItem
          key="wallet-refresh"
          label="Refresh price"
          icon={<Refresh fontSize="small" />}
          onClick={() => handleRefresh(cell.id.toString())}
          showInMenu
        />,
        <GridActionsCellItem
          key="wallet-refresh-full"
          label="Full refresh"
          icon={<EventRepeat fontSize="small" />}
          onClick={() => handleRefreshFull(cell.id.toString())}
          showInMenu
        />,
        <GridActionsCellItem
          key="wallet-delete"
          label="Delete wallet"
          icon={<Delete fontSize="small" />}
          onClick={() => handleDeletion(cell.id.toString())}
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
        startIcon={<Add />}
        onClick={() => {
          onCreateWallet();
        }}
      >
        Add wallet
      </Button>
    </Fragment>
  );

  return (
    <BasicCard
      title="Wallet Overview"
      subtitle="Track balances, performance, and key metrics across your wallets"
      action={action}
    >
      <DataGrid
        checkboxSelection
        rows={wallets}
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

export default WalletTable;
