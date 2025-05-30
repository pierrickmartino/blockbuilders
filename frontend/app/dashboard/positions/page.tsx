"use client";
import { Box, Stack, Typography, Drawer } from "@mui/material";
// components
import Grid from "@mui/material/Grid2";
import { useEffect, useState, useCallback } from "react";
import { Position } from "@/lib/definition";
import { fetchPositionsAll, fetchPositionsAllWithSearch, fetchTaskStatus } from "@/lib/data";
import PositionTable from "@/app/dashboard/components/dashboard/PositionTable";
import { useToast } from "@/lib/useToast";
import { Toaster } from "@/components/shared/Toaster";

const Positions = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [page, setPage] = useState(0); // State for current page
  const [rowsPerPage, setRowsPerPage] = useState(25); // State for rows per page
  const [totalCount, setTotalCount] = useState(0); // State for total number of items

  // Memoize fetchPositionData using useCallback
  const fetchPositionData = useCallback(async () => {
    await fetchPositionsAll(setPositions, setTotalCount, page, rowsPerPage);
  }, [page, rowsPerPage]); // Dependencies include page and rowsPerPage

  const [taskPolling, setTaskPolling] = useState<{
    [taskId: string]: NodeJS.Timeout;
  }>({}); // New state for task polling

  // Use useEffect to call fetchPositionData
  useEffect(() => {
    fetchPositionData();
    // console.log("Positions after fetching:", positions); // Log positions
  }, [fetchPositionData]); // Include fetchPositionData as a dependency

  const fetchPositionDataWithSearch = async (searchTerm: string) => {
    await fetchPositionsAllWithSearch(String(searchTerm), setPositions, setTotalCount, page, rowsPerPage);
  };

  const { toast } = useToast();

  // New function to poll task status
  const pollTaskStatus = (taskId: string) => {
    const intervalId = setInterval(async () => {
      try {
        const status = await fetchTaskStatus(taskId);
        console.log("Task result in pollTaskStatus:", status);
        if (status === "SUCCESS") {
          toast({
            title: "Great News !",
            description: `Task ${taskId} finished successfully.`,
            variant: "success",
            duration: 3000,
          });
          clearInterval(taskPolling[taskId]);
          setTaskPolling((prev) => {
            const { [taskId]: _, ...remainingPolling } = prev; // Remove the completed task
            return remainingPolling;
          });
        }
      } catch (error) {
        console.error("Error polling task status:", error);
        clearInterval(intervalId);
        setTaskPolling((prev) => {
          const { [taskId]: _, ...remainingPolling } = prev; // Remove the errored task
          return remainingPolling;
        });
      }
    }, 3000); // Poll every 3 seconds

    setTaskPolling((prev) => ({
      ...prev,
      [taskId]: intervalId,
    }));
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

  const handleContractInfoDownloaded = (taskId: string) => {
    // handleClick("Refresh in progress for " + taskId, "Info", "info");
    pollTaskStatus(taskId); // Start polling task status
  };

  /* Drawer for transaction detail */
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };
  const handleShowPositionDrawer = () => {
    toggleDrawer(true);
  };

  const DrawerList = (
    <Box sx={{ width: 350, height: "100%" }} role="presentation">
      {/* <CreateWalletForm /> */}
    </Box>
  );

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
          Positions
        </Typography>
      </Stack>
      <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
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
            onContractInfoDownloaded={handleContractInfoDownloaded}
            onPositionClick={handleShowPositionDrawer}
          />
        </Grid>
      </Grid>
      <Toaster />
      <Drawer anchor="right" open={drawerOpen} onClose={() => toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </Box>
  );
};

export default Positions;
