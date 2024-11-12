import React, { Fragment } from "react";

import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TablePagination,
  Stack,
  IconButton,
} from "@mui/material";
import BaseCard from "../shared/DashboardCard";
import { Contract } from "../../../lib/definition";
import formatNumber from "@/app/utils/formatNumber";
import { IconDotsVertical } from "@tabler/icons-react";

// Define the props type that will be passed into WalletTable
interface ContractTableProps {
  contracts: Contract[];
  page: number;
  rowsPerPage: number;
  totalCount: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
}

const ContractTable: React.FC<ContractTableProps> = ({
  contracts,
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
}) => {
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

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <BaseCard
      title="Contract History"
      subtitle="A detailed log of all recent contracts"
    >
      <Fragment>
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
                  <Typography variant="h6">Blockchain</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Name</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Symbol</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Address</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Category</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">Price</Typography>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contracts.map((contract: Contract) => (
                <TableRow key={contract.id}>
                  <TableCell>
                    <Typography color="textSecondary">
                      {contract.blockchain.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="textSecondary">
                      {contract.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="textSecondary">
                      {contract.symbol}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="textSecondary">
                      {truncateText(contract.address, 15)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="textSecondary">
                      {contract.category}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography color="textSecondary">
                      {formatNumber(contract.price, "currency")}
                    </Typography>
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
        <TablePagination
          component="div"
          rowsPerPageOptions={[5, 10, 25, 50]}
          count={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Fragment>
    </BaseCard>
  );
};

export default ContractTable;
