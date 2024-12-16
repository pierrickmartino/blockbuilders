import React from "react";

import { Typography, Chip, Checkbox, Avatar, Stack, Box } from "@mui/material";
import formatNumber from "@/app/utils/formatNumber";
import { Position, Wallet } from "../../../lib/definition";
import {
  CreditScore,
  Payment,
  ReportGmailerrorred,
  // Visibility,
  Report,
  Edit,
} from "@mui/icons-material";
import {
  setContractAsStable,
  setContractAsSuspicious,
} from "@/app/lib/actions";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import BasicCard from "../shared/BasicCard";

// Define the props type that will be passed into WalletTable
interface PositionTableProps {
  positions: Position[];
  wallet: Wallet;
  page: number;
  rowsPerPage: number;
  totalCount: number;
  // isLoading: boolean;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  onContractSetAsSuspicious: () => void;
  onContractSetAsStable: () => void;
}

const PositionTable: React.FC<PositionTableProps> = ({
  positions,
  wallet,
  page,
  rowsPerPage,
  totalCount,
  // isLoading,
  onPageChange,
  onRowsPerPageChange,
  onContractSetAsSuspicious,
  onContractSetAsStable,
}) => {
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: rowsPerPage,
    page: page,
  });

  const [checkedStable, setCheckedStable] = React.useState(true);
  const [checkedSuspicious, setCheckedSuspicious] = React.useState(true);

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

  const handleChangeSuspicious = async (
    event: React.ChangeEvent<HTMLInputElement>,
    contract_id: string
  ) => {
    setCheckedSuspicious(event.target.checked);
    const response = await setContractAsSuspicious(contract_id.toString());
    if (
      response.message !==
      "Database Error: Failed to set contract as suspicious."
    ) {
      onContractSetAsSuspicious(); // Notify parent to refresh
    }
  };

  const handleChangeStable = async (
    event: React.ChangeEvent<HTMLInputElement>,
    contract_id: string
  ) => {
    setCheckedStable(event.target.checked);
    const response = await setContractAsStable(contract_id.toString());
    if (
      response.message !== "Database Error: Failed to set contract as stable."
    ) {
      onContractSetAsStable(); // Notify parent to refresh
    }
  };

  // Handle navigation to wallet details
  const handleNavigateToDetails = (selectedPositionId: string) => {
    if (selectedPositionId !== null) {
      window.location.href = `/dashboard/wallets/${wallet.id}/positions/${selectedPositionId}/transactions`;
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  function renderGreyNumber(
    amount: number,
    type: "currency" | "quantity_precise" | "quantity" | "percentage"
  ) {
    const input = amount ?? "";
    return (
      <Box>
        <Typography color="textSecondary" sx={{ lineHeight: "inherit", fontSize: "0.79rem"  }}>
          {formatNumber(input, type)}
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

  function renderToken(
    token_symbol: string,
    token_name: string,
    blockchain_name: string,
    blockchain_icon: string
  ) {
    return (
      <Stack alignItems="center" direction="row" spacing={2}>
        <Avatar
          alt={blockchain_name}
          sx={{ width: 24, height: 24 }}
          src={"/images/logos/" + blockchain_icon}
        />
        <Typography sx={{ lineHeight: "inherit" }}>
          {truncateText(token_symbol, 8)}
        </Typography>
        <Typography color="textSecondary" sx={{ lineHeight: "inherit", fontSize: "0.79rem" }}>
          {truncateText(token_name, 18)}
        </Typography>
      </Stack>
    );
  }

  function renderButtons(contract_category: string, contract_id: string) {
    return (
      <Stack height="100%" alignItems="center" direction="row" spacing={1}>
        <Checkbox
          icon={<Payment />}
          checkedIcon={<CreditScore />}
          checked={contract_category === "stable"}
          onChange={(event) => handleChangeStable(event, contract_id)}
        />
        <Checkbox
          icon={<ReportGmailerrorred />}
          checkedIcon={<Report />}
          checked={contract_category === "suspicious"}
          onChange={(event) => handleChangeSuspicious(event, contract_id)}
        />
      </Stack>
    );
  }

  const columns: GridColDef[] = [
    {
      field: "token",
      headerName: "Token",
      flex: 1.5,
      minWidth: 150,
      renderCell: (params) =>
        renderToken(
          params.row.contract.symbol,
          params.row.contract.name,
          params.row.contract.blockchain.name,
          params.row.contract.blockchain.icon
        ),
    },
    {
      field: "daily_price_delta",
      headerName: "Perf Daily",
      headerAlign: "right",
      align: "right",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => renderChipAmount(params.value, "percentage"),
    },
    {
      field: "price",
      headerName: "Price",
      headerAlign: "right",
      align: "right",
      flex: 1,
      minWidth: 100,
      renderCell: (params) =>
        renderGreyNumber(params.row.contract.price, "currency"),
    },
    {
      field: "quantity",
      headerName: "Quantity",
      headerAlign: "right",
      type: "number",
      align: "right",
      flex: 1,
      minWidth: 100,
      renderCell: (params) =>
        renderGreyNumber(params.value, "quantity_precise"),
    },
    {
      field: "amount",
      headerName: "Amount",
      headerAlign: "right",
      type: "number",
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
      field: "buttons",
      headerName: "",
      width: 70,
      renderCell: (params) =>
        renderButtons(params.row.contract.category, params.row.contract.id),
    },
    {
      field: "actions",
      type: "actions",
      width: 70,
      getActions: (cell) => [
        <GridActionsCellItem
          key="wallet-details"
          label="See details"
          icon={<Edit fontSize="small" />}
          onClick={() => handleNavigateToDetails(cell.id.toString())}
          showInMenu
        />,
      ],
    },
  ];

  return (
    <BasicCard
      title="Wallet Positions"
      subtitle="Detailed view of asset quantities and performance"
    >
      <DataGrid
        checkboxSelection
        rows={positions}
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

export default PositionTable;
