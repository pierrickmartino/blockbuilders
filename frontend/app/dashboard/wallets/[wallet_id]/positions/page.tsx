"use client";
import { Grid, Box, TextField, Stack, Card, Typography, Switch, FormGroup, FormControlLabel } from "@mui/material";
// components
import { useEffect, useState } from "react";
import { Position } from "@/app/lib/definition";
import { fetchPositions } from "@/app/lib/data";
import PageContainer from "@/app/dashboard/components/container/PageContainer";
import PositionTable from "@/app/dashboard/components/dashboard/PositionTable";
import { useParams } from "next/navigation";

const Positions = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [page, setPage] = useState(0); // State for current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // State for rows per page
  const [totalCount, setTotalCount] = useState(0); // State for total number of items

  const params = useParams();
  const wallet_id = params.wallet_id;

  const fetchPositionData = async () => {
    if (wallet_id) {
      await fetchPositions(
        String(wallet_id),
        setPositions,
        setTotalCount,
        page,
        rowsPerPage
      );
    }
  };

  useEffect(() => {
    fetchPositionData();
    // console.log("Positions after fetching:", positions); // Log positions
  }, [wallet_id, page, rowsPerPage]);

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

  const handleSearch = (term: string) => {
    console.log(term);
  };

  return (
    <PageContainer title="Positions" description="this is Positions">
      <Box mt={3}>
        <Grid container spacing={3}>
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
                  <TextField
                    id="search"
                    label="Search"
                    variant="standard"
                    // value={formData.address}
                    onChange={(e) => {
                      handleSearch(e.target.value);
                    }}
                    // error={!!state.errors?.address}
                    // helperText={state.errors?.address?.[0]}
                  />
                  <FormGroup>
                    <FormControlLabel control={<Switch />} label="Only relevant positions" />
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
