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
  Menu,
  MenuItem,
  ListItemIcon,
  TablePagination,
} from "@mui/material";
import DashboardCard from "../shared/DashboardCard";
import formatNumber from "@/app/utils/formatNumber";
import { IconDotsVertical } from "@tabler/icons-react";
import { Wallet } from "@/app/lib/definition";
import { EventRepeat, Refresh } from "@mui/icons-material";
import { Download } from "@mui/icons-material";
import { Delete } from "@mui/icons-material";
import { Visibility } from "@mui/icons-material";
import {
  deleteWallet,
  downloadWallet,
  refreshWallet,
  refreshFullWallet,
} from "@/app/lib/actions";

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
}) => {
  const walletMenuItems = [
    {
      title: "See details",
      key: "wallet-details",
      value: "wallet-details",
      button: <Visibility fontSize="small" />,
    },
    {
      title: "Download history",
      key: "wallet-download",
      value: "wallet-download",
      button: <Download fontSize="small" />,
    },
    {
      title: "Refresh price",
      key: "wallet-refresh",
      value: "wallet-refresh",
      button: <Refresh fontSize="small" />,
    },
    {
      title: "Full refresh",
      key: "wallet-refresh-full",
      value: "wallet-refresh-full",
      button: <EventRepeat fontSize="small" />,
    },
    {
      title: "Delete wallet",
      key: "wallet-delete",
      value: "wallet-delete",
      button: <Delete fontSize="small" />,
    },
  ];
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null); // Add state to track wallet ID
  const open = Boolean(anchorEl);

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    wallet_id: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedWalletId(wallet_id);
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
    setSelectedWalletId(null);
  };

  // Handle navigation to wallet details
  const handleNavigateToDetails = () => {
    if (selectedWalletId !== null) {
      window.location.href = `/dashboard/wallets/${selectedWalletId}/positions`;
    }
  };

  // Handle navigation to wallet details
  const handleDeletion = async () => {
    if (selectedWalletId !== null) {
      const response = await deleteWallet(selectedWalletId.toString());
      if (response.message !== "Database Error: Failed to delete wallet.") {
        onWalletDeleted(); // Notify parent to refresh wallets
      }
    }
  };

  const handleDownload = async () => {
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

  const handleRefresh = async () => {
    if (selectedWalletId !== null) {
      const response = await refreshWallet(selectedWalletId.toString());
      if (response.task_id) {
        onWalletRefreshed(response.task_id); // Notify the parent component with the task ID
      } else {
        console.error("Error: Task ID not found in the response.");
      }
    }
  };

  const handleRefreshFull = async () => {
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

  return (
    <DashboardCard title="Wallet Overview" subtitle="Track balances, performance, and key metrics across your wallets">
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
            sx={{
              whiteSpace: "nowrap",
              mt: 0,
            }}
          >
            <TableHead>
              <TableRow>
                {/* <TableCell>
                  <Typography color="textSecondary" variant="h6">
                    Id
                  </Typography>
                </TableCell> */}
                <TableCell>
                  <Typography color="textSecondary" variant="h6">
                    Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="h6">
                    Address
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography color="textSecondary" variant="h6">
                    Balance
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography color="textSecondary" variant="h6">
                    Capital Gain
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
              {wallets.map((wallet: Wallet) => (
                <TableRow key={wallet.id}>
                  {/* <TableCell>
                    <Typography fontSize="14px" fontWeight={500}>
                      {wallet.id}
                    </Typography>
                  </TableCell> */}
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Box>
                        <Typography fontSize="14px" fontWeight={600}>
                          {wallet.name}
                        </Typography>
                        <Typography color="textSecondary" fontSize="13px">
                          {wallet.description}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Box>
                        <Typography fontSize="14px">
                        {truncateText(wallet.address, 25)} 
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontSize="14px">
                      {formatNumber(wallet.balance, "currency")}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      sx={{
                        pl: "4px",
                        pr: "4px",
                        backgroundColor:
                          wallet.capital_gain < 0
                            ? "error.main"
                            : wallet.capital_gain > 0
                            ? "success.main"
                            : "", // No background color if the capital gain is 0
                        color: "#fff",
                      }}
                      size="small"
                      label={formatNumber(wallet.capital_gain, "currency")}
                    ></Chip>
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      sx={{
                        pl: "4px",
                        pr: "4px",
                        backgroundColor:
                          wallet.unrealized_gain < 0
                            ? "error.main"
                            : wallet.unrealized_gain > 0
                            ? "success.main"
                            : "", // No background color if the capital gain is 0
                        color: "#fff",
                      }}
                      size="small"
                      label={formatNumber(wallet.unrealized_gain, "percentage")}
                    ></Chip>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      id="basic-button"
                      aria-controls={open ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      onClick={(event) => handleClick(event, wallet.id)}
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
                      {walletMenuItems.map((item) => (
                        <MenuItem
                          onClick={() => {
                            handleClose();
                            if (item.key === "wallet-details") {
                              handleNavigateToDetails();
                            }
                            if (item.key === "wallet-delete") {
                              handleDeletion();
                            }
                            if (item.key === "wallet-download") {
                              handleDownload();
                            }
                            if (item.key === "wallet-refresh") {
                              handleRefresh();
                            }
                            if (item.key === "wallet-refresh-full") {
                              handleRefreshFull();
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
          rowsPerPageOptions={[5, 10]}
          count={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </DashboardCard>
  );
};

export default WalletTable;
