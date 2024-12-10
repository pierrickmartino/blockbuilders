import React, { useState } from "react";

import {
  Typography,
  Chip,
  Checkbox,
  Avatar,
  Stack,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import formatNumber from "@/app/utils/formatNumber";
import { Position, Wallet } from "../../../lib/definition";
import {
  CreditScore,
  Payment,
  ReportGmailerrorred,
  Visibility,
  Report,
  Edit,
} from "@mui/icons-material";
import {
  setContractAsStable,
  setContractAsSuspicious,
} from "@/app/lib/actions";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
} from "@mui/x-data-grid";

// Define the props type that will be passed into WalletTable
interface PositionTableProps {
  positions: Position[];
  wallet: Wallet;
  page: number;
  rowsPerPage: number;
  totalCount: number;
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
  onPageChange,
  onRowsPerPageChange,
  onContractSetAsSuspicious,
  onContractSetAsStable,
}) => {
  // useEffect(() => {
  //   console.log("Positions in PositionTable:", positions); // Log positions inside PositionTable
  // }, [positions]);

  const positionMenuItems = [
    {
      title: "See details",
      key: "position-details",
      value: "position-details",
      button: <Visibility fontSize="small" />,
    },
  ];

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(
    null
  );
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [checkedStable, setCheckedStable] = React.useState(true);
  const [checkedSuspicious, setCheckedSuspicious] = React.useState(true);
  const open = Boolean(anchorEl);

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    position_id: string,
    wallet_id: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedPositionId(position_id);
    setSelectedWalletId(wallet_id);
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

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedPositionId(null);
    setSelectedWalletId(null);
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
        <Typography color="textSecondary" sx={{ lineHeight: "inherit" }}>
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
        <Typography color="textSecondary" sx={{ lineHeight: "inherit" }}>
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
    <Card variant="outlined" sx={{ height: "100%", flexGrow: 1 }}>
      <CardContent>
        <Stack
          direction="column"
          sx={{ justifyContent: "space-between", flexGrow: 1, gap: 1 }}
        >
          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <Stack direction="column" sx={{ justifyContent: "space-between" }}>
              <Typography component="h2" variant="subtitle2" gutterBottom>
                Wallet Positions
              </Typography>

              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Detailed view of asset quantities and performance
              </Typography>
            </Stack>
          </Stack>
          <Box>
            <DataGrid
              checkboxSelection
              rows={positions}
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

export default PositionTable;
