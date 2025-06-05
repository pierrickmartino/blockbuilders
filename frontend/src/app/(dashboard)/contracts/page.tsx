"use client";
import { Box, Stack, Link, Breadcrumbs } from "@mui/material";
// components
import Grid from "@mui/material/Grid2";
import { useEffect, useState, useCallback } from "react";
import { Contract } from "@/lib/definition";
import { fetchContractsAll, fetchContractsAllWithSearch } from "@/lib/data";
import PageContainer from "@/app/(dashboard)/components/container/PageContainer";
import { SearchForm } from "@/components/SearchForm";
import { NavigateNext } from "@mui/icons-material";
import ContractTable from "../components/dashboard/ContractTable";
import { Card } from "@/components/Card";
import { Heading } from "@/components/Heading";

const Contracts = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [page, setPage] = useState(0); // State for current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // State for rows per page
  const [totalCount, setTotalCount] = useState(0); // State for total number of items

  // Memoize fetchContractData using useCallback
  const fetchContractData = useCallback(async () => {
    await fetchContractsAll(setContracts, setTotalCount, page, rowsPerPage);
  }, [page, rowsPerPage]); // Dependencies include page and rowsPerPage

  // Use useEffect to call fetchContractData
  useEffect(() => {
    fetchContractData();
  }, [fetchContractData]); // Include fetchContractData as a dependency

  const fetchContractDataWithSearch = async (searchTerm: string) => {
    await fetchContractsAllWithSearch(String(searchTerm), setContracts, setTotalCount, page, rowsPerPage);
  };

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
    <Link underline="hover" key="1" color="inherit" href="/overview">
      Dashboard
    </Link>,
    contracts.length > 0 ? (
      <Heading key="2" variant="body">
        Contracts
      </Heading>
    ) : (
      <Heading key="2" variant="body">
        Loading Contracts...
      </Heading>
    ),
  ];

  return (
    <PageContainer title="Contracts" description="this is Contracts">
      <Box mt={0}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 12 }}>
            <Stack direction="row" justifyContent="space-between">
              <Heading variant="h4">Contracts</Heading>
            </Stack>
            <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb">
              {breadcrumbs}
            </Breadcrumbs>
          </Grid>
          <Grid size={{ xs: 12, lg: 12 }}>
            <Card>
              <Box px={0} py={0} mb="-15px">
                <Heading variant="h5">Filter</Heading>
              </Box>
              <Box px={0} py={0} mt={3}>
                <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between" mb={0}>
                  <SearchForm onSearch={handleSearch} />
                </Stack>
              </Box>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, lg: 12 }}>
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
