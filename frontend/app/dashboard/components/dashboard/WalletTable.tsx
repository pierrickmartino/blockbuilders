import React, { useEffect, useState } from "react";

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
  Pagination,
  TableFooter,
  TablePagination,
} from "@mui/material";
import BaseCard from "../shared/DashboardCard";
import { IconDotsVertical } from "@tabler/icons-react";
import { Wallet } from "@/app/lib/definition";
import { Refresh } from "@mui/icons-material";
import { Download } from "@mui/icons-material";
import { Delete } from "@mui/icons-material";
import { Visibility } from "@mui/icons-material";
import { deleteWallet, downloadWallet } from "@/app/lib/actions";

// Define the props type that will be passed into WalletTable
interface WalletTableProps {
  wallets: Wallet[];
  onWalletDeleted: () => void;
  onWalletDownloaded: (response: any) => void;
}

const WalletTable: React.FC<WalletTableProps> = ({
  wallets,
  onWalletDeleted,
  onWalletDownloaded,
}) => {
  const dummyMenuItems = [
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
      title: "Delete wallet",
      key: "wallet-delete",
      value: "wallet-delete",
      button: <Delete fontSize="small" />,
    },
  ];
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedWalletId, setSelectedWalletId] = useState<number | null>(null); // Add state to track wallet ID
  const open = Boolean(anchorEl);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    wallet_id: number
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedWalletId(wallet_id);
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  // Handle navigation to wallet details
  const handleDownload = async () => {
    if (selectedWalletId !== null) {
      const response = await downloadWallet(selectedWalletId.toString());
      if (response.message !== "Database Error: Failed to download wallet.") {
        onWalletDownloaded(response); // Notify parent to refresh wallets
      }
    }
  };

  return (
    <BaseCard title="Wallet Table">
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
                    Id
                  </Typography>
                </TableCell>
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
                    Realized Perf
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography color="textSecondary" variant="h6">
                    UnRealized Perf
                  </Typography>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {wallets.map((wallet: Wallet) => (
                <TableRow key={wallet.id}>
                  <TableCell>
                    <Typography fontSize="14px" fontWeight={500}>
                      {wallet.id}
                    </Typography>
                  </TableCell>
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
                          {wallet.address}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontSize="14px">${wallet.balance}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      sx={{
                        pl: "4px",
                        pr: "4px",
                        backgroundColor: "",
                        // wallet.realized_color,
                        color: "#fff",
                      }}
                      size="small"
                      label="0"
                      // label={wallet.realized}
                    ></Chip>
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      sx={{
                        pl: "4px",
                        pr: "4px",
                        backgroundColor: "",
                        // backgroundColor: wallet.unrealized_color,
                        color: "#fff",
                      }}
                      size="small"
                      label="0"
                      // label={wallet.unrealized}
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
                      {dummyMenuItems.map((item) => (
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
          count={10}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </>
    </BaseCard>
  );
};

export default WalletTable;

// const ProductPerfomance: React.FC<WalletInterfaceProps> = ({ backendName }) => {
//   const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
//   const [wallets, setWallets] = useState<Wallet[]>([]);
//   const [newWallet, setNewWallet] = useState({ name: '', address: '', description: '', balance: '' });
//   const [updateWallet, setUpdateWallet] = useState({ id: '', name: '', address: '', description: '', balance: '' });

//    // Fetch users
//    useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`${apiUrl}/api/wallets/`, {
//           headers: {
//             'Authorization': 'Token c40feb748f0e17b3d7472ed387a566e9d632d4c8',
//         }
//         });
//         const results = response.data.results || [];
//         setWallets(results.reverse());
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, [backendName, apiUrl]);

//   // Create a wallet
//   const createWallet = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(`${apiUrl}/api/wallets/`, newWallet);
//       setWallets([response.data, ...wallets]);
//       setNewWallet({ name: '', address: '', description: '', balance: '' });
//     } catch (error) {
//       console.error('Error creating wallet:', error);
//     }
//   };

//   // Update a wallet
//   const handleUpdateWallet = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       await axios.put(`${apiUrl}/api/wallets/${updateWallet.id}`, { name: updateWallet.name, address: updateWallet.address, description: updateWallet.description, balance:updateWallet.balance, });
//       setUpdateWallet({ id: '', name: '', address: '', balance: '', description: '' });
//       setWallets(
//         wallets.map((wallet) => {
//           if (wallet.id === updateWallet.id) {
//             return { ...wallet, name: updateWallet.name, address: updateWallet.address, description: updateWallet.description, balance:updateWallet.balance, };
//           }
//           return wallet;
//         })
//       );
//     } catch (error) {
//       console.error('Error updating user:', error);
//     }
//   };

//   // Delete a wallet
//   const deleteWallet = async (walletId: string) => {
//     try {
//       await axios.delete(`${apiUrl}/api/wallets/${walletId}`);
//       setWallets(wallets.filter((wallet) => wallet.id !== walletId));
//     } catch (error) {
//       console.error('Error deleting wallet:', error);
//     }
//   };

//   return (
//     <BaseCard title="Wallet Table">
//       <TableContainer
//         sx={{
//           width: {
//             xs: "274px",
//             sm: "100%",
//           },
//         }}
//       >
//         <Table
//           aria-label="simple table"
//           sx={{
//             whiteSpace: "nowrap",
//             mt: 0,
//           }}
//         >
//           <TableHead>
//             <TableRow>
//               <TableCell>
//                 <Typography color="textSecondary" variant="h6">
//                   Id
//                 </Typography>
//               </TableCell>
//               <TableCell>
//                 <Typography color="textSecondary" variant="h6">
//                   Name
//                 </Typography>
//               </TableCell>
//               <TableCell>
//                 <Typography color="textSecondary" variant="h6">
//                   Address
//                 </Typography>
//               </TableCell>
//               <TableCell align="right">
//                 <Typography color="textSecondary" variant="h6">
//                   Balance
//                 </Typography>
//               </TableCell>
//               <TableCell align="right">
//                 <Typography color="textSecondary" variant="h6">
//                   Realized Perf
//                 </Typography>
//               </TableCell>
//               <TableCell align="right">
//                 <Typography color="textSecondary" variant="h6">
//                   UnRealized Perf
//                 </Typography>
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {wallets.map((wallet) => (
//               <TableRow key={wallet.name}>
//                 <TableCell>
//                   <Typography fontSize="14px" fontWeight={500}>
//                     {wallet.id}
//                   </Typography>
//                 </TableCell>
//                 <TableCell>
//                   <Box display="flex" alignItems="center">
//                     <Box>
//                       <Typography fontSize="14px" fontWeight={600}>
//                         {wallet.name}
//                       </Typography>
//                       <Typography color="textSecondary" fontSize="13px">
//                         {wallet.description}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </TableCell>
//                 <TableCell>
//                   <Box display="flex" alignItems="center">
//                     <Box>
//                       <Typography fontSize="14px">{wallet.address}</Typography>
//                     </Box>
//                   </Box>
//                 </TableCell>
//                 <TableCell align="right">
//                   <Typography fontSize="14px">${wallet.balance}</Typography>
//                 </TableCell>
//                 <TableCell align="right">
//                   <Chip
//                     sx={{
//                       pl: "4px",
//                       pr: "4px",
//                       backgroundColor: "",
//                       // wallet.realized_color,
//                       color: "#fff",
//                     }}
//                     size="small"
//                     label="0"
//                     // label={wallet.realized}
//                   ></Chip>
//                 </TableCell>
//                 <TableCell align="right">
//                   <Chip
//                     sx={{
//                       pl: "4px",
//                       pr: "4px",
//                       backgroundColor: "",
//                       // backgroundColor: wallet.unrealized_color,
//                       color: "#fff",
//                     }}
//                     size="small"
//                     label="0"
//                     // label={wallet.unrealized}
//                   ></Chip>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </BaseCard>
//   );

// }

// const ProductPerfomance = ({}) => {
//   return (
//     <BaseCard title="Wallet Table">
//       <TableContainer
//         sx={{
//           width: {
//             xs: "274px",
//             sm: "100%",
//           },
//         }}
//       >
//         <Table
//           aria-label="simple table"
//           sx={{
//             whiteSpace: "nowrap",
//             mt: 0,
//           }}
//         >
//           <TableHead>
//             <TableRow>
//               <TableCell>
//                 <Typography color="textSecondary" variant="h6">
//                   Id
//                 </Typography>
//               </TableCell>
//               <TableCell>
//                 <Typography color="textSecondary" variant="h6">
//                   Name
//                 </Typography>
//               </TableCell>
//               <TableCell>
//                 <Typography color="textSecondary" variant="h6">
//                   Address
//                 </Typography>
//               </TableCell>
//               <TableCell align="right">
//                 <Typography color="textSecondary" variant="h6">
//                   Balance
//                 </Typography>
//               </TableCell>
//               <TableCell align="right">
//                 <Typography color="textSecondary" variant="h6">
//                   Realized Perf
//                 </Typography>
//               </TableCell>
//               <TableCell align="right">
//                 <Typography color="textSecondary" variant="h6">
//                   UnRealized Perf
//                 </Typography>
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {products.map((product) => (
//               <TableRow key={product.name}>
//                 <TableCell>
//                   <Typography fontSize="14px" fontWeight={500}>
//                     {product.id}
//                   </Typography>
//                 </TableCell>
//                 <TableCell>
//                   <Box display="flex" alignItems="center">
//                     <Box>
//                       <Typography fontSize="14px" fontWeight={600}>
//                         {product.name}
//                       </Typography>
//                       <Typography color="textSecondary" fontSize="13px">
//                         {product.description}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </TableCell>
//                 <TableCell>
//                   <Box display="flex" alignItems="center">
//                     <Box>
//                       <Typography fontSize="14px">{product.address}</Typography>
//                     </Box>
//                   </Box>
//                 </TableCell>
//                 <TableCell align="right">
//                   <Typography fontSize="14px">${product.amount}</Typography>
//                 </TableCell>
//                 <TableCell align="right">
//                   <Chip
//                     sx={{
//                       pl: "4px",
//                       pr: "4px",
//                       backgroundColor: product.realized_color,
//                       color: "#fff",
//                     }}
//                     size="small"
//                     label={product.realized}
//                   ></Chip>
//                 </TableCell>
//                 <TableCell align="right">
//                   <Chip
//                     sx={{
//                       pl: "4px",
//                       pr: "4px",
//                       backgroundColor: product.unrealized_color,
//                       color: "#fff",
//                     }}
//                     size="small"
//                     label={product.unrealized}
//                   ></Chip>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </BaseCard>
//   );
// };

// export default ProductPerfomance;
