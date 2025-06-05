import React from "react";

import { formatNumber } from "@/lib/format";
import { Wallet } from "@/lib/definition";
import { Add, Edit, EventRepeat, Refresh, Visibility } from "@mui/icons-material";
import { Download } from "@mui/icons-material";
import { Delete } from "@mui/icons-material";
import { deleteWallet, downloadWallet, refreshWallet, refreshFullWallet } from "@/lib/actions";
import { DataGrid, GridActionsCellItem, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import BasicCard from "../shared/BasicCard";
import AddressCell from "./AddressCell";
import { Badge1 } from "@/components/BadgeCustom";
import { Heading } from "@/components/Heading";
import { DataTable } from "@/components/ui/data-table-wallet/DataTable";
import { getColumns } from "@/components/ui/data-table-wallet/columns";

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
  onWalletClick: () => void;
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
  onWalletClick,
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

  // Handle navigation to wallet details
  const handleNavigateToDetails = (selectedWalletId: string) => {
    if (selectedWalletId !== null) {
      window.location.href = `/overview/wallets/${selectedWalletId}/positions`;
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

  function renderGreyString(params: GridRenderCellParams<any, string, any>) {
    const input = params.value ?? "";
    return <Heading variant="body">{input}</Heading>;
  }

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
      <>
        {isZero(amount) ? (
          <Heading variant="body2">—{/* em-dash improves readability */}</Heading>
        ) : (
          <Badge1 label={formatNumber(amount, type)} color={amount < 0 ? "error" : amount > 0 ? "success" : "neutral"} />
        )}
      </>
    );
  }

  function renderGreyNumber(amount: number, type: "currency" | "quantity_precise" | "quantity" | "percentage") {
    if (isZero(amount)) {
      return <Heading variant="body2">—</Heading>;
    }
    return <Heading variant="body2">{formatNumber(amount, type)}</Heading>;
  }

  const column_old: GridColDef[] = [
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
      renderCell: (params) => (params.value ? <AddressCell address={params.value} /> : ""),
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

  const columns = getColumns({
      onEditClick: (row) => {
        // setRow(row)
        // setIsOpen(true)
      },
    })

  return (
    <BasicCard title="Wallet Overview" subtitle="Track balances, performance, and key metrics across your wallets">
      <DataTable data={wallets} columns={columns} />
      {/* <DataGrid
        checkboxSelection
        rows={wallets}
        columns={columns}
        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd")}
        pagination
        pageSizeOptions={[10, 25, 50]}
        rowCount={totalCount}
        paginationModel={{ page: page, pageSize: rowsPerPage }}
        onPaginationModelChange={handlePaginationModelChange}
        onRowClick={() => {
          onWalletClick();
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
      /> */}
    </BasicCard>
  );
};

export default WalletTable;
