"use client";
import {
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
import Grid from "@mui/material/Grid2";
import { useEffect, useState, useCallback } from "react";
import { Position } from "@/app/lib/definition";
import { fetchPositions, fetchPositionsWithSearch } from "@/app/lib/data";
import PageContainer from "@/app/dashboard/components/container/PageContainer";
import PositionTable from "@/app/dashboard/components/dashboard/PositionTable";
import { useParams } from "next/navigation";
import { SearchForm } from "@/app/ui/shared/SearchForm";
import formatNumber from "@/app/utils/formatNumber";
import CustomCard from "@/app/dashboard/components/shared/CustomCard";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";

const Positions = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [page, setPage] = useState(0); // State for current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // State for rows per page
  const [totalCount, setTotalCount] = useState(0); // State for total number of items

  const params = useParams();
  const wallet_id = params.wallet_id;

  const fetchPositionData = useCallback(async () => {
    if (wallet_id) {
      await fetchPositions(
        String(wallet_id),
        setPositions,
        setTotalCount,
        page,
        rowsPerPage
      );
    }
  }, [wallet_id, page, rowsPerPage]);

  useEffect(() => {
    fetchPositionData();
  }, [fetchPositionData]);

  const fetchPositionDataWithSearch = async (searchTerm: string) => {
    if (wallet_id) {
      await fetchPositionsWithSearch(
        String(wallet_id),
        String(searchTerm),
        setPositions,
        setTotalCount,
        page,
        rowsPerPage
      );
    }
  };

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
    <Link underline="hover" key="1" color="inherit" href="/dashboard">
      Dashboard
    </Link>,

    positions.length > 0 ? (
      <Typography key="2" color="textPrimary">
        Positions in wallet {positions[0].wallet.name}
      </Typography>
    ) : (
      <Typography key="2" color="textPrimary">
        Loading Positions...
      </Typography>
    ),
  ];

  return (
    <PageContainer title="Positions" description="this is Positions">
      <Box mt={1}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 12 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="textPrimary" variant="h4">
                Positions
              </Typography>
              <Button
                variant="outlined"
                size="small"
                href="/dashboard"
              >
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
          <Grid size={{ xs: 12, lg: 4 }}>
            <CustomCard title="Total Amount">
              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                {positions.length > 0 && positions[0]?.wallet ? (
                  <Typography color="textSecondary" variant="h3">
                    {formatNumber(positions[0].wallet.balance, "currency")}
                  </Typography>
                ) : (
                  <Typography>No data available</Typography> // Fallback if positions are not available
                )}
              </Stack>
            </CustomCard>
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <CustomCard title="Total Capital Gain">
              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                {positions.length > 0 && positions[0]?.wallet ? (
                  <Typography color="textSecondary" variant="h3">
                    {formatNumber(positions[0].wallet.capital_gain, "currency")}
                  </Typography>
                ) : (
                  <Typography>No data available</Typography> // Fallback if positions are not available
                )}
              </Stack>
            </CustomCard>
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <CustomCard title="Total Unrealized">
              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                {positions.length > 0 && positions[0]?.wallet ? (
                  <Typography color="textSecondary" variant="h3">
                    {formatNumber(
                      positions[0].wallet.unrealized_gain,
                      "percentage"
                    )}
                  </Typography>
                ) : (
                  <Typography>No data available</Typography> // Fallback if positions are not available
                )}
              </Stack>
            </CustomCard>
          </Grid>
          <Grid size={{ xs: 12, lg: 12 }}>
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
          <Grid size={{ xs: 12, lg: 12 }}>
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
