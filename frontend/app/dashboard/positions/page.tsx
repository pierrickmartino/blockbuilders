"use client";
import {
  Grid,
  Box,
  Stack,
  Card,
  Typography,
  Switch,
  FormGroup,
  FormControlLabel,
  Button,
  Link,
  Breadcrumbs,
} from "@mui/material";
// components
import { useEffect, useState } from "react";
import { Position } from "@/app/lib/definition";
import { fetchPositionsAll, fetchPositionsAllWithSearch } from "@/app/lib/data";
import PageContainer from "@/app/dashboard/components/container/PageContainer";
import PositionTable from "@/app/dashboard/components/dashboard/PositionTable";
import { SearchForm } from "@/app/ui/shared/SearchForm";
import formatNumber from "@/app/utils/formatNumber";
import CustomCard from "@/app/dashboard/components/shared/CustomCard";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";

const Positions = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [page, setPage] = useState(0); // State for current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // State for rows per page
  const [totalCount, setTotalCount] = useState(0); // State for total number of items

  const fetchPositionData = async () => {
    await fetchPositionsAll(setPositions, setTotalCount, page, rowsPerPage);
  };

  const fetchPositionDataWithSearch = async (searchTerm: string) => {
    await fetchPositionsAllWithSearch(
      String(searchTerm),
      setPositions,
      setTotalCount,
      page,
      rowsPerPage
    );
  };

  useEffect(() => {
    fetchPositionData();
    // console.log("Positions after fetching:", positions); // Log positions
  }, [page, rowsPerPage]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage); // Update page state
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage); // Update rows per page state
    setPage(0); // Reset page to 0 whenever rows per page changes
  };

  const handleContractSetAsSuspicious = () => {
    fetchPositionData(); // Re-fetch wallet data after a new wallet is created
  };

  const handleContractSetAsStable = () => {
    fetchPositionData(); // Re-fetch wallet data after a new wallet is created
  };

  const handleSearch = (searchTerm: string) => {
    // Implement your search logic here, such as making API calls
    fetchPositionDataWithSearch(searchTerm);
  };

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/dashboard/wallets/">
      Dashboard
    </Link>,

    positions.length > 0 ? (
      <Typography key="2" sx={{ color: "text.primary" }}>
        Positions
      </Typography>
    ) : (
      <Typography key="2" sx={{ color: "text.primary" }}>
        Loading Positions...
      </Typography>
    ),
  ];

  return (
    <PageContainer title="Positions" description="this is Positions">
      <Box mt={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="textSecondary" variant="h4">
                Positions
              </Typography>
              <Button
                variant="outlined"
                startIcon={<NavigateBefore />}
                href="/dashboard/wallets/"
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
                  <FormGroup>
                    <FormControlLabel
                      control={<Switch />}
                      label="Only relevant positions"
                    />
                  </FormGroup>
                </Stack>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} lg={12}>
            <PositionTable
              positions={positions}
              page={page}
              rowsPerPage={rowsPerPage}
              totalCount={totalCount}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onContractSetAsStable={handleContractSetAsStable}
              onContractSetAsSuspicious={handleContractSetAsSuspicious}
            />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Positions;
