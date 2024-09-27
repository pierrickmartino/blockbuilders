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
} from "@mui/material";
import BaseCard from "../shared/DashboardCard";

import { Transaction } from "../../../lib/definition";
// import { fetchWallets } from "../../../lib/data";
import { IconDotsVertical } from "@tabler/icons-react";

// Define the props type that will be passed into WalletTable
interface TransactionTableProps {
  transactions: Transaction[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  // const [wallets, setWallets] = useState<Wallet[]>([]);

  // useEffect(() => {
  //   // Call fetchWallets function when the component mounts
  //   fetchWallets(setWallets);
  // }, []);
  
  return (
    <BaseCard title="Transaction Table">
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
              <TableCell align="right">
                <Typography color="textSecondary" variant="h6">
                  Price
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography color="textSecondary" variant="h6">
                  Quantity
                </Typography>
              </TableCell>
              <TableCell align="right">
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
              <TableCell>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction : Transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <Typography fontSize="14px">
                    {transaction.contract}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Box>
                      <Typography fontSize="14px">
                        {transaction.perf_daily}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="right">
                    <Box>
                      <Typography fontSize="14px">{transaction.price}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="right">
                    <Box>
                      <Typography fontSize="14px">{transaction.quantity}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="right">
                    <Box>
                      <Typography fontSize="14px">{transaction.amount}</Typography>
                    </Box>
                  </Box>
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
                    label={transaction.realized_gain}
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
                    label={transaction.unrealized_gain}
                  ></Chip>
                </TableCell>
                <TableCell>
                <IconButton>
                  <IconDotsVertical width={18} />
                </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </BaseCard>
  );

}

export default TransactionTable;