import React, { useState } from "react";

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
  ListItemIcon,
  Menu,
  MenuItem,
  TablePagination,
  Checkbox,
} from "@mui/material";
import BaseCard from "../shared/DashboardCard";
import formatNumber from "@/app/utils/formatNumber";
import { Position } from "../../../lib/definition";
import { IconDotsVertical } from "@tabler/icons-react";
import {
  CreditScore,
  Payment,
  ReportGmailerrorred,
  Visibility,
  Report,
} from "@mui/icons-material";
import {
  setContractAsStable,
  setContractAsSuspicious,
} from "@/app/lib/actions";

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
  const handleNavigateToDetails = () => {
    if (selectedPositionId !== null) {
      window.location.href = `/dashboard/wallets/${selectedWalletId}/positions/${selectedPositionId}/transactions`;
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <BaseCard title="Position Table">
      <>
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
                    Token
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="h6">
                    Perf
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="h6">
                    Price
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="h6">
                    Quantity
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="h6">
                    Amount
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography color="textSecondary" variant="h6">
                    Realized
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography color="textSecondary" variant="h6">
                    UnRealized
                  </Typography>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {positions.map((position: Position) => (
                <TableRow key={position.id}>
                  <TableCell>
                    <Typography fontSize="14px">
                      {truncateText(position.contract.symbol, 8)} -{" "}
                      {truncateText(position.contract.name, 20)}
                    </Typography>
                    <Typography fontSize="12px">
                      {position.contract.category}
                    </Typography>
                    <Typography fontSize="12px">
                      {position.contract.blockchain.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex">
                      <Box>
                        <Typography fontSize="12px">
                          {formatNumber(position.daily_price_delta, "percentage")}
                        </Typography>
                        <Typography fontSize="12px">
                          {formatNumber(position.weekly_price_delta, "percentage")}
                        </Typography>
                        <Typography fontSize="12px">
                          {formatNumber(position.monthly_price_delta, "percentage")}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box display="flex" alignItems="right">
                      <Box>
                        <Typography fontSize="12px">
                          {formatNumber(position.contract.price, "quantity")}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex">
                      <Box>
                        <Typography fontSize="12px">
                          {formatNumber(position.quantity, "quantity_precise")}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex">
                      <Box>
                        <Typography fontSize="12px">
                          {formatNumber(position.amount, "currency")}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      sx={{
                        pl: "4px",
                        pr: "4px",
                        backgroundColor: "",
                        // wallet.realized_color,
                        color: "#fff",
                      }}
                      size="small"
                      label={formatNumber(position.capital_gain, "currency")}
                    ></Chip>
                  </TableCell>
                  <TableCell>
                    <Chip
                      sx={{
                        pl: "4px",
                        pr: "4px",
                        backgroundColor: "",
                        // backgroundColor: wallet.unrealized_color,
                        color: "#fff",
                      }}
                      size="small"
                      label={formatNumber(position.unrealized_gain, "percentage")}
                    ></Chip>
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
                      {positionMenuItems.map((item) => (
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
                      ))}
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
      </>
    </BaseCard>
  );
};

export default PositionTable;
