'use client'
import { Grid, Box } from '@mui/material';
import PageContainer from '../components/container/PageContainer';
// components
import SalesOverview from '../components/dashboard/TheSalesOverview';
import Blogcard from '../components/dashboard/TheBlogCard';
import ProfileCard from "../components/dashboard/TheProfileCard";
import MyContacts from "../components/dashboard/TheMyContacts";
import ActivityTimeline from "../components/dashboard/TheActivityTimeline";
import ProductPerfomance from "../components/dashboard/ProductPerformance";
import Top5Positions from '../components/dashboard/TheTop5Positions';

const Dashboard = () => {
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
            <Top5Positions />
          </Grid>
          <Grid item xs={12} lg={8}>
            <SalesOverview />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Blogcard />
          </Grid>
          <Grid item xs={12} lg={12}>
            <ProductPerfomance backendName="backend" />
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
  )
}

export default Dashboard;
