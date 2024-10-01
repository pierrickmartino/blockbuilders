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

import { Position, Wallet } from "../../../lib/definition";
// import { fetchWallets } from "../../../lib/data";
import { IconDotsVertical } from "@tabler/icons-react";

// Define the props type that will be passed into WalletTable
interface PositionTableProps {
  positions: Position[];
}

const PositionTable: React.FC<PositionTableProps> = ({ positions }) => {
  // const [wallets, setWallets] = useState<Wallet[]>([]);

  // useEffect(() => {
  //   // Call fetchWallets function when the component mounts
  //   fetchWallets(setWallets);
  // }, []);
  
  return (
    <BaseCard title="Position Table">
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
            {positions.map((position : Position) => (
              <TableRow key={position.id}>
                <TableCell>
                  <Typography fontSize="14px">
                    {position.contract}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Box>
                      <Typography fontSize="14px">
                        {position.perf_daily}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box display="flex" alignItems="right">
                    <Box>
                      <Typography fontSize="14px">{position.price}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box display="flex" alignItems="right">
                    <Box>
                      <Typography fontSize="14px">{position.quantity}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box display="flex" alignItems="right">
                    <Box>
                      <Typography fontSize="14px">{position.amount}</Typography>
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
                    label={position.capital_gain}
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
                    label={position.unrealized_gain}
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

export default PositionTable;