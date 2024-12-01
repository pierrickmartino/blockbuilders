import React, { Fragment, useState } from "react";

import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  TableContainer,
  IconButton,
  Menu,
  TablePagination,
  Checkbox,
  Avatar,
  Stack,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import formatNumber from "@/app/utils/formatNumber";
import { Position } from "../../../lib/definition";
import { IconDotsVertical } from "@tabler/icons-react";
import {
  CreditScore,
  Payment,
  ReportGmailerrorred,
  Visibility,
  Report,
  ArrowDropDown,
  ArrowDropUp,
  Edit,
} from "@mui/icons-material";
import {
  setContractAsStable,
  setContractAsSuspicious,
} from "@/app/lib/actions";
import PerformanceChip from "../../ui-components/chips/PerformanceChip";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";

// Define the props type that will be passed into WalletTable
interface PositionTableProps {
  positions: Position[];
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
  const handleNavigateToDetails = (selectedWalletId: string) => {
    if (selectedPositionId !== null) {
      window.location.href = `/dashboard/wallets/${selectedWalletId}/positions/${selectedPositionId}/transactions`;
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
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
    { field: "token", headerName: "Token", flex: 1.5, minWidth: 150 },
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
    },
    {
      field: "quantity",
      headerName: "Quantity",
      headerAlign: "right",
      align: "right",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "amount",
      headerName: "Amount",
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
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Wallet Positions
        </Typography>
        <Stack
          direction="column"
          sx={{ justifyContent: "space-between", flexGrow: "1", gap: 1 }}
        >
          <Stack sx={{ justifyContent: "space-between" }}>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Track balances, performance, and key metrics across your wallets
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
                      <Typography variant="h6">Token</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6">Perf Daily</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6">Price</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6">Quantity</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6">Amount</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6">Capital Gain</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6">UnRealized</Typography>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {positions.map((position: Position) => (
                    <TableRow key={position.id}>
                      <TableCell>
                        <Stack direction="row" spacing={2}>
                          <Avatar
                            alt={position.contract.blockchain.name}
                            sx={{ width: 24, height: 24 }}
                            src={
                              "/images/logos/" +
                              position.contract.blockchain.icon
                            }
                          />
                          <Stack>
                            <Typography>
                              {truncateText(position.contract.symbol, 8)}
                            </Typography>
                            <Typography color="textSecondary">
                              {truncateText(position.contract.name, 18)}
                            </Typography>
                          </Stack>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <PerformanceChip
                          input={position.daily_price_delta}
                          type="percentage"
                          icon={
                            position.daily_price_delta < 0 ? (
                              <ArrowDropDown />
                            ) : position.daily_price_delta > 0 ? (
                              <ArrowDropUp />
                            ) : (
                              <Fragment></Fragment>
                            )
                          }
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography color="textSecondary">
                          {formatNumber(position.contract.price, "currency")}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography color="textSecondary">
                          {formatNumber(position.quantity, "quantity_precise")}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography color="textSecondary">
                          {formatNumber(position.amount, "currency")}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <PerformanceChip
                          input={position.capital_gain}
                          type="currency"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <PerformanceChip
                          input={position.unrealized_gain}
                          type="percentage"
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          icon={<Payment />}
                          checkedIcon={<CreditScore />}
                          checked={position.contract.category === "stable"}
                          onChange={(event) =>
                            handleChangeStable(event, position.contract.id)
                          }
                        />
                        <Checkbox
                          icon={<ReportGmailerrorred />}
                          checkedIcon={<Report />}
                          checked={position.contract.category === "suspicious"}
                          onChange={(event) =>
                            handleChangeSuspicious(event, position.contract.id)
                          }
                        />
                        <IconButton
                          id="basic-button"
                          aria-controls={open ? "basic-menu" : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? "true" : undefined}
                          onClick={(event) =>
                            handleClick(event, position.id, position.wallet.id)
                          }
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
                          {/* {positionMenuItems.map((item) => (
                        <MenuItem
                          onClick={() => {
                            handleClose();
                            if (item.key === "position-details") {
                              handleNavigateToDetails();
                            }
                          }}
                          key={item.key}
                          value={item.value}
                        >
                          <ListItemIcon>{item.button}</ListItemIcon>
                          {item.title}
                        </MenuItem>
                      ))} */}
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              rowsPerPageOptions={[5, 10, 25]}
              count={totalCount}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />

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
