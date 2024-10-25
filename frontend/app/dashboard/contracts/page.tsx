"use client";
import {
  Grid,
  Box,
  Card,
  Stack,
  Typography,
  Chip,
  Button,
  Link,
  Breadcrumbs,
} from "@mui/material";
// components
import { useEffect, useState } from "react";
import { Contract } from "@/app/lib/definition";
import { fetchContractsAll, fetchContractsAllWithSearch } from "@/app/lib/data";
import PageContainer from "@/app/dashboard/components/container/PageContainer";
import { useParams } from "next/navigation";
import { SearchForm } from "@/app/ui/shared/SearchForm";
import CustomCard from "@/app/dashboard/components/shared/CustomCard";
import formatNumber from "@/app/utils/formatNumber";
import {
  ArrowDropDown,
  ArrowDropUp,
  NavigateBefore,
  NavigateNext,
} from "@mui/icons-material";
import ContractTable from "../components/dashboard/ContractTable";

const Contracts = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [page, setPage] = useState(0); // State for current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // State for rows per page
  const [totalCount, setTotalCount] = useState(0); // State for total number of items

  // const params = useParams();
  // const wallet_id = params.wallet_id;
  // const position_id = params.position_id;

  const fetchContractData = async () => {    
      await fetchContractsAll(
        setContracts,
        setTotalCount,
        page,
        rowsPerPage
      );
  };

  const fetchContractDataWithSearch = async (searchTerm: string) => {
      await fetchContractsAllWithSearch(
        String(searchTerm),
        setContracts,
        setTotalCount,
        page,
        rowsPerPage
      );
  };

  useEffect(() => {
    fetchContractData();
  }, [page, rowsPerPage]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage); // Update page state
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage); // Update rows per page state
    setPage(0); // Reset page to 0 whenever rows per page changes
  };

  const handleSearch = (searchTerm: string) => {
    // Implement your search logic here, such as making API calls
    fetchContractDataWithSearch(searchTerm);
  };

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/dashboard/wallets/">
      Dashboard
    </Link>,
    contracts.length > 0 ? (
      <Typography key="2" sx={{ color: "text.primary" }}>
        Contracts
      </Typography>
    ) : (
      <Typography key="2" sx={{ color: "text.primary" }}>
        Loading Contracts...
      </Typography>
    ),
  ];

  return (
    <PageContainer title="Contracts" description="this is Contracts">
      <Box mt={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="textSecondary" variant="h4">
                Contracts
              </Typography>
              <Button
                variant="outlined"
                startIcon={<NavigateBefore />}
                href={`/dashboard/wallets/`}
              >
                {" "}
                Back
              </Button>
            </Stack>
            <Breadcrumbs
              separator={<NavigateNext fontSize="small" />}
              aria-label="breadcrumb"
            >
              {breadcrumbs}
            </Breadcrumbs>
          </Grid>
          <Grid item xs={12} lg={12}>
            <Card variant="outlined" sx={{ p: 3 }}>
              <Box px={0} py={0} mb="-15px">
                <Typography variant="h5">Filter</Typography>
              </Box>
              <Box px={0} py={0} mt={3}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  justifyContent="space-between"
                  mb={0}
                >
                  <SearchForm onSearch={handleSearch} />
                </Stack>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} lg={12}>
            <ContractTable
              contracts={contracts}
              page={page}
              rowsPerPage={rowsPerPage}
              totalCount={totalCount}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Contracts;
