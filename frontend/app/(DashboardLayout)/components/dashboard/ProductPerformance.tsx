import React, { useState, useEffect } from "react";
import axios from "axios";

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
} from "@mui/material";
import BaseCard from "../shared/DashboardCard";

const products = [
  {
    id: "1",
    name: "Wallet 1",
    address: "0x040b5f7de5b22a7a409bfa…",
    description: "description gdsfs 1",
    amount: "4,881.54",
    realized: "$412.92",
    realized_color: "success.main",
    unrealized: "$772.92",
    unrealized_color: "success.main",
  },
  {
    id: "2",
    name: "Wallet 2",
    address: "0x040b5f7de5b22a7a409bfa…",
    description: "description gdsfs 2",
    amount: "24.5",
    realized: "$4,012.92",
    realized_color: "success.main",
    unrealized: "$112.92",
    unrealized_color: "success.main",
  },
  {
    id: "3",
    name: "Wallet 3",
    address: "0x040b5f7de5b22a7a409bfa…",
    description: "description gdsfs 3",
    amount: "12.8",
    realized: "$-1,012.92",
    realized_color: "error.main",
    unrealized: "$-512.92",
    unrealized_color: "error.main",
  },
  {
    id: "4",
    name: "Wallet 4",
    address: "0x040b5f7de5b22a7a409bfa…",
    description: "description gdsfs 4",
    amount: "2.4",
    realized: "$-912.92",
    realized_color: "error.main",
    unrealized: "$-62.92",
    unrealized_color: "error.main",
  },
];

interface Wallet {
  id: number;
  name: string;
  address: string;
  description: string;
  balance: string;
}

interface WalletInterfaceProps {
  backendName: string;
}

const ProductPerfomance: React.FC<WalletInterfaceProps> = ({ backendName }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [newWallet, setNewWallet] = useState({ name: '', address: '', description: '', balance: '' });
  const [updateWallet, setUpdateWallet] = useState({ id: '', name: '', address: '', description: '', balance: '' });

   // Fetch users
   useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/wallets/`, {
          headers: {
            'Authorization': 'Token c40feb748f0e17b3d7472ed387a566e9d632d4c8',
        }
        });
        const results = response.data.results || [];
        setWallets(results.reverse());
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [backendName, apiUrl]);

  // Create a wallet
  const createWallet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/wallets/`, newWallet);
      setWallets([response.data, ...wallets]);
      setNewWallet({ name: '', address: '', description: '', balance: '' });
    } catch (error) {
      console.error('Error creating wallet:', error);
    }
  };

  // Update a wallet
  const handleUpdateWallet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.put(`${apiUrl}/api/wallets/${updateWallet.id}`, { name: updateWallet.name, address: updateWallet.address, description: updateWallet.description, balance:updateWallet.balance, });
      setUpdateWallet({ id: '', name: '', address: '', balance: '', description: '' });
      setWallets(
        wallets.map((wallet) => {
          if (wallet.id === parseInt(updateWallet.id)) {
            return { ...wallet, name: updateWallet.name, address: updateWallet.address, description: updateWallet.description, balance:updateWallet.balance, };
          }
          return wallet;
        })
      );
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Delete a wallet
  const deleteWallet = async (walletId: number) => {
    try {
      await axios.delete(`${apiUrl}/api/wallets/${walletId}`);
      setWallets(wallets.filter((wallet) => wallet.id !== walletId));
    } catch (error) {
      console.error('Error deleting wallet:', error);
    }
  };

  return (
    <BaseCard title="Wallet Table">
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
            </TableRow>
          </TableHead>
          <TableBody>
            {wallets.map((wallet) => (
              <TableRow key={wallet.name}>
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
                      <Typography fontSize="14px">{wallet.address}</Typography>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </BaseCard>
  );

}

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

export default ProductPerfomance;
