"use client";
import {
  Box,
  Stack,
  Card,
  Typography,
  Switch,
  FormGroup,
  FormControlLabel,
  Link,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect, useState, useCallback } from "react";
import { Position } from "@/app/lib/definition";
import { fetchPositions, fetchPositionsWithSearch } from "@/app/lib/data";
import PositionTable from "@/app/dashboard/components/dashboard/PositionTable";
import { useParams } from "next/navigation";
import { SearchForm } from "@/app/ui/shared/SearchForm";
import formatNumber from "@/app/utils/formatNumber";
import CustomCard from "@/app/dashboard/components/shared/CustomCard";
import StatCard, {
  StatCardProps,
} from "@/app/dashboard/components/dashboard/StatCard";
import HighlightedCard from "@/app/dashboard/components/dashboard/HighlightedCard";

const Positions = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [page, setPage] = useState(0); // State for current page
  const [rowsPerPage, setRowsPerPage] = useState(25); // State for rows per page
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

  const data: StatCardProps[] = [
    {
      title: "Total amount",
      value: "14k",
      interval: "Last 30 days",
      trend: "up",
      data: [
        200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360,
        340, 380, 360, 400, 380, 420, 400, 640, 340, 460, 440, 480, 460, 600,
        880, 920,
      ],
    },
    {
      title: "Total capital gain",
      value: "325",
      interval: "Last 30 days",
      trend: "down",
      data: [
        1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820, 840,
        600, 820, 780, 800, 760, 380, 740, 660, 620, 840, 500, 520, 480, 400,
        360, 300, 220,
      ],
    },
    {
      title: "Total unrealized",
      value: "200k",
      interval: "Last 30 days",
      trend: "neutral",
      data: [
        500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530, 620,
        510, 530, 520, 410, 530, 520, 610, 530, 520, 610, 530, 420, 510, 430,
        520, 510,
      ],
    },
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Positions
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <HighlightedCard />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
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
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
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
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
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
          {positions.length > 0 && positions[0]?.wallet ? (
            <PositionTable
              positions={positions}
              wallet={positions[0].wallet}
              page={page}
              rowsPerPage={rowsPerPage}
              totalCount={totalCount}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onContractSetAsStable={handleContractSetAsStable}
              onContractSetAsSuspicious={handleContractSetAsSuspicious}
            />
          ) : (
            <Typography>No data available</Typography> // Fallback if positions are not available
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Positions;
