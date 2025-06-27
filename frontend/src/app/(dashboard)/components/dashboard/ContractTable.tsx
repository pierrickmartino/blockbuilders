import React, { Fragment } from "react";

import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer, TablePagination, IconButton } from "@mui/material";
import { Contract } from "../../../../lib/definition";
import { formatNumber } from "@/lib/format";
import { IconDotsVertical } from "@tabler/icons-react";
import BasicCard from "../shared/BasicCard";
import { Heading } from "@/components/Heading";

// Define the props type that will be passed into ContractTable
interface ContractTableProps {
  contracts: Contract[];
  page: number;
  rowsPerPage: number;
  totalCount: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
}

const ContractTable: React.FC<ContractTableProps> = ({ contracts, page, rowsPerPage, totalCount, onPageChange, onRowsPerPageChange }) => {
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    onPageChange(newPage); // Call the passed prop to update the page state in the parent
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10)); // Call the passed prop to update the rows per page state
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <BasicCard title="Contract History" subtitle="A detailed log of all recent contracts">
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
                  <Heading variant="h6">Blockchain</Heading>
                </TableCell>
                <TableCell>
                  <Heading variant="h6">Name</Heading>
                </TableCell>
                <TableCell>
                  <Heading variant="h6">Symbol</Heading>
                </TableCell>
                <TableCell>
                  <Heading variant="h6">Address</Heading>
                </TableCell>
                <TableCell>
                  <Heading variant="h6">Category</Heading>
                </TableCell>
                <TableCell align="right">
                  <Heading variant="h6">Price</Heading>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contracts.map((contract: Contract) => (
                <TableRow key={contract.id}>
                  <TableCell>
                    <Heading variant="body" className="text-gray-700">
                      {contract.blockchain.name}
                    </Heading>
                  </TableCell>
                  <TableCell>
                    <Heading variant="body" className="text-gray-700">
                      {contract.name}
                    </Heading>
                  </TableCell>
                  <TableCell>
                    <Heading variant="body" className="text-gray-700">
                      {contract.symbol}
                    </Heading>
                  </TableCell>
                  <TableCell>
                    <Heading variant="body" className="text-gray-700">
                      {truncateText(contract.address, 15)}
                    </Heading>
                  </TableCell>
                  <TableCell>
                    <Heading variant="body" className="text-gray-700">
                      {contract.category}
                    </Heading>
                  </TableCell>
                  <TableCell align="right">
                    <Heading variant="body" className="text-gray-700">
                      {formatNumber(contract.price, "currency")}
                    </Heading>
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
    </BasicCard>
  );
};

export default ContractTable;
