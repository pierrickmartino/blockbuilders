import React, { Fragment } from "react";

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
  Download,
} from "@mui/icons-material";
import {
  downloadContractInfo,
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
  onContractInfoDownloaded: (response: string) => void;
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
  onContractInfoDownloaded,
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

  const handleContractInfoDownload = async (contract_id: string) => {
    if (contract_id !== null) {
      const response = await downloadContractInfo(contract_id.toString());
      if (response.task_id) {
        onContractInfoDownloaded(response.task_id); // Notify the parent component with the task ID
      } else {
        console.error("Error: Task ID not found in the response.");
      }
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
        <Typography
          color="textSecondary"
          sx={{ lineHeight: "inherit", fontSize: "0.79rem" }}
        >
          {formatNumber(input, type)}
        </Typography>
      </Box>
    );
  }

  function renderGain(gain: number, gain_amount: number) {
    if (gain != 0 || gain_amount != 0) {
      return (
        <Chip
          label={`${formatNumber(gain_amount, "currency")} (${formatNumber(
            gain,
            "percentage"
          )})`}
          color={gain < 0 || gain_amount < 0 ? "error" : gain > 0 || gain_amount > 0 ? "success" : "default"}
          size="small"
        />
      );
    } else {
      return <Fragment></Fragment>;
    }
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
    blockchain_name: string,
    blockchain_icon: string,
    token_icon: string
  ) {
    return (
      <Stack alignItems="center" direction="row" spacing={2}>
        <Avatar
          alt={blockchain_name}
          sx={{ width: 24, height: 24 }}
          src={token_icon || `/images/logos/${blockchain_icon}`}
        />
        <Typography sx={{ lineHeight: "inherit" }}>
          {truncateText(token_symbol, 8)}
        </Typography>
      </Stack>
    );
  }

  function renderTokenName(token_name: string) {
    return (
      <Typography
        color="textSecondary"
        sx={{ lineHeight: "inherit", fontSize: "0.79rem" }}
      >
        {truncateText(token_name, 22)}
      </Typography>
    );
  }

  function renderPrice(price: string, daily_price_delta: number) {
    return (
      <Stack
        alignItems="baseline"
        justifyContent="flex-end"
        direction="row"
        spacing={1}
      >
        <Typography
          color="textSecondary"
          sx={{ lineHeight: "inherit", fontSize: "0.79rem" }}
        >
          {formatNumber(price, "currency")}
        </Typography>
        <Typography
          color={
            daily_price_delta < 0
              ? "error"
              : daily_price_delta > 0
              ? "success"
              : "textSecondary"
          }
          sx={{ lineHeight: "inherit", fontSize: "0.725rem" }}
        >
          ({formatNumber(daily_price_delta, "percentage")})
        </Typography>
      </Stack>
    );
  }

  function renderAmount(amount: number, percentage: number) {
    return (
      <Stack
        alignItems="baseline"
        justifyContent="flex-end"
        direction="row"
        spacing={1}
      >
        <Typography
          color="textSecondary"
          sx={{ lineHeight: "inherit", fontSize: "0.79rem" }}
        >
          {formatNumber(amount, "currency")}
        </Typography>
        <Typography
          color="textSecondary"
          sx={{ lineHeight: "inherit", fontSize: "0.725rem" }}
        >
          ({formatNumber(percentage, "percentage")})
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
      flex: 1,
      minWidth: 150,
      renderCell: (params) =>
        renderToken(
          params.row.contract.symbol,
          params.row.contract.blockchain.name,
          params.row.contract.blockchain.icon,
          params.row.contract.logo_uri
        ),
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1.2,
      minWidth: 150,
      renderCell: (params) => renderTokenName(params.row.contract.name),
    },
    // {
    //   field: "daily_price_delta",
    //   headerName: "Perf Daily",
    //   headerAlign: "right",
    //   align: "right",
    //   flex: 0.8,
    //   minWidth: 100,
    //   renderCell: (params) => renderChipAmount(params.value, "percentage"),
    // },
    {
      field: "price",
      headerName: "Price / Delta",
      headerAlign: "right",
      align: "right",
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) =>
        renderPrice(params.row.contract.price, params.row.daily_price_delta),
      // renderGreyNumber(params.row.contract.price, "currency"),
    },
    {
      field: "quantity",
      headerName: "Quantity",
      headerAlign: "right",
      type: "number",
      align: "right",
      flex: 0.8,
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
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) =>
        // renderAmount(params.row.amount, params.row.progress_percentage),
        renderGreyNumber(params.value, "currency"),
    },
    {
      field: "progress_percentage",
      headerName: "Percentage",
      headerAlign: "right",
      type: "number",
      align: "right",
      flex: 0.6,
      minWidth: 100,
      renderCell: (params) => renderGreyNumber(params.value, "percentage"),
    },
    {
      field: "capital_gain",
      headerName: "Capital Gain",
      headerAlign: "right",
      align: "right",
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => {
        const capitalGain = Number(params.row.capital_gain) || 0; // Default to 0 if invalid
        return renderGain(
          0,
          capitalGain === 0 ? 0 : capitalGain
        );
      }
    },
    {
      field: "unrealized_gain",
      headerName: "Unrealized Gain",
      headerAlign: "right",
      align: "right",
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => {
        console.log("symbol:", params.row.contract.symbol);
        console.log("unrealized_gain:", params.row.unrealized_gain);
        console.log("price:", params.row.contract.price);
        console.log("average_cost:", params.row.average_cost);
        console.log("quantity:", params.row.quantity);

        const unrealizedGain = Number(params.row.unrealized_gain) || 0; // Default to 0 if invalid
        const averageCost = Number(params.row.average_cost) || 0; // Default to 0 if invalid
        const price = Number(params.row.contract.price) || 0; // Default to 0 if invalid
        const quantity = Number(params.row.quantity) || 0; // Default to 0 if invalid

        return renderGain(
          unrealizedGain,
          unrealizedGain === 0 ? 0 : (price - averageCost) * quantity
        );
      },
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
        <GridActionsCellItem
          key="contract-download-info"
          label="Download info"
          icon={<Download fontSize="small" />}
          onClick={() =>
            handleContractInfoDownload(cell.row.contract.id.toString())
          }
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
