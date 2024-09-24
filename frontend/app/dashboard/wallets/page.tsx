"use client";
import { Grid, Box } from "@mui/material";
import PageContainer from "../components/container/PageContainer";
// components
import SalesOverview from "../components/dashboard/TheSalesOverview";
import Blogcard from "../components/dashboard/TheBlogCard";
import ProfileCard from "../components/dashboard/TheProfileCard";
import MyContacts from "../components/dashboard/TheMyContacts";
import ActivityTimeline from "../components/dashboard/TheActivityTimeline";
import WalletTable from "../components/dashboard/WalletTable";
import Top5Positions from "../components/dashboard/TheTop5Positions";
import WalletWizard from "../components/dashboard/WalletWizard";
import { useEffect, useState } from "react";
import { Wallet } from "@/app/lib/definition";
import { fetchWallets } from "@/app/lib/data";

const Wallets = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);

  // Fetch wallets function
  const fetchWalletData = async () => {
    await fetchWallets(setWallets);
  };

  // Fetch wallets using the fetchWallets function from your data.ts file
  useEffect(() => {
    fetchWalletData(); // Pass setWallets directly to fetchWallets
  }, []);

  const handleWalletCreated = () => {
    fetchWalletData(); // Re-fetch wallet data after a new wallet is created
  };

  return (
    <PageContainer title="Wallets" description="this is Wallets">
      <Box mt={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={4}>
            <Top5Positions />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Top5Positions />
          </Grid>
          <Grid item xs={12} lg={4}>
            <WalletWizard onWalletCreated={handleWalletCreated} />
          </Grid>
          <Grid item xs={12} lg={8}>
            <SalesOverview />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Blogcard />
          </Grid>
          <Grid item xs={12} lg={12}>
            <WalletTable wallets={wallets} />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ProfileCard />
              </Grid>
              <Grid item xs={12}>
                <MyContacts />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={8}>
            <ActivityTimeline />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Wallets;
