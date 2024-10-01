"use client";
import { Grid, Box } from "@mui/material";
// components
import { useEffect, useState } from "react";
import { Position } from "@/app/lib/definition";
import { fetchPositions } from "@/app/lib/data";
import PageContainer from "@/app/dashboard/components/container/PageContainer";
import PositionTable from "@/app/dashboard/components/dashboard/PositionTable";
import { useParams } from "next/navigation";

const Positions = () => {
  const [positions, setPositions] = useState<Position[]>([]);

  const params = useParams(); 
  const wallet_id = params.wallet_id;

  const fetchPositionData = async () => {
    if (wallet_id) {
      await fetchPositions(String(wallet_id), setPositions);
    }
  };

  useEffect(() => {
    fetchPositionData();
  }, [wallet_id]);

  const handlePositionCreated = () => {
    fetchPositionData();
  };

  return (
    <PageContainer title="Positions" description="this is Positions">
      <Box mt={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <PositionTable positions={positions} />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Positions;
