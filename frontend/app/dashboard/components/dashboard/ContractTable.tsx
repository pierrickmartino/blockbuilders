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
} from "@mui/material";
import BaseCard from "../shared/DashboardCard";
import { Contract } from "../../../lib/definition";

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
            sx={{
              whiteSpace: "nowrap",
              mt: 0,
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography color="textSecondary" variant="h6">
                    Position
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography color="textSecondary" variant="h6">
                    Quantity
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography color="textSecondary" variant="h6">
                    Running Qty.
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography color="textSecondary" variant="h6">
                    Price
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography color="textSecondary" variant="h6">
                    Cost
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography color="textSecondary" variant="h6">
                    Total Cost
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography color="textSecondary" variant="h6">
                    Avg.Cost
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography color="textSecondary" variant="h6">
                    Cap.gain
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="h6">
                    Date
                  </Typography>
                </TableCell>
                {/* <TableCell>
              </TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {contracts.map((contract: Contract) => (
                <TableRow key={contract.id}>
                  <TableCell>
                    <Stack direction="row" spacing={2}>
                      <Stack>
                        <Typography fontSize="14px">
                          {contract.symbol}
                        </Typography>
                        <Typography fontSize="12px">
                          {contract.address}
                        </Typography>
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography
                      fontSize="12px"
                    >
                      {contract.category}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontSize="12px">
                      {
                        contract.name
                        }
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontSize="12px">
                      
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontSize="12px">
                      
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontSize="12px">
                      
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontSize="12px">
                      
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    
                  </TableCell>
                  <TableCell>
                    <Box display="flex">
                      <Box>
                        <Typography fontSize="12px">
                          
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  {/* <TableCell>
                <IconButton>
                  <IconDotsVertical width={18} />
                </IconButton>
                </TableCell> */}
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
