'use client'
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import PageContainer from './components/container/PageContainer';
// components
import SalesOverview from './components/dashboard/TheSalesOverview';
import Blogcard from './components/dashboard/TheBlogCard';
import ProfileCard from "./components/dashboard/TheProfileCard";
import MyContacts from "./components/dashboard/TheMyContacts";
import ActivityTimeline from "./components/dashboard/TheActivityTimeline";
import ProductPerformance from './components/dashboard/ProductPerformance';

const Dashboard = () => {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box mt={3}>
        <Grid container spacing={3}>
          <Grid size={{ xs:12, lg:8 }}>
            <SalesOverview />
          </Grid>
          <Grid size={{ xs:12, lg:4 }}>
            <Blogcard />
          </Grid>
          <Grid size={{ xs:12, lg:12 }}>
            <ProductPerformance />
          </Grid>
          <Grid size={{ xs:12, lg:4 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs:12 }}>
                <ProfileCard />
              </Grid>
              <Grid size={{ xs:12 }}>
                <MyContacts />
              </Grid>
            </Grid>
          </Grid>
          <Grid size={{ xs:12, lg:8 }}>
            <ActivityTimeline />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  )
}

export default Dashboard;
